# **Buttercut.ai: Video Editing App Assignment**

## Repository Structure

```
/frontend   → React Native (Expo) app
/backend    → FastAPI backend with FFmpeg rendering
```

## Overview

This app is a **scoped, end-to-end prototype** of a mobile video editing workflow:

**select video → preview overlay → backend render job → downloadable output**

The goal was to demonstrate **system design, async processing, and frontend–backend coordination**, not to build a full editor.

---

## What This Shows

* **End-to-end ownership** (mobile → API → background processing → output)
* **Async job lifecycle** (`queued → processing → completed`)
* **Clear UX separation** between editing and rendering
* **Pragmatic engineering decisions** under time constraints

---

## Implemented

### Frontend (React Native + Expo)

* Video selection from device
* Text overlay preview (centered)
* Overlay scale and timing controls
* Dedicated render screen
* Render progress feedback
* Downloadable output video

### Backend (FastAPI + FFmpeg)

* Multipart video upload
* Overlay metadata ingestion
* Background render job
* Job status polling
* Rendered video retrieval
  
---

## Intentional Constraints

* Overlays are **centered by design** (drag repositioning scoped out)
* Preview is frontend-only; backend render is authoritative
* Single overlay at a time

These were deliberate choices to avoid fragile behavior and keep the system stable.

---

## API Endpoints

### `POST /upload`

Uploads video and overlay metadata.

**Request**

* Multipart form:

  * `video` (file)
  * `overlay` (JSON string)

**Overlay Example**

```json
{
  "type": "text",
  "content": "Hello Buttercut",
  "position": { "x": 0.5, "y": 0.5 },
  "scale": 1,
  "start_time": 1,
  "end_time": 4
}
```

**Response**

```json
{ "job_id": "uuid-string" }
```

---

### `GET /status/{job_id}`

**Response**

```json
{
  "status": "queued | processing | completed"
}
```

---

### `GET /result/{job_id}`

Returns the rendered video file.

---

## Running the Project

### Backend

Requirements:

* Python 3.9+
* FFmpeg installed and available in PATH

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### Frontend

```bash
cd frontend
npm install
npx expo start
```

---

## Architecture

```
Mobile App (Expo)
   → FastAPI
   → Background FFmpeg render
   → Downloadable video
```

---

## API

* `POST /upload`
* `GET /status/{job_id}`
* `GET /result/{job_id}`

---

## Why This Is a Baseline

This app is designed as a **foundation**:

* Media ingestion
* Metadata-driven rendering
* Async job handling
* Clear user feedback loop

This pipeline can be extended without re-architecture.

---

## Possible Extensions

* Multiple overlays & timelines
* Accurate drag positioning
* Audio & trimming
* Real FFmpeg progress
* Background queues & cloud storage

### Product-Level Projects

- Short-form content editor (Reels / Shorts)
- Branded video generator
- Automated video templating
- Fitness / education content tools
- Creator tooling platforms

---

## Final Note

This app demonstrates how I approach real engineering tasks:

- scope deliberately
- ship a coherent system
- document tradeoffs clearly
- leave room for extension
---


## Demo Video

A short screen recording demonstrating:

* Video upload
* Overlay preview
* Render process
* Final download

### **Demo + Rendered Output:**
[Public drive link here](https://drive.google.com/drive/u/2/folders/1HdJZMnO9rBP3srDjNL-5dNw3C4vaxUEk)
