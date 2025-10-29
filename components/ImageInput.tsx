import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ImageInputProps {
  onImageSelect: (file: File) => void;
  clearImage: () => void;
  selectedImage: string | null;
}

type Mode = 'upload' | 'camera';

export const ImageInput: React.FC<ImageInputProps> = ({ onImageSelect, clearImage, selectedImage }) => {
  const [mode, setMode] = useState<Mode>('upload');
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);
  
  const startCamera = useCallback(async () => {
    stopCamera();
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
    }
  }, [stopCamera]);

  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode, startCamera, stopCamera]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            onImageSelect(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => setMode('upload')} className={`${mode === 'upload' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
            Upload Image
          </button>
          <button onClick={() => setMode('camera')} className={`${mode === 'camera' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
            Use Camera
          </button>
        </nav>
      </div>

      <div className="min-h-[350px] flex flex-col items-center justify-center">
        {selectedImage ? (
          <div className="text-center w-full">
            <img src={selectedImage} alt="Selected skin" className="max-h-80 w-auto mx-auto rounded-md shadow-md mb-4"/>
            <button onClick={clearImage} className="text-sm text-red-600 hover:text-red-800">Use another image</button>
          </div>
        ) : mode === 'upload' ? (
           <div className="w-full">
             <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
               <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-10 text-center">
                 <svg className="mx-auto h-12 w-12 text-teal-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
                 <span className="mt-2 block text-sm font-medium text-gray-900">Click to upload a file</span>
                 <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
               </div>
               <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
             </label>
           </div>
        ) : (
          <div className="w-full text-center">
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-md shadow-md bg-gray-900 mb-4 max-h-80" />
            <canvas ref={canvasRef} className="hidden"></canvas>
            <button onClick={captureImage} className="w-full px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-gray-400" disabled={!!error}>
              Capture Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};