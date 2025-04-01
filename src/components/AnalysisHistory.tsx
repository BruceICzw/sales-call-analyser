import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  RefreshCw, 
  Calendar, 
  BarChart3, 
  FileText, 
  Clock,
  ArrowLeft,
  Eye
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface Metric {
  name: string;
  score: number;
  feedback: string;
}

interface DetailedAnalysis {
  id: string;
  created_at: string;
  overall_score: number;
  metrics: Metric[];
  recommendations: string[];
  transcript: string;
}

interface Analysis {
  id: string;
  overall_score: number;
  created_at: string;
}

const AnalysisHistory = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<DetailedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/analyses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch analyses");
        }

        const data = await response.json();
        setAnalyses(data);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to fetch analyses",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalyses();
    }
  }, [token, toast]);

  const handleAnalysisClick = async (analysis: Analysis) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/analysis/${analysis.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch analysis details");
      }

      const data = await response.json();
      setSelectedAnalysis(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch analysis details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBgClass = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedAnalysis) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fade-up">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedAnalysis(null)} 
          className="mb-4 hover:bg-transparent hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to History
        </Button>
        
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-2">
            Analysis #{selectedAnalysis.id}
          </Badge>
          <h2 className="text-3xl font-bold mb-2">Call Analysis Details</h2>
          <p className="text-gray-600">Analyzed on {formatDate(selectedAnalysis.created_at)}</p>
        </div>

        {/* Overall Score */}
        <Card className="glass-card mb-8 overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> Overall Performance
            </CardTitle>
            <div className="mt-6 relative">

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="mt-2"></div>
                <div
                  className={`text-4xl font-bold flex items-center justify-center pb-2 rounded-full w-24 h-24 ${
                    getScoreColorClass(selectedAnalysis.overall_score)
                  }`}
                >
                  {selectedAnalysis.overall_score}%
                </div>
              </div>
              <div className="mt-8">
                <Progress
                  value={selectedAnalysis.overall_score}
                  className="w-full h-3"
                  indicatorClassName={getScoreBgClass(selectedAnalysis.overall_score)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-gradient-to-r from-primary/5 to-secondary/5 py-3 px-6 text-center">
            <p className="text-sm font-medium">
              {selectedAnalysis.overall_score >= 80
                ? "Excellent! This call implemented key sales principles effectively."
                : selectedAnalysis.overall_score >= 60
                ? "Good foundation. Several opportunities to refine the approach."
                : "Multiple areas for improvement have been identified."}
            </p>
          </CardContent>
        </Card>

        {/* Detailed Metrics */}
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {selectedAnalysis.metrics.map((metric, index) => (
            <Card key={index} className="glass-card hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{metric.name}</CardTitle>
                  <Badge className={getScoreBgClass(metric.score)}>
                    {metric.score}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <MarkdownRenderer>{metric.feedback}</MarkdownRenderer>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <ChevronRight className="h-5 w-5 mr-2 text-primary" />
          Recommended Actions
        </h3>
        <Card className="glass-card mb-8 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {selectedAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 transition-colors">
                  <Badge className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-full shrink-0">
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <MarkdownRenderer>{rec}</MarkdownRenderer>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Transcript */}
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Call Transcript
        </h3>
        <Card className="glass-card mb-8 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="bg-gray-50 p-4 rounded-md max-h-80 overflow-y-auto whitespace-pre-wrap text-sm">
              {selectedAnalysis.transcript}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center mt-8 mb-12">
          <Button onClick={() => setSelectedAnalysis(null)} className="gap-2 px-6">
            <ArrowLeft className="h-4 w-4" /> Return to History
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-2">
          Analysis Records
        </Badge>
        <h2 className="text-3xl font-bold mb-2">Your Sales Call History</h2>
        <p className="text-gray-600">Select a record to view detailed analysis</p>
      </div>

      {analyses.length === 0 ? (
        <Card className="glass-card p-8 text-center mb-8">
          <p className="text-lg text-gray-500">No analysis records found.</p>
          <p className="mt-2 text-gray-400">Upload a sales call recording to get started.</p>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyses.map((analysis) => (
                <TableRow key={analysis.id}>
                  <TableCell className="font-medium">#{analysis.id}</TableCell>
                  <TableCell>{formatDate(analysis.created_at)}</TableCell>
                  <TableCell>
                    <Badge className={getScoreBgClass(analysis.overall_score)}>
                      {analysis.overall_score}%
                    </Badge>
                  </TableCell>
                  <TableCell className={getScoreColorClass(analysis.overall_score)}>
                    {analysis.overall_score >= 80 
                      ? "Excellent" 
                      : analysis.overall_score >= 60 
                      ? "Good" 
                      : "Needs Improvement"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      onClick={() => handleAnalysisClick(analysis)}
                      className="gap-1"
                    >
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;