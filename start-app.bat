@echo off
title InternConnect Launcher
echo.
echo   ================================================
echo     InternConnect start ho raha hai...
echo   ================================================
echo.

REM ---- Backend check: agar pehle se chal raha hai toh skip ----
curl -s -m 2 -o nul http://localhost:3000/
if %errorlevel%==0 (
  echo   [1/2] Backend pehle se chal raha hai - skip kiya.
) else (
  echo   [1/2] Backend start kar raha hoon...
  start "InternConnect Backend" /d "E:\Intern connect\backend" cmd /k npm start
  ping -n 4 127.0.0.1 >nul
)

REM ---- Frontend check: agar pehle se chal raha hai toh skip ----
curl -s -m 2 -o nul http://localhost:5173/
if %errorlevel%==0 (
  echo   [2/2] Frontend pehle se chal raha hai - skip kiya.
) else (
  echo   [2/2] Frontend start kar raha hoon...
  start "InternConnect Frontend" /d "E:\Intern connect\frontend" cmd /k npm run dev
  ping -n 8 127.0.0.1 >nul
)

REM ---- Browser me app kholo ----
start "" "http://localhost:5173"

echo.
echo   ================================================
echo     Ho gaya! Browser me app khul gaya hoga:
echo       http://localhost:5173
echo   ================================================
echo.
echo   NOTE:
echo    - Yeh launcher window band kar sakte ho.
echo    - Backend / Frontend wali windows band MAT karna
echo      jab tak app use kar rahe ho (minimize kar do).
echo    - App band karne ke liye dono windows me Ctrl+C.
echo.
pause
