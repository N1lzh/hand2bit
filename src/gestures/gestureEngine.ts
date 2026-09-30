import type { HandLandmarkerResult, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { createDefaultGestureState, createDefaultHandGestureState, type FingerGestureState, type GestureState } from "./gestureState";
import { getFinger, HandLandmark, type FingerLandmarks, type HandFingerName } from "../tracking/HandLandmarker";
import { angleBetween, subtract, type Vector3 } from "./geometry";

const HAND_FINGERS: HandFingerName[] = ["thumb", "index", "middle", "ring", "pinky"];

export class GestureEngine {
    private previous: GestureState = createDefaultGestureState();
    private current: GestureState = createDefaultGestureState();

    update(detected: HandLandmarkerResult): GestureState {
        this.previous = this.current;

        this.current.left.isPresent = false;
        this.current.right.isPresent = false;

        detected.landmarks.forEach((landmarks, handIndex) => {
            const side = detected.handedness[handIndex][0].categoryName === "Left" ? "left" : "right";

            const handState = createDefaultHandGestureState();
            handState.isPresent = true;

            HAND_FINGERS.forEach(finger => {
                const previousState = this.previous[side].fingers[finger];

                handState.fingers[finger] = finger === "thumb"
                    ? this.detectThumbState(landmarks, previousState)
                    : this.detectFingerState(getFinger(finger), landmarks, previousState);
            });

            this.current[side] = handState;
        });

        return this.current;
    }

    private detectThumbState(landmarks: NormalizedLandmark[], previousState: FingerGestureState): FingerGestureState {
        const finger = HandLandmark.thumb;

        const cmc: Vector3 = landmarks[finger.cmc];
        const mcp: Vector3 = landmarks[finger.mcp];
        const ip: Vector3 = landmarks[finger.ip];
        const tip: Vector3 = landmarks[finger.tip];

        return {
            extended:
                this.isExtended(tip, ip, mcp, previousState.extended) &&
                this.isExtended(tip, ip, cmc, previousState.extended),
        };
    }

    private detectFingerState(
        finger: FingerLandmarks,
        landmarks: NormalizedLandmark[],
        previousState: FingerGestureState
    ): FingerGestureState {
        const mcp = landmarks[finger.mcp];
        const pip = landmarks[finger.pip];
        const dip = landmarks[finger.dip];
        const tip = landmarks[finger.tip];

        return {
            extended:
                this.isExtended(dip, pip, mcp, previousState.extended) &&
                this.isExtended(tip, dip, pip, previousState.extended),
        };
    }

    private isExtended(topPoint: Vector3, middlePoint: Vector3, bottomPoint: Vector3, previousState: boolean): boolean {
        const topDirection = subtract(topPoint, middlePoint);
        const bottomDirection = subtract(bottomPoint, middlePoint);

        // apply hysteresis if last state was true
        const error = previousState ? Math.PI / 8 : Math.PI / 16;
        const angle = angleBetween(topDirection, bottomDirection);
        return Math.PI + error >= angle && angle >= Math.PI - error;
    }
}