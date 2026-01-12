@echo off
set GIT_PATH="C:\Program Files\Git\cmd\git.exe"

echo ==========================================
echo      ENVIAR PROJETO PARA GITHUB
echo ==========================================
echo.

if not exist %GIT_PATH% (
    echo [ERRO] O Git nao foi encontrado no local padrao.
    echo Tente reiniciar o computador para que o comando 'git' funcione,
    echo ou verifique se o Git foi instalado corretamente.
    pause
    exit
)

echo.
set REPO_URL=https://github.com/ruanzituzs/portal-unilever.git
echo Link configurado: %REPO_URL%

echo.
echo --- Configurando... ---
%GIT_PATH% branch -M main
%GIT_PATH% remote remove origin >nul 2>&1
%GIT_PATH% remote add origin %REPO_URL%

echo.
echo --- Enviando... ---
echo AVISO: Uma janela pode abrir pedindo para voce fazer login no GitHub.
echo.
%GIT_PATH% push -u origin main

echo.
if %errorlevel% neq 0 (
    echo [ERRO] Algo deu errado. Verifique se o link esta correto.
) else (
    echo [SUCESSO] Projeto enviado para o GitHub!
)
echo.
pause
