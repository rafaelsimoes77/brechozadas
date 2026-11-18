@echo off
chcp 65001 >nul
title BRECHOZADAS - Expor na Internet e Celular
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

echo ====================================================================
echo   BRECHOZADAS - MODO CELULAR + LINK PUBLICO NA INTERNET (HTTPS)
echo ====================================================================
echo.
echo 1) Na mesma rede Wi-Fi, voce tambem pode acessar pelo IP abaixo na porta :3000:
ipconfig | findstr /i "IPv4"
echo.
echo 2) Iniciando o servidor BRECHOZADAS em segundo plano na porta 3000...
start "Servidor BRECHOZADAS" /min cmd /c ""C:\Program Files\nodejs\node.exe" "node_modules\next\dist\bin\next" start -H 0.0.0.0 -p 3000"
timeout /t 3 /nobreak >nul

echo.
echo 3) Gerando link HTTPS publico na internet (funciona em 4G/5G e qualquer celular!)...
echo    Copie o link "https://....lhr.life" que vai aparecer abaixo (ou escaneie o QR Code)!
echo ====================================================================
echo.
ssh -o StrictHostKeyChecking=accept-new -R 80:127.0.0.1:3000 nokey@localhost.run
pause
