
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, AlertCircle, Scan } from 'lucide-react';

interface Props {
  onCapture: (imageData: string) => void;
  isAnalyzing: boolean;
}

const CameraCapture: React.FC<Props> = ({ onCapture, isAnalyzing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
      setError(null);
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="relative group">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-2xl">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-slate-300 mb-4">{error}</p>
            <button 
              onClick={startCamera}
              className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
            >
              Retry Camera
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover transition-opacity duration-700 ${isAnalyzing ? 'opacity-40 grayscale' : 'opacity-100'}`}
            />
            
            {/* HUD Overlay */}
            {!isAnalyzing && (
              <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent">
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500/50" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-500/50" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-500/50" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-500/50" />
              </div>
            )}

            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-full absolute top-0 animate-[scan_2s_linear_infinite] h-[2px] bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,1)]" />
                <div className="bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-blue-500/30 flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                  <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">Vision AI Processing...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
        <button
          onClick={captureFrame}
          disabled={isAnalyzing || !!error}
          className={`group/btn flex items-center gap-2 px-8 py-4 rounded-full font-bold shadow-xl transition-all ${
            isAnalyzing 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95'
          }`}
        >
          <Scan className={`w-6 h-6 ${!isAnalyzing && 'group-hover/btn:scale-110'}`} />
          <span>SCAN SITE SAFETY</span>
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CameraCapture;
