
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Hero = () => {
  return (
    <div className="py-20 px-6 text-center animate-fade-down">
      <Badge variant="secondary" className="mb-4">
        Powered by AI
      </Badge>
      <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
        Sales Call Analyzer
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Get expert-level feedback on your sales calls and actionable steps to improve your closing rate.
      </p>
      <Button size="lg" className="animate-fade-up">
        Start Analysis <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default Hero;
