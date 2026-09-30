# Hand2Bit

Hand2Bit uses your webcam and MediaPipe hand tracking to translate extended
fingers into a binary number. Detected hands and landmarks are drawn over the
camera preview, while the current binary value and its integer representation
are displayed on screen.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL in a camera-enabled browser and choose **Request Camera
Access**. If access is blocked, allow camera permissions in the browser and try
again.

## Binary format

Each finger represents one bit. For each hand, the order is:

```text
thumb, index, middle, ring, pinky
```

The left hand is followed by the right hand. The right-hand bits are reversed
before being appended, so the result supports up to ten bits.

For proper usage, your closed hands should face you. Then start counting with your right thumb.

## Stack

- React and TypeScript
- Vite
- [MediaPipe Tasks Vision](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker/web_js)

## Project structure

- `src/camera/` - Webcam access and stream lifecycle
- `src/tracking/` - MediaPipe hand landmark definitions and tracking
- `src/gestures/` - Finger extension detection and gesture state
- `src/helper/` - Canvas drawing and binary conversion
- `src/components/` - Camera preview UI
