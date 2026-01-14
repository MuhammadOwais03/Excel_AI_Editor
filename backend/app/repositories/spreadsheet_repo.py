
from app.models.sheet import Spreadsheet
from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId

class SpreadsheetRepository:
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def create(self, spreadsheet: Spreadsheet):
        doc = spreadsheet.dict()
        result = await self.collection.insert_one(doc)
        return str(result.inserted_id)

    async def get_by_id(self, spreadsheet_id: str):
        doc = await self.collection.find_one({"_id": ObjectId(spreadsheet_id)})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc
    
    async def get_latest(self):
        doc = await self.collection.find_one(
            {},
            sort=[("created_at", -1)]
        )

        if not doc:
            return None

        doc["_id"] = str(doc["_id"])
        return Spreadsheet(**doc), doc["_id"]
