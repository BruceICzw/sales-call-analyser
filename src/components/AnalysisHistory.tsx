
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronRight, 
  RefreshCw, 
  Calendar, 
  BarChart3, 
  FileText, 
  Clock,
  ArrowLeft,
  Eye,
  Search,
  CalendarDays,
  Filter,
  ListFilter
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<DetailedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
  const itemsPerPage = 5;
  
  const tableRef = useRef<HTMLDivElement>(null);

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
        setFilteredAnalyses(data);
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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAnalyses(analyses);
    } else {
      const filtered = analyses.filter(analysis => 
        analysis.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatDate(analysis.created_at).toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAnalyses(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, analyses]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${API_BASE_URL}/analyses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refresh analyses");
      }

      const data = await response.json();
      setAnalyses(data);
      setFilteredAnalyses(data);
      toast({
        title: "Success",
        description: "Analysis history refreshed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to refresh analyses",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

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

  const getScoreTextClass = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
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

  // Pagination logic
  const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage);
  const paginatedAnalyses = filteredAnalyses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Always show first page
    pages.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 1} 
          onClick={() => setCurrentPage(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      pages.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= 1 || i >= totalPages) continue;
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2 && totalPages > 3) {
      pages.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pages;
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
        
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <div className="bg-primary/5 p-3 rounded-full">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <Badge variant="outline" className="mb-2">
              Analysis #{selectedAnalysis.id}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold">Call Analysis Details</h2>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <CalendarDays className="h-4 w-4" />
              {formatDate(selectedAnalysis.created_at)}
            </p>
          </div>
          <Badge className={`text-lg px-4 py-2 ${getScoreTextClass(selectedAnalysis.overall_score)}`}>
            {selectedAnalysis.overall_score}%
          </Badge>
        </div>

        {/* Overall Score */}
        <Card className="glass-card mb-8 overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <CardHeader className="text-center bg-gradient-to-r from-gray-50 to-gray-100">
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
            <Card key={index} className="glass-card hover:shadow-md transition-shadow border border-gray-200">
              <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white">
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
        <Card className="glass-card mb-8 hover:shadow-md transition-shadow border border-gray-200">
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {selectedAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Badge variant="outline" className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-full shrink-0 bg-primary/10 border-primary/30 text-primary">
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
        <Card className="glass-card mb-8 hover:shadow-md transition-shadow border border-gray-200">
          <CardContent className="pt-6">
            <div className="bg-gray-50 p-4 rounded-md max-h-80 overflow-y-auto text-sm space-y-4">
              {selectedAnalysis.transcript.split("\n").map((line, index) => {
                const isCustomer = line.trim().startsWith("John:");
                const isAgent = line.trim().startsWith("Lauren:");
        
                return (
                  <div
                    key={index}
                    className={`flex items-start ${
                      isCustomer ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-xs ${
                        isCustomer
                          ? "bg-blue-100 text-blue-900"
                          : "bg-green-100 text-green-900"
                      }`}
                    >
                      <span className="font-semibold">
                        {isCustomer ? "Customer" : "Agent"}:
                      </span>{" "}
                      {line.replace(/^John:|^Lauren:/, "").trim()}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8 mb-12">
          <Button onClick={() => setSelectedAnalysis(null)} className="gap-2 px-6">
            <ArrowLeft className="h-4 w-4" /> Return to History
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto" ref={tableRef}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search by ID or date..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-2 min-w-24"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {filteredAnalyses.length === 0 ? (
        <Card className="glass-card p-8 text-center mb-8 border border-gray-200">
          <div className="flex justify-center mb-4">
            <ListFilter className="h-12 w-12 text-gray-300" />
          </div>
          <p className="text-lg text-gray-500">No matching analysis records found.</p>
          <p className="mt-2 text-gray-400">
            {analyses.length > 0 ? 'Try adjusting your search criteria.' : 'Upload a sales call recording to get started.'}
          </p>
        </Card>
      ) : (
        <div className="rounded-md border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAnalyses.map((analysis) => (
                <TableRow key={analysis.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">#{analysis.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {formatDate(analysis.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getScoreBgClass(analysis.overall_score)}>
                      {analysis.overall_score}%
                    </Badge>
                  </TableCell>
                  <TableCell className={getScoreColorClass(analysis.overall_score)}>
                    <span className={`py-1 px-2 rounded text-sm ${getScoreTextClass(analysis.overall_score)}`}>
                      {analysis.overall_score >= 80 
                        ? "Excellent" 
                        : analysis.overall_score >= 60 
                        ? "Good" 
                        : "Needs Improvement"}
                    </span>
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
          
          {totalPages > 1 && (
            <div className="py-4 border-t border-gray-200">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {renderPagination()}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;
