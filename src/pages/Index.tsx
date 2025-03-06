
import { useState } from 'react';
import Hero from '@/components/Hero';
import FileUpload from '@/components/FileUpload';
import AnalysisResults from '@/components/AnalysisResults';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AnalysisState {
  metrics: Array<{
    name: string;
    score: number;
    feedback: string;
  }>;
  overallScore: number;
  recommendations: string[];
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisState | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsAnalyzing(true);

    // Simulate analysis process with a more realistic delay
    setTimeout(() => {
      // Mock analysis results
      setAnalysis({
        metrics: [
          {
            name: "Building Rapport",
            score: 85,
            feedback: "Strong opening and consistent engagement throughout the call.",
          },
          {
            name: "Pain Point Identification",
            score: 70,
            feedback: "Good probing questions, but missed some key pain points.",
          },
          {
            name: "Value Proposition",
            score: 90,
            feedback: "Excellent presentation of value and benefits.",
          },
          {
            name: "Objection Handling",
            score: 65,
            feedback: "Consider using the Feel, Felt, Found framework more consistently.",
          }
        ],
        overallScore: 78,
        recommendations: [
          "Use more specific examples when addressing objections",
          "Implement the Feel, Felt, Found framework for handling objections",
          "Ask more probing questions to uncover deeper pain points",
          "Practice assumptive closing techniques",
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
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
              <h3 className="text-xl font-semibold mb-2">Analyzing Your Sales Call</h3>
              <p className="text-gray-600">
                Our AI is reviewing your recording using Alex Hormozi's frameworks.
                This usually takes 30-60 seconds.
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
