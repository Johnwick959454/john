import os
import uuid
import json
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .utils.downloader import download_youtube_audio
from .services.pipeline import Pipeline

app = FastAPI(title="AI Music Analysis API")
pipeline = Pipeline()

app.mount("/static", StaticFiles(directory="backend/processed"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "backend/uploads"
PROCESSED_DIR = "backend/processed"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

class YouTubeRequest(BaseModel):
    url: str

@app.post("/upload")
async def upload_audio(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    extension = file.filename.split(".")[-1]
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.{extension}")

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    background_tasks.add_task(pipeline.process, file_path, file_id)
    return {"id": file_id, "status": "processing", "filename": file.filename}

@app.post("/youtube")
async def process_youtube(request: YouTubeRequest, background_tasks: BackgroundTasks):
    file_id = str(uuid.uuid4())
    output_path = os.path.join(UPLOAD_DIR, f"{file_id}.mp3")

    try:
        info = download_youtube_audio(request.url, output_path)
        background_tasks.add_task(pipeline.process, output_path, file_id)
        return {"id": file_id, "status": "processing", "title": info.get('title')}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/status/{file_id}")
async def get_status(file_id: str):
    analysis_path = os.path.join(PROCESSED_DIR, file_id, "analysis.json")
    if os.path.exists(analysis_path):
        with open(analysis_path, "r") as f:
            data = json.load(f)
        return {"id": file_id, "status": "complete", "data": data}
    return {"id": file_id, "status": "processing"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
