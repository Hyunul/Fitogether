import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CertificationsController } from "./certifications.controller";
import { CertificationsService } from "./certifications.service";
import {
  Certification,
  CertificationSchema,
} from "./schemas/certification.schema";
import { RoutinesModule } from "../routines/routines.module";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certification.name, schema: CertificationSchema },
    ]),
    RoutinesModule,
    CommonModule,
  ],
  controllers: [CertificationsController],
  providers: [CertificationsService],
  exports: [CertificationsService],
})
export class CertificationsModule {}
