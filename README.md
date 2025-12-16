# Buttercut.ai – Video Editing Assignment

## Overview
This project is a simplified end-to-end prototype of a video editing workflow:
upload → overlay editing → backend processing → result download.

The scope is intentionally limited to demonstrate architecture, UX flow, and backend job handling.

---

## Features Implemented
- Video selection on mobile
- Text overlay with drag positioning
- Overlay timing (start / end)
- Frontend-only preview
- Backend job lifecycle (queued → processing → completed)
- Downloadable result video (stubbed)

---

## Features Stubbed
- Actual ffmpeg rendering
- Progress percentage
- Multiple overlay types (image / video)
- Persistent storage

---

## Out of Scope
- Real-time rendering
- Timeline editor
- Multiple overlays
- Trimming / cutting
- Audio editing
- Authentication
- Background workers
- Docker

---

## Architecture Overview
- Frontend: React Native (Expo)
- Backend: FastAPI
- Rendering: ffmpeg (planned, not implemented)

---

## Overlay Metadata Schema
```json
{
  "id": "overlay_1",
  "type": "text",
  "content": "Hello Buttercut",
  "position": { "x": 0.5, "y": 0.5 },
  "start_time": 1,
  "end_time": 4
}
```

## API Endpoints

- POST /upload
- GET /status/{job_id}
- GET /result/{job_id}