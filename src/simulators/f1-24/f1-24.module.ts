import { Module } from '@nestjs/common';
import { F124TelemetryService } from './services/f1-telemetry.service';
import { LapService } from './services/lap.service';
import { AlertService } from './services/alert.service';
import { TelemetryGateway } from './gateways/telemetry.gateway';
import { AlertsGateway } from './gateways/alerts.gateway';
import { UdpModule } from 'src/core/udp.module';
import { EventService } from './services/event.service';

@Module({
  imports: [UdpModule],
  providers: [
    F124TelemetryService,
    EventService,
    LapService,
    AlertService,
    TelemetryGateway,
    AlertsGateway,
  ],
})
export class F124Module {}
