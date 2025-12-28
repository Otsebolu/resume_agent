@echo off
REM Batch script to start the FastAPI backend on Windows

echo Starting FastAPI Backend...

REM Check if virtual environment exists
if exist "venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
    
    echo.
    echo Starting uvicorn server on http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    
    REM Start the server
    uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
) else (
    echo Virtual environment not found!
    echo Please create a virtual environment first:
    echo   python -m venv venv
    echo   venv\Scripts\activate
    echo   pip install -r requirements.txt
    pause
)


