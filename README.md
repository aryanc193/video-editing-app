# **Buttercut.ai: Video Editing App Assignment**

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

**Frontend (React Native + Expo)**

* Video selection
* Text overlay preview
* Overlay scale & timing
* Dedicated render screen with progress feedback
* Downloadable output video

**Backend (FastAPI + FFmpeg)**

* Multipart upload
* Metadata-driven rendering
* Background render jobs
* Status polling & result retrieval

---

## Intentional Constraints

* Overlays are **centered by design** (drag repositioning scoped out)
* Preview is frontend-only; backend render is authoritative
* Single overlay at a time

These were deliberate choices to avoid fragile behavior and keep the system stable.

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

This project prioritizes **clarity, correctness, and scope control** over feature count.
It reflects how I ship under real constraints: build something stable, explain tradeoffs clearly, and leave room to grow.

---
