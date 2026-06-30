@echo off
title Cheezies Food Truck Dev Server
echo ==============================================
echo   STARTING CHEEZIES FOOD TRUCK APPLICATION
echo ==============================================
echo.

:: Add local node tools directory to path
set PATH=c:\Users\User\Documents\NexCMS\.tools\nodejs;%PATH%

:: Verify Node exists
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo [ERROR] node.exe was not found in the path.
  echo Expected at: c:\Users\User\Documents\NexCMS\.tools\nodejs\node.exe
  echo.
  pause
  exit /b 1
)

:: Verify NPM exists
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo [ERROR] npm was not found in the path.
  echo Expected at: c:\Users\User\Documents\NexCMS\.tools\nodejs\npm.cmd
  echo.
  pause
  exit /b 1
)

:: Start Express Backend Server in a new window
echo [1/2] Starting local database API server (Port 5001)...
start "Cheezies Backend" cmd /k "node server.js"

:: Start Vite Frontend Server
echo [2/2] Starting React Vite frontend (Port 5173)...
echo.
echo Direct your browser to http://localhost:5173
echo.
call npm run dev

if %ERRORLEVEL% neq 0 (
  echo.
  echo [ERROR] Frontend dev server failed to start.
  pause
)
