import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import AnalysisResults, { Metric } from "./AnalysisResults";

interface AnalysisData {
  transcript: string;
  analysis: {
    metrics: Metric[];
    overallScore: number;
    recommendations: string[];
  };
}

const FileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const { toast } = useToast();
  const { token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      setIsUploading(true);
      setUploadProgress(0);
  
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
  
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      clearInterval(interval);
      setUploadProgress(100);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }
  
      const result = await response.json();
      console.log("Analysis Data: ", result);
  
      // Extract the nested analysis object
      setAnalysisData(result.analysis);
  
      toast({
        title: "Analysis Complete",
        description: "Your sales call has been processed successfully",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description:
          error instanceof Error ? error.message : "Failed to analyze file",
        variant: "destructive",
      });
      resetUpload();
    } finally {
      setIsUploading(false);
    }
  };
  const resetUpload = () => {
    setUploadProgress(0);
    setAnalysisData(null);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      uploadFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"],
      "video/*": [".mp4", ".mov"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 1,
    disabled: isUploading || !token,
  });

  if (analysisData) {
    return (
      <AnalysisResults
        metrics={analysisData.analysis.metrics}
        overallScore={analysisData.analysis.overallScore}
        recommendations={analysisData.analysis.recommendations}
        onReset={resetUpload}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`glass-card p-8 rounded-lg text-center cursor-pointer transition-all duration-300 border-2 border-dashed ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-transparent hover:border-gray-300"
        } ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
            <h3 className="text-lg font-semibold mb-2">
              {uploadProgress < 100
                ? "Analyzing your call..."
                : "Processing results..."}
            </h3>
            <Progress value={uploadProgress} className="w-full mt-4" />
            <p className="text-sm text-muted-foreground mt-2">
              {uploadProgress}% complete
            </p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive
                ? "Drop your sales call here"
                : "Drag & drop your sales call recording"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Supports MP3, WAV, MP4 files (max 50MB)
            </p>
            <Button variant="outline" className="mt-2" disabled={!token}>
              {token ? "Select File" : "Please log in to upload"}
            </Button>
          </>
        )}
      </div>

      {!token && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          You need to be logged in to upload and analyze files
        </div>
      )}
    </div>
  );
};

export default FileUpload;
