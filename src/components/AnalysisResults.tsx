
import { Progress } from "@/components/ui/progress"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, ChevronRight } from "lucide-react"

interface Metric {
  name: string
  score: number
  feedback: string
}

interface AnalysisResultsProps {
  metrics: Metric[]
  overallScore: number
  recommendations: string[]
  onReset: () => void
}

const AnalysisResults = ({ metrics, overallScore, recommendations, onReset }: AnalysisResultsProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Analysis Complete</h2>
        <p className="text-gray-600">Here's your detailed sales call feedback</p>
      </div>

      {/* Overall Score */}
      <Card className="glass-card mb-8">
        <CardHeader className="text-center">
          <CardTitle>Overall Performance</CardTitle>
          <div className="mt-4">
            <div className="text-4xl font-bold mb-2">{overallScore}%</div>
            <Progress value={overallScore} className="w-full h-3" />
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">{metric.name}</CardTitle>
              <Progress value={metric.score} className="mt-2" />
              <div className="text-sm text-gray-600 mt-2">{metric.score}%</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{metric.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>Steps to improve your performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => onReset()}>
          Analyze Another Call
        </Button>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Download Report
        </Button>
      </div>
    </div>
  )
}

export default AnalysisResults
