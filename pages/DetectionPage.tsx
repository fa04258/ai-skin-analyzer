import React, { useState, useCallback } from 'react';
import { AnalysisResult } from '../types';
import { analyzeSkinImage } from '../services/geminiService';
import { fileToBase64 } from '../services/fileUtils';
import Header from '../components/Header';
import { ImageInput } from '../components/ImageInput';
import ResultCard from '../components/ResultCard';
import Spinner from '../components/Spinner';
import Disclaimer from '../components/Disclaimer';

interface DetectionPageProps {
  onLogout: () => void;
}

const DetectionPage: React.FC<DetectionPageProps> = ({ onLogout }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  }, []);

  const clearImage = useCallback(() => {
    setImageFile(null);
    setImageUrl(null);
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const analysisResult = await analyzeSkinImage(base64Image, imageFile.type);
      setResult(analysisResult);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Header onLogout={onLogout} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Input */}
          <div className="flex flex-col space-y-6">
            <ImageInput 
              onImageSelect={handleImageSelect} 
              clearImage={clearImage}
              selectedImage={imageUrl}
            />
            {imageUrl && (
              <button 
                onClick={handleAnalyze} 
                disabled={isLoading}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? <Spinner /> : 'Analyze Skin'}
              </button>
            )}
          </div>

          {/* Right Column: Output */}
          <div className="flex flex-col justify-center">
            {isLoading && (
              <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg min-h-[300px]">
                <Spinner />
                <p className="mt-4 text-gray-600 font-medium">Analyzing image... please wait.</p>
              </div>
            )}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-lg" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            {result && <ResultCard result={result} />}
            {!isLoading && !result && !error && (
               <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg text-center min-h-[300px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-700">Awaiting Image for Analysis</h3>
                <p className="mt-1 text-sm text-gray-500">Upload or capture an image of your skin, and the AI analysis will appear here.</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-12">
            <Disclaimer />
        </div>
      </main>
    </div>
  );
};

export default DetectionPage;