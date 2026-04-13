import { calculateAngle, calculateXDifference, calculateYDifference } from '../../src/lib/utils/geometry';

describe('Geometry Utils', () => {
  it('calculates 180 degree angle correctly', () => {
    const A = { x: 0, y: 1 };
    const B = { x: 0, y: 0 };
    const C = { x: 0, y: -1 };
    expect(calculateAngle(A, B, C)).toBeCloseTo(180);
  });

  it('calculates 90 degree angle correctly', () => {
    const A = { x: 1, y: 0 };
    const B = { x: 0, y: 0 };
    const C = { x: 0, y: 1 };
    expect(calculateAngle(A, B, C)).toBeCloseTo(90);
  });

  it('calculates differences correctly', () => {
    const A = { x: 5, y: 10 };
    const B = { x: 2, y: 6 };
    expect(calculateXDifference(A, B)).toBe(3);
    expect(calculateYDifference(A, B)).toBe(4);
  });
});
