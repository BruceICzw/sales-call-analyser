
import AnalysisHistory from "@/components/AnalysisHistory";
import { Card, CardContent } from "@/components/ui/card";
import { History } from "lucide-react";

const AnalysisHistoryPage = () => {
  return (
    <div className="min-h-screen animated-gradient py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-full mb-4">
            <History className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient font-display mb-4">Analysis History</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Review all your previous sales call analyses and track your improvement over time.
          </p>
        </div>

        <Card className="border border-gray-100 shadow-sm animate-fade-in">
          <CardContent className="p-0">
            <AnalysisHistory />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisHistoryPage;
