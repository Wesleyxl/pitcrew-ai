import { Injectable, OnModuleInit } from '@nestjs/common';
import { UdpService } from './upd.service';
import { LapService } from './services/lap.service';
import { LapParser } from './parser/lap.parse';

@Injectable()
export class TelemetryService implements OnModuleInit {
  constructor(
    private readonly udp: UdpService,
    private readonly lap: LapService,
  ) {}

  onModuleInit() {
    this.udp.raw$.subscribe((buffer) => {
      const lapData = LapParser.parse(buffer);
      if (lapData) {
        this.lap.handle(lapData);
      }
      // aqui você pode chamar outros parsers/services
    });
    // note que não precisa mais chamar start() — OnModuleInit do UdpService já fez isso
  }
}
