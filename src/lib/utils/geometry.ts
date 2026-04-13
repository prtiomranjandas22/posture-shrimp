/**
 * Calculates the angle in degrees between three points (A, B, C) where B is the vertex.
 */
export function calculateAngle(
  A: { x: number; y: number },
  B: { x: number; y: number },
  C: { x: number; y: number }
): number {
  const radians = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return angle;
}

/**
 * Calculates the absolute y-difference between two points.
 */
export function calculateYDifference(
  A: { y: number },
  B: { y: number }
): number {
  return Math.abs(A.y - B.y);
}

/**
 * Calculates the absolute x-difference between two points.
 */
export function calculateXDifference(
  A: { x: number },
  B: { x: number }
): number {
  return Math.abs(A.x - B.x);
}
