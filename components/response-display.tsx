'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalysisResponse {
  match_score: number;
  reason: string;
  learning_plan: Array<{
    title: string;
    video: string;
    thumbnail: string;
  }>;
}

interface ResponseDisplayProps {
  response: AnalysisResponse;
}

export function ResponseDisplay({ response }: ResponseDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (score >= 60) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Match Score */}
      <Card className={`${getScoreBgColor(response.match_score)} border-2`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Match Score</span>
            <span className={`text-4xl font-bold ${getScoreColor(response.match_score)}`}>
              {response.match_score}%
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Analysis Reason */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis</CardTitle>
          <CardDescription>Detailed match analysis and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
              {response.reason}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Learning Plan */}
      {response.learning_plan && response.learning_plan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Plan</CardTitle>
            <CardDescription>
              Recommended resources to improve your match score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {response.learning_plan.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {item.thumbnail && (
                    <div className="flex-shrink-0">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-32 h-20 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {item.title || `Video ${index + 1}`}
                    </h4>
                    {item.video && (
                      <a
                        href={item.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                      >
                        Watch on YouTube
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

