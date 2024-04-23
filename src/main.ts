import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CoreConfigService } from "./core/modules/config/config.service";
import { Get, INestApplication, Logger } from "@nestjs/common";
import * as fs from 'fs'
import { version as projectVersion } from "../package.json";
import { OperationObject, PathItemObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

const logger = new Logger("Main");

/**
 * Add an extension to the swagger document to add the operation name.
 * Loop through all the paths and operations and add the x-operation-name extension.
 * This is used to generate the x-operation-name in the openapi spec.
 * @param document the swagger document
 * @returns the swagger document with the x-operation-name extension
 */
const generateOpenApiOperationName = (document: OpenAPIObject): OpenAPIObject => {
  const extensionName = "x-operation-name";

  Object.keys(document.paths).forEach((path: string) => {
    const currentPath: PathItemObject = document.paths[path];
    Object.keys(currentPath).forEach((operation: string) => {
      const currentOperation: OperationObject = (currentPath as { [index: string]: OperationObject })[operation];

      const operationId = currentOperation.operationId;
      const operationName = operationId?.includes("_") ? operationId.split("_")[1] : operationId;

      Object.assign(currentOperation, {
        [extensionName]: operationName,
      });
    });
  });

  return document;
};

/**
 * Setup the swagger documentation.
 * @param app the nest application
 * @param isDev if the application is in development mode
 * @param port the port the application is running on
 */
const setupSwagger = (app: INestApplication, isDev: boolean, port: number) => {
  const documentBuilder = new DocumentBuilder()
    .setTitle("Test Google OAuth API")
    .setDescription("Documentation for Google OAuth API")
    .setVersion(projectVersion)
    .addBearerAuth()
    .addGlobalParameters({
      name: "Accept-Language",
      in: "header",
      required: false,
      schema: { type: "string" },
    });
  if (isDev) documentBuilder.addServer(`http://localhost:${port}`, "Local development server");

  const document = generateOpenApiOperationName(SwaggerModule.createDocument(app, documentBuilder.build()));
  fs.writeFileSync("openapi.json", JSON.stringify(document, null, 2));
  SwaggerModule.setup("api-docs", app, document, {
    swaggerOptions: {
      tagsSorter: "alpha",
      operationsSorter: "alpha",
      displayRequestDuration: true,
      persistAuthorization: true,
    },
    jsonDocumentUrl: "openapi.json",
    yamlDocumentUrl: "openapi.yaml",
  });
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "https://play.google.com",
      "https://google.com",
      "http://localhost:3000"
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  });
  app.enableShutdownHooks();

  const configService = app.get(CoreConfigService);
  const { hostname, port, deploySwagger } = configService.global;

  if (deploySwagger) setupSwagger(app, true, port);

  await app.listen(port, hostname);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  if (deploySwagger) logger.log(`Swagger available at ${await app.getUrl()}/api-docs`);
}

bootstrap().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err); // only way to show the whole error
  logger.error(err, err.stack);
});
