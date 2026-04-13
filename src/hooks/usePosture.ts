import { useEffect, useRef, useState, useCallback } from 'react';
import { calculatePostureScore, PostureMetrics, NormalizedLandmark } from '../lib/mediapipe/posture-scorer';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

export interface PostureState {
  metrics: PostureMetrics | null;
  isModelLoaded: boolean;
  error: string | null;
  fps: number;
}

export function usePosture(videoElementSelector: string) {
  const [state, setState] = useState<PostureState>({
    metrics: null,
    isModelLoaded: false,
    error: null,
    fps: 0,
  });

  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const requestRef = useRef<number>();
  const lastVideoTimeRef = useRef<number>(-1);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const fpsTimeRef = useRef<number>(performance.now());
  const errorCountRef = useRef<number>(0);

  const initModel = useCallback(async () => {
    try {
      // Intentionally using absolute offline mediapipe resources
      const vision = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: '/mediapipe/pose_landmarker_lite.task',
          delegate: 'CPU', // Ensure CPU runs fast and reliably across devices initially
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      poseLandmarkerRef.current = landmarker;
      setState(s => ({ ...s, isModelLoaded: true, error: null }));
    } catch (err) {
      if (err instanceof Error) {
        setState(s => ({ ...s, error: `Failed to load AI model: ${err.message}` }));
      }
    }
  }, []);

  useEffect(() => {
    initModel();
    return () => {
      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close();
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [initModel]);

  const detectPose = useCallback(() => {
    const video = document.querySelector<HTMLVideoElement>(videoElementSelector);
    if (!video || !poseLandmarkerRef.current || video.readyState < 2) {
      requestRef.current = requestAnimationFrame(detectPose);
      return;
    }

    const now = performance.now();
    // Throttle to roughly 10-15 FPS (wait ~66ms minimum)
    if (now - lastFrameTimeRef.current < 66) {
      requestRef.current = requestAnimationFrame(detectPose);
      return;
    }
    lastFrameTimeRef.current = now;

    frameCountRef.current++;
    if (now - fpsTimeRef.current > 1000) {
      setState(s => ({ ...s, fps: frameCountRef.current }));
      frameCountRef.current = 0;
      fpsTimeRef.current = now;
    }

    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      try {
         const result = poseLandmarkerRef.current.detectForVideo(video, now);
         if (result && result.landmarks && result.landmarks.length > 0) {
            const metrics = calculatePostureScore(result.landmarks[0] as NormalizedLandmark[]);
            setState(s => ({ ...s, metrics, error: null }));
         }
      } catch (err) {
        if (err instanceof Error) {
           errorCountRef.current++;
           if(errorCountRef.current > 10) {
             setState(s => ({ ...s, error: `Detection failed (too many errors): ${err.message}` }));
           }
        }
      }
    }

    requestRef.current = requestAnimationFrame(detectPose);
  }, [videoElementSelector]);

  useEffect(() => {
    if (state.isModelLoaded) {
      requestRef.current = requestAnimationFrame(detectPose);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [state.isModelLoaded, detectPose]);

  return state;
}
