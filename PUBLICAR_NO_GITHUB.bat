@echo off
chcp 65001 >nul
title BRECHOZADAS - Enviar Versao para GitHub + Deploy Automatico
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

if not exist ".env.local" (
  echo Abrindo gerador de Token do GitHub no seu navegador...
  start "" "https://github.com/settings/tokens/new?description=BRECHOZADAS-Deploy&scopes=repo,workflow"
)

set /p MSG="Descricao desta versao (Enter para padrao): "
if "%MSG%"=="" set MSG=feat: versao atualizada BRECHOZADAS

"C:\Program Files\nodejs\node.exe" "scripts\github-push.mjs" "--msg=%MSG%"
pause
