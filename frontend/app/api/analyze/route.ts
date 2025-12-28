import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_BACKEND_URL = process.env.FASTAPI_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const cvFile = formData.get('cv_file') as File;
    const jobDescription = formData.get('job_description') as string;

    if (!cvFile) {
      return NextResponse.json(
        { error: 'CV file is required' },
        { status: 400 }
      );
    }

    if (!jobDescription || jobDescription.trim() === '') {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!cvFile.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Convert File to Blob for better compatibility
    const fileBlob = await cvFile.arrayBuffer();
    
    // Create FormData for FastAPI
    const backendFormData = new FormData();
    backendFormData.append('cv_file', new Blob([fileBlob], { type: 'application/pdf' }), cvFile.name);
    backendFormData.append('job_description', jobDescription);

    console.log(`Forwarding request to ${FASTAPI_BACKEND_URL}/api/analyze`);
    console.log(`File: ${cvFile.name}, Size: ${cvFile.size} bytes`);

    // Forward request to FastAPI backend with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout

    try {
      const response = await fetch(`${FASTAPI_BACKEND_URL}/api/analyze`, {
        method: 'POST',
        body: backendFormData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText || `Backend error: ${response.status} ${response.statusText}` };
        }
        
        console.error('Backend error:', errorData);
        return NextResponse.json(
          { error: errorData.detail || errorData.error || `Backend error: ${response.statusText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          console.error('Request timeout');
          return NextResponse.json(
            { error: 'Request timeout - the backend took too long to respond' },
            { status: 504 }
          );
        }
        
        // Check if it's a connection error
        if (fetchError.message.includes('fetch failed') || fetchError.message.includes('ECONNREFUSED')) {
          console.error('Connection failed:', fetchError.message);
          return NextResponse.json(
            { 
              error: `Cannot connect to backend at ${FASTAPI_BACKEND_URL}. Please ensure the backend is running.`,
              details: fetchError.message
            },
            { status: 503 }
          );
        }
        
        throw fetchError;
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Error in analyze API route:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

