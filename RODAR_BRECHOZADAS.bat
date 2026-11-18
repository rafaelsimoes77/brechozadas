@echo off
chcp 65001 >nul
title BRECHOZADAS - Aplicacao Completa (Web + API)
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
echo ============================================================
echo   BRECHOZADAS - O Marketplace da Moda de Quebrada
echo   Iniciando servidor em http://localhost:3000 ...
echo ============================================================
start "" "http://localhost:3000"
if exist ".next\BUILD_ID" (
  "C:\Program Files\nodejs\node.exe" "node_modules\next\dist\bin\next" start -p 3000
) else (
  "C:\Program Files\nodejs\node.exe" "node_modules\next\dist\bin\next" dev -p 3000
)
pause
