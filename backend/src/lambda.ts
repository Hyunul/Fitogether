import { Handler, Context } from "aws-lambda";
import { createServer, proxy } from "aws-serverless-express";
import { eventContext } from "aws-serverless-express/middleware";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const expressApp = require("express")();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter);

  app.use(eventContext());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("Fitogether API")
    .setDescription("Fitogether API documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.init();

  return createServer({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: any
) => {
  server = server ?? (await bootstrap());
  return proxy(server, event, context, "PROMISE").promise;
};
