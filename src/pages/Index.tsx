
import { useState } from 'react';
import Hero from '@/components/Hero';
import FileUpload from '@/components/FileUpload';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // In the future, we'll implement the analysis logic here
  };

  return (
    <div className="min-h-screen animated-gradient">
      <div className="container mx-auto px-4">
        <Hero />
        <div className="mt-12 mb-20">
          <FileUpload onFileSelect={handleFileSelect} />
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-up">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
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
