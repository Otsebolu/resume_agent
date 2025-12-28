from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode

from ..agents.career_agent import career_node, tools

# 1. Define State
class AgentState(TypedDict):
    messages: Annotated[List, add_messages]

# 2. Define Graph
workflow = StateGraph(AgentState)

# 3. Add Nodes
workflow.add_node("career_coach", career_node)
workflow.add_node("tools", ToolNode(tools))

# 4. Define Edges
workflow.set_entry_point("career_coach")

def should_continue(state):
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    return END

workflow.add_conditional_edges("career_coach", should_continue)
workflow.add_edge("tools", "career_coach")

# 5. Compile
app = workflow.compile()
