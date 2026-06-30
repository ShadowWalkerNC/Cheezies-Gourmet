@echo off
title Cheezies Food Truck Dev Server
echo ==============================================
echo   STARTING CHEEZIES FOOD TRUCK APPLICATION
echo ==============================================
echo.

:: Add local node tools directory to path
set PATH=c:\Users\User\Documents\NexCMS\.tools\nodejs;%PATH%

:: Start Express Backend Server in the background
echo [1/2] Starting local database API server (Port 5001)...
start "Cheezies Backend" cmd /k "node server.js"

:: Start Vite Frontend Server
echo [2/2] Starting React Vite frontend (Port 5173)...
echo.
echo Direct your browser to http://localhost:5173
echo.
npm run dev
