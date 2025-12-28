# PowerShell script to start the FastAPI backend
# This script activates the virtual environment and starts the server

Write-Host "Starting FastAPI Backend..." -ForegroundColor Green

# Check if virtual environment exists
if (Test-Path "venv\Scripts\activate") {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & .\venv\Scripts\activate
    
    Write-Host "Starting uvicorn server on http://localhost:8000" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    # Start the server
    uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
} else {
    Write-Host "Virtual environment not found!" -ForegroundColor Red
    Write-Host "Please create a virtual environment first:" -ForegroundColor Yellow
    Write-Host "  python -m venv venv" -ForegroundColor White
    Write-Host "  .\venv\Scripts\activate" -ForegroundColor White
    Write-Host "  pip install -r requirements.txt" -ForegroundColor White
}


