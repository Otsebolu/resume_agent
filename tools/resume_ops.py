from langchain_core.tools import tool

@tool
def compare_jds_tool(resume_text: str, job_description: str):
    """
    Compares a resume against a job description.
    Returns a formatted string with the resume content and job description for analysis.
    """
    # In a real app, you might do complex vector matching here.
    # For this agent, we will just return the raw text to the LLM 
    # and let the Agent's brain do the parsing/reasoning.
    
    # We return a structured string for the agent to reason about
    return f"RESUME_CONTENT: {resume_text}\n\nTARGET_JOB: {job_description}"

