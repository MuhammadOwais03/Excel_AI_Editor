from fastapi import APIRouter, HTTPException
from app.repositories.spreadsheet_repo import SpreadsheetRepository
from app.db.mongo import get_spreadsheet_collection


router = APIRouter()

@router.get('/getExcelbyID')
async def get_excel_by_id(id:str):
    
    repo = SpreadsheetRepository(get_spreadsheet_collection())
    data = await repo.get_by_id(id)
    
    print(data)
    
    return {
        "success": True,
        "filename": data["filename"],
        "sheets_count": len(data["sheets"]),
        "data": data["sheets"],
        "spreadsheet_id": data["_id"]
    }
    
    
@router.get("/spreadsheets/latest")
async def get_latest_spreadsheet():
    repo = SpreadsheetRepository(get_spreadsheet_collection())
    data, id = await repo.get_latest()

    if not data:
        raise HTTPException(status_code=404, detail="No spreadsheet found")

    print(data)

    return {
        "success": True,
        "spreadsheet_id": id,
        "filename": data.name,
        "sheets_count": len(data.sheets),
        "data": data.sheets
    }