import AnalysisHistory from "@/components/AnalysisHistory";

const AnalysisHistoryPage = () => {
  return (
    <div className="min-h-screen animated-gradient">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center my-8">Analysis History</h1>
        <AnalysisHistory />
      </div>
    </div>
  );
};

export default AnalysisHistoryPage;