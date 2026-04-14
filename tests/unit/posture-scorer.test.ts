import { calculatePostureScore, NormalizedLandmark } from '../../src/lib/mediapipe/posture-scorer';

function createMockLandmark(): NormalizedLandmark {
  return { x: 0.5, y: 0.5, z: 0, visibility: 0.9 };
}

describe('posture-scorer', () => {
  it('returns 0 score and default metrics when < 33 landmarks are provided', () => {
    const metrics = calculatePostureScore([]);
    expect(metrics.score).toBe(0);
    expect(metrics.neckAngle).toBe(0);
  });

  it('calculates a perfect score for ideal posture', () => {
    const landmarks = Array(33).fill(null).map(createMockLandmark);
    
    // Set leftEar
    landmarks[7] = { x: 0.4, y: 0.2, z: 0, visibility: 0.9 };
    // Set rightEar
    landmarks[8] = { x: 0.6, y: 0.2, z: 0, visibility: 0.9 };
    // Set leftShoulder
    landmarks[11] = { x: 0.4, y: 0.4, z: 0, visibility: 0.9 };
    // Set rightShoulder
    landmarks[12] = { x: 0.6, y: 0.4, z: 0, visibility: 0.9 };
    // Set leftHip
    landmarks[23] = { x: 0.4, y: 0.8, z: 0, visibility: 0.9 };
    // Set rightHip
    landmarks[24] = { x: 0.6, y: 0.8, z: 0, visibility: 0.9 };

    const metrics = calculatePostureScore(landmarks);
    
    expect(metrics.score).toBe(100);
    expect(metrics.neckAngle).toBeCloseTo(180, 0); // Straight angle
    expect(metrics.shoulderDiff).toBe(0);
    expect(metrics.torsoTilt).toBe(0);
  });
});
