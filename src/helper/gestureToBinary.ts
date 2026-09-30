import type { GestureState, HandGestureState } from "../gestures/gestureState";

export function gestureToBinary(gesture: GestureState): string {
    const left = gesture.left.isPresent ? handToBinary(gesture.left) : [];
    const right = gesture.right.isPresent ? handToBinary(gesture.right, true) : [];

    const bits = left.concat(right);

    return bits.map(Number).join("");
}

function handToBinary(hand: HandGestureState, reverse: boolean = false): boolean[] {
    const fingers = hand.fingers;

    const bits = [
        fingers.thumb.extended,
        fingers.index.extended,
        fingers.middle.extended,
        fingers.ring.extended,
        fingers.pinky.extended,
    ];

    return reverse ? bits.reverse() : bits;
}