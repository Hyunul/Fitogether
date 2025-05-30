#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 함수: 에러 메시지 출력
error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# 함수: 성공 메시지 출력
success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

# 함수: 정보 메시지 출력
info() {
    echo -e "${YELLOW}[INFO] $1${NC}"
}

# Node.js 버전 체크
info "Node.js 버전을 확인합니다..."
if ! command -v node &> /dev/null; then
    error "Node.js가 설치되어 있지 않습니다. Node.js를 설치해주세요."
fi

# .env 파일 체크
info "환경 변수 파일을 확인합니다..."
if [ ! -f "web/.env" ]; then
    error "web/.env 파일이 없습니다. Firebase 설정을 추가해주세요."
fi

# web 디렉토리로 이동
cd web || error "web 디렉토리로 이동할 수 없습니다."

# 의존성 설치
info "의존성 패키지를 설치합니다..."
npm install || error "의존성 설치에 실패했습니다."

# 개발 서버 실행
info "개발 서버를 시작합니다..."
npm run dev

# 스크립트 종료
success "개발 서버가 시작되었습니다. http://localhost:5173 에서 확인할 수 있습니다." 