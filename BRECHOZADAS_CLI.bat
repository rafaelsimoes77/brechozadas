@echo off
chcp 65001 >nul
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
if "%~1"=="" (
  "C:\Program Files\nodejs\node.exe" "cli\brechozadas.mjs" status
  "C:\Program Files\nodejs\node.exe" "cli\brechozadas.mjs" pecas
  "C:\Program Files\nodejs\node.exe" "cli\brechozadas.mjs" help
  pause
) else (
  "C:\Program Files\nodejs\node.exe" "cli\brechozadas.mjs" %*
)
