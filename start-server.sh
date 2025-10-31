#!/bin/bash
# 로컬 서버 시작 스크립트

echo "Starting local server..."
echo "Open http://localhost:8000 in your browser"
echo "Press Ctrl+C to stop the server"
echo ""

# Python 3가 있으면 사용
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
# Python 2가 있으면 사용
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
else
    echo "Python is not installed. Please install Python to use this script."
    exit 1
fi


