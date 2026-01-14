import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("MONGODB_DB")

client: AsyncIOMotorClient | None = None
db = None


async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(
        MONGODB_URL,
        maxPoolSize=20,
        minPoolSize=5
    )
    db = client[DATABASE_NAME]


async def close_mongo_connection():
    global client
    if client:
        client.close()


def get_database():
    return db

def get_spreadsheet_collection():
    return db["spreadsheets"]


