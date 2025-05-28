# FitTogether Backend

Serverless 기반의 FitTogether 백엔드 서버

## 기술 스택

- Node.js
- Serverless Framework
- AWS Lambda
- API Gateway
- MongoDB Atlas
- AWS Step Functions
- CloudWatch

## 시작하기

### 필수 조건

- Node.js 18.x 이상
- npm 또는 yarn
- AWS CLI
- Serverless Framework CLI

### 설치

```bash
npm install
# 또는
yarn install
```

### 개발 서버 실행

```bash
serverless offline
```

### 배포

```bash
serverless deploy
```

## 환경 변수

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```
MONGODB_URI=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

## API 엔드포인트

### 인증

- POST /auth/login
- POST /auth/register
- POST /auth/logout

### 루틴

- GET /routines
- POST /routines
- GET /routines/:id
- PUT /routines/:id
- DELETE /routines/:id

### 챌린지

- GET /challenges
- POST /challenges
- GET /challenges/:id
- PUT /challenges/:id
- DELETE /challenges/:id

### 인증

- POST /verifications
- GET /verifications/:id
- PUT /verifications/:id

### 리포트

- GET /reports
- GET /reports/:id

## 데이터 파이프라인

- AWS Step Functions를 통한 리포트 자동 생성
- CloudWatch를 통한 모니터링
- Lambda 함수를 통한 데이터 처리
