import subprocess
import json
import uuid
import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

jobs = {}

# ---------- utils ----------
def get_video_size(path: str):
    cmd = [
        "ffprobe",
        "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "stream=width,height",
        "-of", "json",
        path,
    ]
    meta = json.loads(subprocess.run(cmd, capture_output=True, text=True).stdout)
    s = meta["streams"][0]
    return s["width"], s["height"]


def get_rotation(path: str) -> int:
    cmd = [
        "ffprobe",
        "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "stream_tags=rotate",
        "-of", "default=nw=1",
        path,
    ]
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    return int(out.split("=")[-1]) if "rotate=" in out else 0


# ---------- ffmpeg ----------
def run_ffmpeg(job_id: str):
    job = jobs[job_id]
    job["status"] = "processing"

    try:
        video_path = job["video_path"]
        overlay = job["overlay"]
        output_path = os.path.join(OUTPUT_DIR, f"{job_id}.mp4")

        width, height = get_video_size(video_path)
        rotation = get_rotation(video_path)

        rotation_filter = ""
        if rotation == 90:
            rotation_filter = "transpose=1,"
            width, height = height, width
        elif rotation == 180:
            rotation_filter = "transpose=2,transpose=2,"
        elif rotation == 270:
            rotation_filter = "transpose=2,"
            width, height = height, width

        x = width // 2
        y = height // 2

        start = overlay["start_time"]
        end = overlay["end_time"]
        scale = max(0.3, overlay.get("scale", 1))

        if overlay["type"] == "text":
            text = overlay["content"].replace(":", "\\:")

            font_size = int(height * 0.045 * scale)

            # FFmpeg handles centering using text_w / text_h
            filter_str = (
                f"{rotation_filter}"
                f"drawtext="
                f"text='{text}':"
                f"x=(w-text_w)/2:"
                f"y=(h-text_h)/2:"
                f"fontsize={font_size}:"
                f"fontcolor=white:"
                f"box=1:boxcolor=black@0.4:"
                f"enable='between(t,{start},{end})'"
            )


            cmd = [
                "ffmpeg", "-y",
                "-i", video_path,
                "-vf", filter_str,
                "-c:a", "copy",
                output_path,
            ]

        else:
            image_path = overlay.get("image_path")
            if not image_path:
                raise RuntimeError("Missing image_path")

            filter_str = (
                f"{rotation_filter}"
                f"[1:v]scale=iw*{scale}:ih*{scale}[ovr];"
                f"[0:v][ovr]overlay="
                f"x=(main_w-overlay_w)/2:"
                f"y=(main_h-overlay_h)/2:"
                f"enable='between(t,{start},{end})'"
            )

            cmd = [
                "ffmpeg", "-y",
                "-i", video_path,
                "-i", image_path,
                "-filter_complex", filter_str,
                "-c:a", "copy",
                output_path,
            ]

        subprocess.run(cmd, check=True)

        job["status"] = "completed"
        job["output_path"] = output_path

    except Exception as e:
        job["status"] = "failed"
        job["error"] = str(e)


# ---------- api ----------
@app.post("/upload")
async def upload(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...),
    overlay: str = Form(...),
    image: UploadFile | None = File(None),
):
    job_id = str(uuid.uuid4())

    video_path = os.path.join(UPLOAD_DIR, f"{job_id}_{video.filename}")
    with open(video_path, "wb") as f:
        shutil.copyfileobj(video.file, f)
    
    overlay_data = json.loads(overlay)

    if overlay_data["type"] == "image":
        image_b64 = overlay_data.get("imageBase64")
        if not image_b64:
            raise HTTPException(400, "Missing imageBase64")

        image_bytes = base64.b64decode(image_b64)
        image_path = os.path.join(UPLOAD_DIR, f"{job_id}.png")

        with open(image_path, "wb") as f:
            f.write(image_bytes)

        overlay_data["image_path"] = image_path

    jobs[job_id] = {
        "status": "queued",
        "video_path": video_path,
        "overlay": overlay_data,
    }

    background_tasks.add_task(run_ffmpeg, job_id)
    return {"job_id": job_id}


@app.get("/status/{job_id}")
def status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(404)
    return job


@app.get("/result/{job_id}")
def result(job_id: str):
    job = jobs.get(job_id)
    if not job or job["status"] != "completed":
        raise HTTPException(404)
    return FileResponse(job["output_path"], media_type="video/mp4")
