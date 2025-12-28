from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from workflows.matching_flow import app as graph_app
from langchain_core.messages import HumanMessage, ToolMessage
import re
import ast
import PyPDF2
import io
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the Input Schema (What the frontend sends us - for backward compatibility)
class RequestBody(BaseModel):
    resume: str
    job_description: str

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Career Coach AI is running!"}

def parse_response(final_response: str, messages: list) -> dict:
    """Parse the agent response into structured JSON"""
    # Extract score (e.g., "60%", "85%")
    score_match = re.search(r'(\d+)%', final_response)
    score = int(score_match.group(1)) if score_match else 0
    
    # Extract reason - the full explanation text
    reason = final_response.strip()
    
    # Extract videos from tool results in message history
    videos = []
    for msg in messages:
        if isinstance(msg, ToolMessage):
            try:
                # Parse the string representation of the list from tool result
                video_data = ast.literal_eval(msg.content)
                if isinstance(video_data, list):
                    videos = [
                        {
                            "title": v.get("title", ""),
                            "video": v.get("link", ""),
                            "thumbnail": v.get("thumbnail", "")
                        }
                        for v in video_data if isinstance(v, dict) and v.get("link")
                    ]
                    if videos:
                        break
            except (ValueError, SyntaxError):
                # If parsing fails, try extracting from text response
                pass
    
    # If no videos from tool results, try parsing from text response
    if not videos:
        video_pattern = r'\*\s*([^\n]+?):\s*(https://www\.youtube\.com/watch\?v=[^\s]+)'
        matches = re.findall(video_pattern, final_response)
        for title, link in matches:
            videos.append({
                "title": title.strip(),
                "video": link,
                "thumbnail": ""  # Thumbnail not available from text parsing
            })
    
    return {
        "match_score": score,
        "reason": reason,
        "learning_plan": videos
    }

def extract_text_from_pdf(file: UploadFile) -> str:
    """Extract text from PDF file using PyPDF2"""
    try:
        contents = file.file.read()
        pdf_file = io.BytesIO(contents)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        logger.info(f"Extracted {len(text)} characters from PDF")
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting PDF: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")

@app.post("/api/analyze")
async def analyze_career_file(
    cv_file: UploadFile = File(..., description="PDF CV file"),
    job_description: str = Form(..., description="Job description text")
):
    """
    Endpoint that accepts PDF CV upload and job description, then triggers the Agent Workflow.
    """
    try:
        logger.info(f"Received CV file: {cv_file.filename}, size: {cv_file.size}")
        
        # Validate file type
        if not cv_file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Extract text from PDF
        resume_text = extract_text_from_pdf(cv_file)
        
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF. The file might be empty or corrupted.")
        
        # Create the initial prompt for the agent
        initial_prompt = (
            f"Here is a Job Description: {job_description} \n\n"
            f"Here is a Resume: {resume_text} \n\n"
            "Step 1: Compare them and calculate a percentage match score. "
            "Step 2: If the score is under 100%, identify the TOP missing skill. "
            "Step 3: Use the video tool to find 3 specific YouTube videos for that missing skill. "
            "Step 4: Final output should be the Score, the Reasoning, and the Video Links."
        )
        
        inputs = {"messages": [HumanMessage(content=initial_prompt)]}
        
        # Run the graph (invoke waits for the whole chain to finish)
        logger.info("Invoking agent workflow...")
        result = graph_app.invoke(inputs)
        
        # Extract the final message content
        final_response = result["messages"][-1].content
        
        # Parse and structure the response
        structured_response = parse_response(final_response, result["messages"])
        logger.info(f"Analysis complete. Match score: {structured_response['match_score']}%")
        
        return structured_response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in analyze_career_file: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
async def analyze_career(body: RequestBody):
    """
    Endpoint that triggers the Agent Workflow.
    """
    try:
        # Create the initial prompt for the agent
        initial_prompt = (
            f"Here is a Job Description: {body.job_description} \n\n"
            f"Here is a Resume: {body.resume} \n\n"
            "Step 1: Compare them and calculate a percentage match score. "
            "Step 2: If the score is under 100%, identify the TOP missing skill. "
            "Step 3: Use the video tool to find 3 specific YouTube videos for that missing skill. "
            "Step 4: Final output should be the Score, the Reasoning, and the Video Links."
        )
        
        inputs = {"messages": [HumanMessage(content=initial_prompt)]}
        
        # Run the graph (invoke waits for the whole chain to finish)
        result = graph_app.invoke(inputs)
        
        # Extract the final message content
        final_response = result["messages"][-1].content
        
        # Parse and structure the response
        structured_response = parse_response(final_response, result["messages"])
        
        return structured_response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
