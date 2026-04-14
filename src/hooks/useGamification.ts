import { useEffect, useRef } from 'react';
import { useAppStore } from '../lib/store';
import { invoke } from '@tauri-apps/api/core';

export function useGamification(score: number | undefined) {
  const addXp = useAppStore(state => state.addXp);
  const sensitivity = useAppStore(state => state.alertSensitivity);
  
  const goodFramesRef = useRef(0);
  const badFramesRef = useRef(0);
  const isAlertingRef = useRef(false);

  useEffect(() => {
    if (score === undefined || score === null) return;
    
    // Roughly assuming 10 frames per second evaluation
    if (score > 80) {
       goodFramesRef.current++;
       badFramesRef.current = 0;
       
       // 1 min @ 10fps = 600 frames
       if (goodFramesRef.current >= 600) {
         addXp(1);
         goodFramesRef.current = 0;
       }
    } else if (score < sensitivity) {
       badFramesRef.current++;
       goodFramesRef.current = 0;
       
       // 3s @ 10fps = 30 frames
       if (badFramesRef.current >= 30 && !isAlertingRef.current) {
          isAlertingRef.current = true;
          if (typeof window !== 'undefined' && (window as any).__TAURI__) {
            invoke('send_slouch_alert', { 
              title: "Slouch Detected!", 
              message: "Your posture score dropped below threshold. Sit up!" 
            }).finally(() => {
              setTimeout(() => { isAlertingRef.current = false; badFramesRef.current = 0; }, 5000);
            });
          } else {
            console.log("Posture Alert: Slouching detected!");
            setTimeout(() => { isAlertingRef.current = false; badFramesRef.current = 0; }, 5000);
          }
       }
    } else {
       badFramesRef.current = Math.max(0, badFramesRef.current - 1);
    }
  }, [score, addXp, sensitivity]);
}
