@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

:: Node.js 버전 체크
echo [INFO] Node.js 버전을 확인합니다...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js가 설치되어 있지 않습니다. Node.js를 설치해주세요.
    exit /b 1
)

:: .env 파일 체크
echo [INFO] 환경 변수 파일을 확인합니다...
if not exist "web\.env" (
    echo [ERROR] web\.env 파일이 없습니다. Firebase 설정을 추가해주세요.
    exit /b 1
)

:: web 디렉토리로 이동
cd web
if %ERRORLEVEL% neq 0 (
    echo [ERROR] web 디렉토리로 이동할 수 없습니다.
    exit /b 1
)

:: 의존성 설치
echo [INFO] 의존성 패키지를 설치합니다...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] 의존성 설치에 실패했습니다.
    exit /b 1
)

:: 개발 서버 실행
echo [INFO] 개발 서버를 시작합니다...
call npm run dev

:: 스크립트 종료
echo [SUCCESS] 개발 서버가 시작되었습니다. http://localhost:5173 에서 확인할 수 있습니다. 