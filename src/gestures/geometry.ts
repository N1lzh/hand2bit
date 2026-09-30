export interface Vector3 {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}

export function subtract(a: Vector3, b: Vector3): Vector3 {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z,
    };
}

export function cross(a: Vector3, b: Vector3): Vector3 {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x,
    };
}

export function dot(a: Vector3, b: Vector3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function magnitude(vector: Vector3): number {
    return Math.hypot(vector.x, vector.y, vector.z);
}

export function angleBetween(a: Vector3, b: Vector3): number {
    if (magnitude(a) === 0 || magnitude(b) === 0) {
        throw new Error("Cannot calculate an angle involving a zero vector");
    }

    return Math.atan2(magnitude(cross(a, b)), dot(a, b));
}