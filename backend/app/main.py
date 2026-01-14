
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.mongo import connect_to_mongo, close_mongo_connection
from dotenv import load_dotenv


load_dotenv()


app = FastAPI(title="AI Excel Editor")


@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()


#routes
from app.api.upload import router as upload_router
from app.api.prompt import router as prompt_router
from app.api.getMe import router as getMe_router

app.include_router(upload_router, prefix="/api")
app.include_router(prompt_router, prefix='/api')
app.include_router(getMe_router, prefix='/api')



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)