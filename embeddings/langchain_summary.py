import os
from typing import List
from pydantic import BaseModel, Field

from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate

from dotenv import load_dotenv
load_dotenv()

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")

class JournalAnalysis(BaseModel):
    """Structured analysis of a user's journal entry."""
    emotions: List[str] = Field(description="A list of 3-5 primary emotions detected in the entry (e.g., 'anxiety', 'sadness', 'joy').")
    topics: List[str] = Field(description="A list of 3-5 core topics or problems (e.g., 'academic_pressure', 'relationship_conflict', 'family_expectations').")
    summary: str = Field(description="A one-sentence, non-identifiable, and impersonal summary of the core problem.")


llm = ChatAnthropic(model="claude-3-haiku-20240307", temperature=0)


structured_llm = llm.with_structured_output(JournalAnalysis)

system_prompt = """
You are a privacy-focused journaling assistant. Your job is to analyze
a user's journal entry and extract its core emotional and topical context
so they can be matched with others facing similar issues.

Analyze the user's entry and provide the structured output.
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}")
])


chain = prompt | structured_llm

journal_entry = """
I'm completely overwhelmed. My midterm grades were bad, and I feel like
I'm letting my parents down. I just want to stay in my room and not talk
to anyone, I'm so stressed and lonely.
"""

analysis_output = chain.invoke({"input": journal_entry})

print("--- Analysis Output (as a Python object) ---")
print(analysis_output)

print("\n--- Summary to be Embedded ---")
print(analysis_output.summary)

print("\n--- Metadata for Hybrid Search ---")
print(f"Emotions: {analysis_output.emotions}")
print(f"Topics: {analysis_output.topics}")