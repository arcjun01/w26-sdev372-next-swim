@echo off
REM NextSwim E2E Test Runner Script (Windows)
REM This script provides an easy way to run Playwright E2E tests against Docker containers

setlocal enabledelayedexpansion

REM Configuration
set DOCKER_COMPOSE_FILE=docker-compose.e2e.yml
set TEST_TIMEOUT=120
set BASE_URL=http://localhost:5173

cls
echo ===========================================================
echo  NextSwim End-to-End Test Runner
echo ===========================================================
echo.

if "%1%"=="" goto :run
if "%1%"=="run" goto :run
if "%1%"=="start" goto :start
if "%1%"=="stop" goto :stop
if "%1%"=="restart" goto :restart
if "%1%"=="logs" goto :logs
goto :usage

:run
echo [*] Checking prerequisites...

docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Docker is not installed
    exit /b 1
)
echo [+] Docker is installed

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Docker Compose is not installed
    exit /b 1
)
echo [+] Docker Compose is installed

if not exist "frontend\package.json" (
    echo [X] Frontend package.json not found. Are you in the project root?
    exit /b 1
)
echo [+] Project structure is correct
echo.

echo [*] Starting Docker services with %DOCKER_COMPOSE_FILE%...
docker-compose -f %DOCKER_COMPOSE_FILE% up -d --build
echo [+] Services started
echo [*] Waiting for services to be ready...

setlocal enabledelayedexpansion
for /l %%i in (1,1,30) do (
    timeout /t 2 /nobreak >nul
    curl -s %BASE_URL% >nul 2>&1
    if !errorlevel! equ 0 (
        echo [+] Frontend is ready
        goto :run_tests
    )
)

echo [X] Frontend did not start in time
docker-compose -f %DOCKER_COMPOSE_FILE% logs frontend
exit /b 1

:run_tests
echo.
echo [*] Running Playwright E2E tests...
echo.

cd frontend
call npm run test:e2e -- --baseURL=%BASE_URL%

if %errorlevel% neq 0 (
    echo.
    echo [X] Some tests failed
    cd ..
    goto :stop_and_fail
)

echo.
echo [+] All E2E tests passed!
cd ..

echo [*] Stopping Docker services...
docker-compose -f %DOCKER_COMPOSE_FILE% down -v
echo [+] Services stopped and cleaned up
echo.
echo [+] Test run completed successfully!
exit /b 0

:start
echo [*] Checking prerequisites...
docker --version >nul 2>&1
if %errorlevel% neq 0 exit /b 1
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 exit /b 1

echo [*] Starting Docker services...
docker-compose -f %DOCKER_COMPOSE_FILE% up -d --build
echo [+] Services started
echo [*] Run 'npm run test:e2e' in the frontend directory
echo [*] When done, run: docker-compose -f %DOCKER_COMPOSE_FILE% down -v
exit /b 0

:stop
echo [*] Stopping Docker services...
docker-compose -f %DOCKER_COMPOSE_FILE% down -v
echo [+] Services stopped and cleaned up
exit /b 0

:restart
echo [*] Restarting Docker services...
docker-compose -f %DOCKER_COMPOSE_FILE% down -v
docker-compose -f %DOCKER_COMPOSE_FILE% up -d --build
echo [+] Services restarted
exit /b 0

:logs
docker-compose -f %DOCKER_COMPOSE_FILE% logs -f
exit /b 0

:stop_and_fail
echo [*] Stopping Docker services...
docker-compose -f %DOCKER_COMPOSE_FILE% down -v
exit /b 1

:usage
echo Usage: %0 [run^|start^|stop^|restart^|logs]
echo.
echo Commands:
echo   run      - Start services, run tests, and stop services (default)
echo   start    - Start services only
echo   stop     - Stop services
echo   restart  - Restart services
echo   logs     - Show service logs
exit /b 1

endlocal
