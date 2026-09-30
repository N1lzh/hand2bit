import type { HandFingerName } from "../tracking/HandLandmarker";

export type GestureState = {
    left: HandGestureState;
    right: HandGestureState;
};

export type HandGestureState = {
    isPresent: boolean;
    fingers: Record<HandFingerName, FingerGestureState>;
};

export type FingerGestureState = {
    extended: boolean;
};

export function createDefaultGestureState(): GestureState {
    return {
        left: createDefaultHandGestureState(),
        right: createDefaultHandGestureState(),
    };
}

export function createDefaultHandGestureState(): HandGestureState {
    return {
        isPresent: false,
        fingers: {
            thumb: createDefaultFingerGestureState(),
            index: createDefaultFingerGestureState(),
            middle: createDefaultFingerGestureState(),
            ring: createDefaultFingerGestureState(),
            pinky: createDefaultFingerGestureState(),
        },
    };
}

export function createDefaultFingerGestureState(): FingerGestureState {
    return {
        extended: false,
    };
}

