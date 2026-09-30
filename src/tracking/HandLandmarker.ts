export const HandLandmark = {
    wrist: 0,
    thumb: {
        cmc: 1,
        mcp: 2,
        ip: 3,
        tip: 4,
    },
    fingers: {
        index: {
            mcp: 5,
            pip: 6,
            dip: 7,
            tip: 8,
        },
        middle: {
            mcp: 9,
            pip: 10,
            dip: 11,
            tip: 12,
        },
        ring: {
            mcp: 13,
            pip: 14,
            dip: 15,
            tip: 16,
        },
        pinky: {
            mcp: 17,
            pip: 18,
            dip: 19,
            tip: 20,
        },
    },
} as const;

export type FingerName = keyof typeof HandLandmark.fingers;
export type HandFingerName = FingerName | "thumb";
export type FingerLandmarks = (typeof HandLandmark.fingers)[FingerName];

export function getFinger(name: FingerName): FingerLandmarks {
    return HandLandmark.fingers[name];
}

export function getFingerName(index: number): HandFingerName | undefined {
    for (const landmarkIndex of Object.values(HandLandmark.thumb)) {
        if (landmarkIndex === index) {
            return "thumb";
        }
    }

    for (const [name, landmarks] of Object.entries(HandLandmark.fingers)) {
        if (Object.values(landmarks).some(landmarkIndex => landmarkIndex === index)) {
            return name as FingerName;
        }
    }

    return undefined;
}