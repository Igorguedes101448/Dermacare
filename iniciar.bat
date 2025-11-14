@echo off
echo ================================================
echo   Clinica DermaCare - Iniciar Servidor
echo ================================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js de: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js encontrado!
echo.

echo Verificando dependencias...
if not exist "node_modules\" (
    echo Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo ERRO ao instalar dependencias!
        pause
        exit /b 1
    )
)

echo.
echo ================================================
echo   Iniciando servidor...
echo ================================================
echo.
echo Frontend: http://localhost:3000
echo API: http://localhost:3000/api
echo Dashboard: http://localhost:3000/dashboard.html
echo.
echo Pressione Ctrl+C para parar o servidor
echo ================================================
echo.

node server.js
pause
