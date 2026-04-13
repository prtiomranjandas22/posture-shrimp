import { calculateAngle, calculateYDifference } from '../utils/geometry';

/**
 * Score calculation based on Mediapipe Pose Landmarks.
 * Landmark indices:
 * 0: nose, 11: left_shoulder, 12: right_shoulder, 23: left_hip, 24: right_hip
 * 7: left_ear, 8: right_ear
 */
export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface PostureMetrics {
  neckAngle: number;
  shoulderDiff: number;
  torsoTilt: number;
  avgVisibility: number;
  score: number;
}

export function calculatePostureScore(landmarks: NormalizedLandmark[]): PostureMetrics {
  if (!landmarks || landmarks.length < 33) {
    return { neckAngle: 0, shoulderDiff: 0, torsoTilt: 0, avgVisibility: 0, score: 0 };
  }

  const leftEar = landmarks[7];
  const rightEar = landmarks[8];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  // Neck angle approximation (Ear, Shoulder, Hip on the side with better visibility)
  const useLeft = leftEar.visibility > rightEar.visibility;
  const ear = useLeft ? leftEar : rightEar;
  const shoulder = useLeft ? leftShoulder : rightShoulder;
  const hip = useLeft ? leftHip : rightHip;

  // Approximate point above head to calculate angle relative to vertical.
  // Actually, angle between ear, shoulder, hip.
  const neckAngle = calculateAngle(ear, shoulder, hip);

  // Shoulder symmetry (difference in y-coordinates of shoulders)
  const shoulderDiff = calculateYDifference(leftShoulder, rightShoulder);

  // Torso tilt (using x difference between average shoulder and average hip)
  const avgShoulderX = (leftShoulder.x + rightShoulder.x) / 2;
  const avgHipX = (leftHip.x + rightHip.x) / 2;
  const torsoTilt = Math.abs(avgShoulderX - avgHipX);

  // Visibility
  const avgVisibility = (ear.visibility + shoulder.visibility + hip.visibility + leftShoulder.visibility + rightShoulder.visibility) / 5;

  // core scoring algorithm provided by the prompt:
  // score = 100 - max(0, |180-neckAngle|-10)*0.7 - max(0, shoulderDiff-0.03)*300 - max(0, torsoTilt-0.1)*150 + (avgVisibility>0.8?5:0)
  
  const rawScore = 
    100 
    - Math.max(0, Math.abs(180 - neckAngle) - 10) * 0.7 
    - Math.max(0, shoulderDiff - 0.03) * 300 
    - Math.max(0, torsoTilt - 0.1) * 150 
    + (avgVisibility > 0.8 ? 5 : 0);

  const score = Math.max(0, Math.min(100, rawScore)); // Clamp to 0-100

  return {
    neckAngle,
    shoulderDiff,
    torsoTilt,
    avgVisibility,
    score
  };
}
