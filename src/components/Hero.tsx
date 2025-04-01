
import { ChevronRight, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const Hero = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartAnalysis = () => {
    // Trigger the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="py-24 px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent opacity-50 pointer-events-none"></div>
      
      <div className="relative z-10 animate-fade-down">
        <Badge variant="secondary" className="mb-4 font-medium">
          Powered by AI
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
          Transform Your Sales Conversations with AI Analysis
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Get expert-level feedback on your sales calls and actionable steps to improve your closing rate.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="animate-fade-up group" onClick={handleStartAnalysis}>
            Start Analysis <FileUp className="ml-2 h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
          </Button>
          
          <Button variant="outline" size="lg" className="animate-fade-up" asChild>
            <Link to="/history">
              View Past Analysis <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        {/* Hidden file input element */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="audio/*,video/*"
          onChange={(e) => {
            // This will be handled by the FileUpload component
            // We just need this to relay the selected file to the parent component
            if (e.target.files && e.target.files[0]) {
              // Custom event to communicate with the FileUpload component
              const customEvent = new CustomEvent('hero-file-selected', {
                detail: { file: e.target.files[0] }
              });
              document.dispatchEvent(customEvent);
            }
          }}
        />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="glass-card p-6 hover-scale">
            <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Analysis</h3>
            <p className="text-gray-600">Get detailed insights on your sales calls in minutes, not hours.</p>
          </div>
          
          <div className="glass-card p-6 hover-scale">
            <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Actionable Insights</h3>
            <p className="text-gray-600">Receive specific recommendations to improve your sales technique.</p>
          </div>
          
          <div className="glass-card p-6 hover-scale">
            <div className="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your improvement over time with detailed analytics.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
