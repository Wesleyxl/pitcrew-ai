import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TelemetryService } from './telemetry.service';
import { LapService } from './services/lap.service';
import { AlertService } from './services/alert.service';
import { UdpService } from './upd.service';

@Module({
  imports: [ConfigModule],
  providers: [
    UdpService, // abre o socket e emite raw$
    TelemetryService, // sequelize do raw$ que dispara parsers
    LapService, // lógica de lap
    AlertService, // notificações/TTS
    // …mais services/parsers que você tenha
  ],
  exports: [UdpService],
})
export class TelemetryModule {}
