# Audio Streaming Pipeline

## Overview

The audio pipeline captures raw microphone input, processes it into chunks,
and streams it over WebSocket to the backend for transcription and analysis.

## Pipeline Stages

```
Mic Input → AudioContext → AudioWorklet → VAD → WebSocket → Backend
   ↑                          │
   └── Playback ←── AI Voice ←┘
```

### Stage 1: Capture (Browser)
- `navigator.mediaDevices.getUserMedia()` with 16kHz sample rate
- Echo cancellation, noise suppression, and auto gain control enabled

### Stage 2: Processing (AudioWorklet)
- AudioWorkletProcessor runs in a separate thread (no main thread blocking)
- Accumulates samples into 250ms chunks
- Converts Float32Array → Int16Array for bandwidth efficiency (optional)

### Stage 3: Voice Activity Detection (Client-side)
- RMS-based energy detection against configurable threshold
- Silence tracking with 5-second timeout for freeze-recovery trigger
- Prevents streaming silence (saves bandwidth)

### Stage 4: Streaming (WebSocket)
- Binary frames for audio data (no base64 overhead)
- JSON frames for control messages (start/stop, config)
- Dual-channel multiplexed over single connection

### Stage 5: Playback (AI Response)
- AI-generated speech received as binary WebSocket frames
- Decoded and played through Web Audio API
- Queue-based playback to handle latency jitter

## Freeze-Recovery System

When the VAD detects >5 seconds of continuous silence:
1. `onFreezeDetected` callback fires
2. Interview store sets `isFreezeRecoveryActive = true`
3. UI shows a gentle breathing cue animation + recovery prompt
4. AI agent adjusts — may rephrase the question or offer a hint
5. When speech resumes, freeze recovery deactivates

## Configuration

See `AUDIO_CONFIG` in `src/lib/constants.ts` for all configurable values.
