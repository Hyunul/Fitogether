import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoutinesController } from "./routines.controller";
import { RoutinesService } from "./routines.service";
import { Routine, RoutineSchema } from "./schemas/routine.schema";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Routine.name, schema: RoutineSchema }]),
    CommonModule,
  ],
  controllers: [RoutinesController],
  providers: [RoutinesService],
  exports: [RoutinesService],
})
export class RoutinesModule {}
