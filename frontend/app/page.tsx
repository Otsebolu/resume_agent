'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ResponseDisplay } from '@/components/response-display';

interface AnalysisResponse {
  match_score: number;
  reason: string;
  learning_plan: Array<{
    title: string;
    video: string;
    thumbnail: string;
  }>;
}

export default function Home() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      setCvFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cvFile) {
      setError('Please upload a CV file');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append('cv_file', cvFile);
      formData.append('job_description', jobDescription);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData.error || errorData.details || `Failed to analyze resume (${res.status})`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      let errorMessage = 'An error occurred';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        // Provide helpful suggestions for common errors
        if (err.message.includes('Cannot connect to backend') || err.message.includes('ECONNREFUSED')) {
          errorMessage += '\n\nPlease ensure your FastAPI backend is running on port 8000.';
        } else if (err.message.includes('timeout')) {
          errorMessage += '\n\nThe analysis is taking longer than expected. Please try again.';
        }
      }
      
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Resume Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your CV and job description to get AI-powered match analysis
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload & Analyze</CardTitle>
            <CardDescription>
              Upload your CV (PDF) and paste the job description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cv-file">CV File (PDF)</Label>
                <Input
                  id="cv-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="cursor-pointer"
                />
                {cvFile && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selected: {cvFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={loading}
                  rows={8}
                  className="resize-none"
                />
              </div>

              {error && (
                <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200 whitespace-pre-line">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !cvFile || !jobDescription.trim()}
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Resume'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {response && <ResponseDisplay response={response} />}
      </div>
    </div>
  );
}
