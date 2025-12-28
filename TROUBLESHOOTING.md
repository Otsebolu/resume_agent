# Troubleshooting Guide

## "Fetch Failed" Error

If you're seeing a "fetch failed" error, follow these steps:

### 1. Check if Backend is Running

First, verify your FastAPI backend is running:

```bash
# In the project root directory
uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
```

Or if you have a different startup command, use that.

### 2. Test Backend Connection

Open your browser and navigate to:
```
http://localhost:8000
```

You should see:
```json
{"message": "Career Coach AI is running!"}
```

### 3. Check Environment Variables

Ensure you have a `.env.local` file in the `frontend` directory:

```env
FASTAPI_BACKEND_URL=http://localhost:8000
```

**Important**: 
- For local development, use `http://localhost:8000`
- If your backend is on a different port, update the URL
- If your backend is deployed, use the full URL (e.g., `https://your-backend.railway.app`)

### 4. Verify Backend Endpoint

Test the backend endpoint directly using curl:

```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "cv_file=@path/to/your/resume.pdf" \
  -F "job_description=Your job description here"
```

If this fails, the issue is with the backend, not the frontend.

### 5. Check CORS Configuration

The backend should have CORS enabled. Check `api/index.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 6. Check Browser Console

Open your browser's Developer Tools (F12) and check:
- **Console tab**: For JavaScript errors
- **Network tab**: For failed requests
  - Look for the `/api/analyze` request
  - Check the status code and error message

### 7. Check Next.js Server Logs

When running `pnpm dev`, check the terminal for error messages. The API route logs will show:
- Backend URL being used
- File information
- Connection errors

### 8. Common Issues

#### Backend Not Running
**Error**: "Cannot connect to backend"
**Solution**: Start your FastAPI backend server

#### Wrong Port
**Error**: Connection refused
**Solution**: Check if backend is on port 8000, or update `FASTAPI_BACKEND_URL` in `.env.local`

#### CORS Error
**Error**: CORS policy error in browser console
**Solution**: Ensure CORS middleware is properly configured in `api/index.py`

#### File Upload Issue
**Error**: "Failed to extract text from PDF"
**Solution**: 
- Ensure the file is a valid PDF
- Check backend logs for PyPDF2 errors
- Verify PyPDF2 is installed: `pip install PyPDF2`

#### Timeout
**Error**: "Request timeout"
**Solution**: The AI analysis is taking too long. This might be normal for complex analyses. Try:
- Using a smaller PDF
- Checking backend logs for processing time
- Increasing timeout in `route.ts` if needed

### 9. Debug Mode

To see more detailed error messages:

1. Check the browser console (F12)
2. Check the Next.js terminal output
3. Check the FastAPI backend terminal output

All three should show error messages that help identify the issue.

### 10. Network Issues

If you're running frontend and backend on different machines:

- Ensure both are on the same network
- Use the machine's IP address instead of `localhost`
- Example: `FASTAPI_BACKEND_URL=http://192.168.1.100:8000`

## Still Having Issues?

1. Check all logs (browser, Next.js, FastAPI)
2. Verify all dependencies are installed
3. Ensure both servers are running
4. Try a simple test with a small PDF file
5. Check firewall/antivirus settings


