

from typing import Dict, List, Optional, Union
from pydantic import BaseModel, Field
from datetime import datetime


class Cell(BaseModel):
    value: Union[int, float, str, None]
    formula: Optional[str] = None
    dependencies: List[str] = []
    data_type: Optional[str] = None


class Sheet(BaseModel):
    cells: Dict[str, Cell]


class Spreadsheet(BaseModel):
    
    name: str
    sheets: Dict[str, Sheet]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
