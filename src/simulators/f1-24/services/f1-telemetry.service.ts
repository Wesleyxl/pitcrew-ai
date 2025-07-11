// src/simulators/f1-24/services/f1-telemetry.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { filter } from 'rxjs/operators';
import { F124Adapter } from '../adapter/f124.adapter';
import { TelemetryGateway } from '../gateways/telemetry.gateway';
import { LapService } from './lap.service';
import { EventService } from './event.service';
import { LapParser } from '../parsers/lap.parse';
import { EventParser } from '../parsers/event.parse';
import { UdpService } from 'src/core/udp.service';

@Injectable()
export class F124TelemetryService implements OnModuleInit {
  private adapter = new F124Adapter();

  constructor(
    private readonly udp: UdpService,
    private readonly lapSvc: LapService,
    private readonly eventSvc: EventService,
    private readonly gateway: TelemetryGateway,
  ) {}

  onModuleInit() {
    this.udp.raw$
      .pipe(filter((buf) => this.adapter.supports(buf)))
      .subscribe((buffer) => {
        const pid = buffer.readUInt8(6);
        const data = this.adapter.parse(buffer);

        if (!data) {
          // buffer não pôde ser parseado ou parser devolveu null → ignora
          return;
        }

        // 1) se for LapData, processa
        if (pid === LapParser.PACKET_ID) {
          this.lapSvc.handle(data as any);
        }

        // 2) se for EventData, processa
        if (pid === EventParser.PACKET_ID) {
          this.eventSvc.handle(data as any);
        }

        // 3) emite TUDO parseado para o front em /telemetry/f1
        this.gateway.server.emit('telemetry', data);
      });
  }
}
