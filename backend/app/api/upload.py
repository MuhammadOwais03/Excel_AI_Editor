from fastapi import APIRouter, UploadFile, File, HTTPException
from app.excel.parser import parse_excel
from app.repositories.spreadsheet_repo import SpreadsheetRepository
from app.db.mongo import get_spreadsheet_collection
from app.models.sheet import Spreadsheet, Sheet, Cell
router = APIRouter()

@router.post("/upload")

async def upload_excel(file: UploadFile = File(...)):
   
    if not file.filename.endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    content = await file.read()

    try:
        parsed_data = parse_excel(content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    sheets = {}
    
    for sheet in parsed_data:
        print(sheet)
        print(parsed_data[sheet])
        sheet_ = Sheet(
            cells=parsed_data[sheet]
        )

        sheets[sheet] = sheet_
    
    
        
    # Validate against schema
    spreadsheet = Spreadsheet(
        name=file.filename,
        sheets=sheets
        
    )
    
    print(spreadsheet)

    # # Repository usage
    repo = SpreadsheetRepository(get_spreadsheet_collection())
    print(repo)
    spreadsheet_id = await repo.create(spreadsheet)
    print(spreadsheet_id)

    return {
        "success": True,
        "filename": file.filename,
        "bytes_received": len(content),
        "message": "File received, but skipping parsing for test",
        "data": parsed_data,
        "spreadsheet_id": spreadsheet_id
    }


@router.get('/test')
async def test_endpoint():
    return {"message": "Upload endpoint is working!"}
