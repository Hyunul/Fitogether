import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { CacheInterceptor } from "./common/interceptors/cache.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // 전역 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // 전역 예외 필터 적용
  app.useGlobalFilters(new HttpExceptionFilter());

  // 전역 캐시 인터셉터 적용
  app.useGlobalInterceptors(new CacheInterceptor());

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("Fitogether API")
    .setDescription("Fitogether 애플리케이션의 API 문서")
    .setVersion("1.0")
    .addTag("users", "사용자 관련 API")
    .addTag("routines", "운동 루틴 관련 API")
    .addTag("challenges", "챌린지 관련 API")
    .addTag("reports", "리포트 관련 API")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Firebase JWT 토큰을 입력하세요",
        in: "header",
      },
      "access-token"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
    },
  });

  await app.listen(3000);
}
bootstrap();
