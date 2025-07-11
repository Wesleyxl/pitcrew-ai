import { Injectable, OnModuleInit } from '@nestjs/common';
import { filter } from 'rxjs/operators';
import { F124Adapter } from '../adapter/f124.adapter';
import { UdpService } from 'src/core/udp.service';
import { TelemetryGateway } from '../gateways/telemetry.gateway';
import { AlertService } from './alert.service';
import { LapService } from './lap.service';

@Injectable()
export class F124TelemetryService implements OnModuleInit {
  private adapter = new F124Adapter();

  constructor(
    private readonly udp: UdpService,
    private readonly lapSvc: LapService,
    private readonly alerts: AlertService,
    private readonly gateway: TelemetryGateway,
  ) {}

  onModuleInit() {
    this.udp.raw$
      .pipe(filter((buf) => this.adapter.supports(buf)))
      .subscribe((buffer) => {
        const data = this.adapter.parse(buffer);
        // 1) lógica de voltas
        this.lapSvc.handle(data);
        // 2) avaliação de regras
        // 3) emite para o front (namespace /telemetry/f1)
        this.gateway.server.emit('telemetry', data);
      });
  }
}
