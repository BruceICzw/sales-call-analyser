import { useState } from "react";
import Hero from "@/components/Hero";
import FileUpload from "@/components/FileUpload";
import AnalysisResults from "@/components/AnalysisResults";
import AnalysisHistory from "@/components/AnalysisHistory";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

interface AnalysisState {
  metrics: Array<{
    name: string;
    score: number;
    feedback: string;
  }>;
  overallScore: number;
  recommendations: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisState | null>(null);
  const { token } = useAuth();

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Your sales call has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze sales call",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen animated-gradient">
      <div className="container mx-auto px-4">
        <div className="flex justify-end my-4">
          <Link to="/history" className="text-primary hover:underline">
            View Analysis History
          </Link>
        </div>
        {!selectedFile && !analysis && <Hero />}

        {isAnalyzing ? (
          <div className="mt-12 mb-20 flex flex-col items-center justify-center">
            <div className="glass-card p-8 rounded-lg text-center max-w-md">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              <h3 className="text-xl font-semibold mb-2">
                Analyzing Your Sales Call
              </h3>
              <p className="text-gray-600">
                This may take 1-2 minutes. Please keep this tab open...
              </p>
            </div>
          </div>
        ) : analysis ? (
          <div className="mt-12 mb-20">
            <AnalysisResults
              metrics={analysis.metrics}
              overallScore={analysis.overallScore}
              recommendations={analysis.recommendations}
              onReset={handleReset}
            />
            <AnalysisHistory />
          </div>
        ) : (
          <div className="mt-12 mb-20">
            <FileUpload />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
