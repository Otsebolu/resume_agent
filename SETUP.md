# Resume Analyzer - Setup Guide

## Overview

This project consists of:
1. **FastAPI Backend** - Handles PDF processing and AI analysis
2. **Next.js Frontend** - User interface for uploading CVs and viewing results

## Backend Setup

The backend has been updated to accept PDF file uploads at `/api/analyze`.

### Endpoint Details

- **URL**: `POST /api/analyze`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `cv_file`: PDF file (required)
  - `job_description`: String (required)
- **Response**: JSON with `match_score`, `reason`, and `learning_plan`

### CORS Configuration

CORS is enabled to allow requests from the frontend. In production, update the `allow_origins` in `api/index.py` to your frontend domain.

## Frontend Setup

### Prerequisites

- Node.js 18+
- pnpm

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.env.local` file:
```env
FASTAPI_BACKEND_URL=http://localhost:8000
```

For production, replace with your deployed backend URL.

### Development

Start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
pnpm build
pnpm start
```

## Deployment

### Backend

Deploy your FastAPI backend separately (e.g., on Railway, Render, or your preferred platform).

### Frontend (Vercel)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variable:
   - `FASTAPI_BACKEND_URL`: Your deployed backend URL
4. Deploy

## Testing

1. **Start the FastAPI backend:**
   
   **Option A: Use the startup script (Windows)**
   ```bash
   # PowerShell
   .\start-backend.ps1
   
   # Or Command Prompt
   start-backend.bat
   ```
   
   **Option B: Manual startup**
   ```bash
   # Activate virtual environment first
   # Windows PowerShell:
   .\venv\Scripts\activate
   
   # Windows Command Prompt:
   venv\Scripts\activate.bat
   
   # Linux/Mac:
   source venv/bin/activate
   
   # Then start the server
   uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
   ```
   
   The backend will be available at `http://localhost:8000`

2. **Start the Next.js frontend:**
   ```bash
   cd frontend
   pnpm dev
   ```
   
   The frontend will be available at `http://localhost:3000`

3. Upload a PDF CV and paste a job description
4. Click "Analyze Resume" to see the results

## Troubleshooting

### CORS Errors

If you see CORS errors, ensure:
- Backend CORS middleware is configured correctly
- Frontend is using the correct backend URL
- Backend is running and accessible

### File Upload Issues

- Ensure the file is a valid PDF
- Check backend logs for PDF extraction errors
- Verify `PyPDF2` is installed in the backend environment

### "No module named 'PyPDF2'" Error

This error occurs when the backend is not running with the virtual environment activated.

**Solution:**
1. Make sure you activate the virtual environment before starting the backend:
   ```bash
   # Windows PowerShell
   .\venv\Scripts\activate
   
   # Windows Command Prompt
   venv\Scripts\activate.bat
   
   # Linux/Mac
   source venv/bin/activate
   ```

2. Verify PyPDF2 is installed:
   ```bash
   pip list | findstr PyPDF2  # Windows
   pip list | grep PyPDF2      # Linux/Mac
   ```

3. If not installed, install it:
   ```bash
   pip install PyPDF2
   ```

4. Use the provided startup scripts (`start-backend.ps1` or `start-backend.bat`) which automatically activate the venv

### API Connection Issues

- Verify `FASTAPI_BACKEND_URL` is set correctly in `.env.local`
- Check that the backend is running and accessible
- Review browser console and network tab for errors
