import { useEffect, useRef } from 'react';
import { usePosture } from '../../hooks/usePosture';

export const CameraView = () => {
   const videoRef = useRef<HTMLVideoElement>(null);
   const { isModelLoaded, error } = usePosture('#pose-video');

   useEffect(() => {
     async function startCamera() {
       try {
         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
         if (videoRef.current) {
           videoRef.current.srcObject = stream;
           // Explicitly calling play
           videoRef.current.play().catch(e => console.error("Video play error:", e));
         }
       } catch (err) {
         console.error("Camera access denied", err);
       }
     }
     startCamera();
   }, []);

   return (
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-slate-950/80 shadow-inner">
        <video 
          id="pose-video"
          ref={videoRef}
          className="h-full w-full object-cover transform scale-x-[-1]"
          autoPlay 
          playsInline 
          muted 
        />
        {!isModelLoaded && !error && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm space-y-4">
             <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
             <span className="text-sm font-medium text-emerald-400 animate-pulse tracking-wide uppercase">Initializing WASM...</span>
           </div>
        )}
        {error && (
           <div className="absolute inset-0 flex items-center justify-center bg-red-900/90 backdrop-blur-sm p-4 text-center">
             <span className="text-sm font-medium text-red-200">{error}</span>
           </div>
        )}
      </div>
   );
};
