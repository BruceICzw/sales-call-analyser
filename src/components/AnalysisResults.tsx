import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import MarkdownRenderer from "./MarkdownRenderer";
import { BarChart, ChevronRight, Download, LineChart, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

export interface Metric {
  name: string;
  score: number;
  feedback: string;
}

interface AnalysisResultsProps {
  metrics?: Metric[]; // Make metrics optional
  overallScore?: number; // Make overallScore optional
  recommendations?: string[]; // Make recommendations optional
  onReset: () => void;
}

const AnalysisResults = ({
  metrics = [], // Default to an empty array
  overallScore = 0, // Default to 0
  recommendations = [], // Default to an empty array
  onReset,
}: AnalysisResultsProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Report downloaded",
      description: "Your analysis report has been downloaded successfully.",
    });
    // In a real implementation, this would generate and download a PDF
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-up">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-2">
          Analysis Complete
        </Badge>
        <h2 className="text-3xl font-bold mb-2">Your Sales Call Feedback</h2>
        <p className="text-gray-600">
          Based on Alex Hormozi's proven frameworks
        </p>
      </div>

      {/* Overall Score */}
      <Card className="glass-card mb-8 overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <BarChart className="h-5 w-5 text-primary" /> Overall Performance
          </CardTitle>
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`text-4xl font-bold flex items-center justify-center pb-2 rounded-full w-24 h-24 ${getScoreColor(
                  overallScore
                ).replace("bg-", "text-")}`}
              >
                {overallScore}%
              </div>
            </div>
            <div className="mt-8">
              <Progress
                value={overallScore}
                className="w-full h-3 "
                indicatorClassName={getScoreColor(overallScore)}
              />
            </div>
          </div>
        </CardHeader>
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-3 px-6 text-center">
          <p className="text-sm font-medium">
            {overallScore >= 80
              ? "Excellent! You're implementing key Hormozi principles effectively."
              : overallScore >= 60
              ? "Good foundation. Some opportunities to refine your approach."
              : "Several areas for improvement have been identified."}
          </p>
        </div>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{metric.name}</CardTitle>
              </div>
              <Progress
                value={metric.score}
                className="mt-2"
                indicatorClassName={getScoreColor(metric.score)}
              />
            </CardHeader>
            <CardContent>
              <MarkdownRenderer>{metric.feedback}</MarkdownRenderer>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              <span>Recommended Actions</span>
            </div>
          </CardTitle>
          <CardDescription>
            Key steps to improve your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <li
                key={index}
                className="flex items-start gap-2 p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                {recommendation}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4 flex-wrap">
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Analyze Another Call
        </Button>
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" /> Download Report
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;