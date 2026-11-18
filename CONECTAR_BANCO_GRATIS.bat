@echo off
chcp 65001 > nul
title BRECHOZADAS - Conectar Banco Gratuito (Supabase)

echo ========================================================
echo   BRECHOZADAS por @acervodoreliquia
echo   Conectar Banco Permanente Gratuito (PostgreSQL Supabase)
echo ========================================================
echo.

if exist "C:\Program Files\nodejs\node.exe" (
    "C:\Program Files\nodejs\node.exe" scripts\setup-supabase.mjs
) else (
    node scripts\setup-supabase.mjs
)

echo.
pause
