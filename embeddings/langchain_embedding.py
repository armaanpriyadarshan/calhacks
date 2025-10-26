from langchain_openai import OpenAIEmbeddings


def get_embedding(summary):
    embeddings_model = OpenAIEmbeddings(
        model="text-embedding-3-small"
    )
    vector = embeddings_model.embed_query(summary)
    
    return vector