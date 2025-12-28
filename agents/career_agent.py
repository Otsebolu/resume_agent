from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage

# IMPORT CONFIG HERE
from config import Config

from tools.resume_ops import compare_jds_tool
from tools.video_search import find_youtube_videos_tool

# Initialize Groq using Config variables
llm = ChatGroq(
    temperature=0, 
    model_name=Config.MODEL_NAME,  # <--- Now pulling from config
    api_key=Config.GROQ_API_KEY    # <--- Now pulling from config
)

# Bind the tools
tools = [compare_jds_tool, find_youtube_videos_tool]
llm_with_tools = llm.bind_tools(tools)

def career_node(state):
    """
    Decides the next step: Analyze Resume OR Search for Videos.
    """
    return {"messages": [llm_with_tools.invoke(state["messages"])]}
