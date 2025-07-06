import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelemetryModule } from './telemetry/telemetry.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TelemetryModule],
})
export class AppModule {}
