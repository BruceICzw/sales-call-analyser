
import { useState } from 'react';
import Hero from '@/components/Hero';
import FileUpload from '@/components/FileUpload';
import AnalysisResults from '@/components/AnalysisResults';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
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
        {!selectedFile && <Hero />}

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
          </div>
        ) : (
          <div className="mt-12 mb-20">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {!analysis && !isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-up">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const features = [
  {
    title: "AI-Powered Analysis",
    description: "Get instant feedback on your sales calls using advanced AI technology.",
  },
  {
    title: "Expert Framework",
    description: "Analysis based on proven sales frameworks and strategies.",
  },
  {
    title: "Actionable Insights",
    description: "Receive specific steps and recommendations to improve your sales performance.",
  },
];

export default Index;
