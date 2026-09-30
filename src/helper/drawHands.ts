import type { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import type { GestureState } from "../gestures/gestureState";
import { getFingerName } from "../tracking/HandLandmarker";

export function drawFrame(canvas: HTMLCanvasElement, detected: HandLandmarkerResult, gestures: GestureState) {    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detected.landmarks.forEach((fingers, handIndex) => {
        const side = detected.handedness[handIndex][0].categoryName === "Left" ? "left" : "right";

        const rootX = fingers[0].x * canvas.width;
        const rootY = fingers[0].y * canvas.height;

        ctx.beginPath();

        fingers.forEach((point, index) => {
            const x = point.x * canvas.width;
            const y = point.y * canvas.height;

            if ((index - 1) % 4 == 0) {
                ctx.moveTo(rootX, rootY);
            }

            ctx.lineTo(x, y);
        });

        if (side === "left") {
            ctx.strokeStyle = '#00eeff';
        } else {
            ctx.strokeStyle = '#3cff00';
        }

        ctx.lineWidth = 4;
        ctx.stroke();

        fingers.forEach((point, index) => {
            const x = point.x * canvas.width;
            const y = point.y * canvas.height;
            const fingerName = getFingerName(index);

            const isExtended =
                fingerName !== undefined &&
                gestures[side].fingers[fingerName].extended;

            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fillStyle = isExtended ? "#7b00ff" : "#ff0000";
            ctx.fill();
        });
    });
}