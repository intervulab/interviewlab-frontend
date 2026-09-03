# WebSocket Protocol Specification

## Connection

```
ws://<host>/ws?sessionId=<session_id>&token=<auth_token>
```

## Frame Types

The WebSocket connection uses **mixed frame types**:
- **Text frames**: JSON-encoded control messages
- **Binary frames**: Raw PCM audio data (16kHz, mono, float32)

## Client → Server Messages

### `audio:start`
Signals the start of audio streaming.
```json
{
  "type": "audio:start",
  "payload": {
    "sampleRate": 16000,
    "channels": 1,
    "encoding": "float32"
  },
  "timestamp": 1693425600000,
  "sessionId": "session_abc123"
}
```

### `audio:chunk`
Sent as **binary frame** (not JSON). Raw Float32Array PCM data.

### `audio:stop`
Signals the end of audio streaming.
```json
{
  "type": "audio:stop",
  "payload": {},
  "timestamp": 1693425600000
}
```

### `session:join`
```json
{
  "type": "session:join",
  "payload": {
    "interviewType": "technical",
    "difficulty": "medium",
    "resumeId": "resume_abc123"
  },
  "timestamp": 1693425600000
}
```

### `canvas:state`
```json
{
  "type": "canvas:state",
  "payload": {
    "nodes": [...],
    "edges": [...]
  },
  "timestamp": 1693425600000
}
```

## Server → Client Messages

### `transcript:partial`
```json
{
  "type": "transcript:partial",
  "payload": {
    "text": "I would approach this by...",
    "confidence": 0.85,
    "speaker": "candidate"
  },
  "timestamp": 1693425600000
}
```

### `transcript:final`
Same shape as partial, but `isFinal: true` in payload.

### `ai:question`
```json
{
  "type": "ai:question",
  "payload": {
    "questionId": "q_abc123",
    "text": "Can you explain the trade-offs between SQL and NoSQL for this use case?",
    "context": "Follow-up to your database design answer",
    "followUpDepth": 1
  },
  "timestamp": 1693425600000
}
```

### `ai:voice`
Sent as **binary frame**. AI-generated speech audio for playback.

### `ai:feedback`
```json
{
  "type": "ai:feedback",
  "payload": {
    "questionId": "q_abc123",
    "score": 7.5,
    "feedback": "Good explanation of...",
    "strengths": ["Clear structure", "Relevant examples"],
    "improvements": ["Consider mentioning CAP theorem"]
  },
  "timestamp": 1693425600000
}
```

### `metrics:update`
```json
{
  "type": "metrics:update",
  "payload": {
    "currentWPM": 142,
    "fillerWords": 3,
    "hesitationSpikes": 1,
    "silenceDurationMs": 0,
    "volumeLevel": 0.72,
    "isSpeaking": true
  },
  "timestamp": 1693425600000
}
```

### `canvas:alert`
```json
{
  "type": "canvas:alert",
  "payload": {
    "nodeId": "node_db1",
    "type": "warning",
    "message": "Single database is a single point of failure. Consider adding replication.",
    "position": { "x": 420, "y": 300 }
  },
  "timestamp": 1693425600000
}
```

### `error`
```json
{
  "type": "error",
  "payload": {
    "code": "SESSION_EXPIRED",
    "message": "Your interview session has expired."
  },
  "timestamp": 1693425600000
}
```

## Heartbeat

Client sends a heartbeat every 15 seconds:
```json
{ "type": "heartbeat", "payload": { "timestamp": 1693425600000 } }
```

Server responds:
```json
{ "type": "heartbeat_ack", "payload": { "timestamp": 1693425600000 } }
```

If no response within 5 seconds, the client assumes the connection is stale.
