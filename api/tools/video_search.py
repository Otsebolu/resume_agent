from langchain_core.tools import tool
from serpapi import GoogleSearch
from ..config import Config  # <--- IMPORT CONFIG

@tool
def find_youtube_videos_tool(missing_skill: str):
    """
    Searches for YouTube tutorials for a specific missing skill.
    Args:
        missing_skill: The specific technology or skill (e.g., 'SQL for beginners').
    """
    try:
        params = {
            "engine": "google_videos",
            "q": f"{missing_skill} tutorial",
            "api_key": Config.SERPAPI_API_KEY,
            "num": 3  
        }
        
        search = GoogleSearch(params)
        results = search.get_dict()
        video_results = results.get("video_results", [])
        
        # Clean up the data for the agent
        clean_results = []
        for video in video_results:
            clean_results.append({
                "title": video.get("title"),
                "link": video.get("link"),
                "thumbnail": video.get("thumbnail")
            })
            
        return str(clean_results)
        
    except Exception as e:
        return f"Error fetching videos: {e}"

