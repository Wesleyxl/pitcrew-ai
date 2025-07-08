import { Injectable, OnModuleInit } from '@nestjs/common';
import { UdpService } from './upd.service';
import { LapService } from './services/lap.service';
import { LapParser } from './parser/lap.parse';
import { EventParser } from './parser/event.parse';
import { ParticipantParser } from './parser/participants.parse';

@Injectable()
export class TelemetryService implements OnModuleInit {
  constructor(
    private readonly udp: UdpService,
    private readonly lap: LapService,
  ) {}

  onModuleInit() {
    this.udp.raw$.subscribe((buffer) => {
      // const lapData = LapParser.parse(buffer);
      // if (lapData) {
      //   this.lap.handle(lapData);
      // }
      // const ev = EventParser.parse(buffer);
      // if (!ev) return;
      // switch (ev.eventCode) {
      //   case 'FTLP':
      //     console.log(
      //       `🏁 ${ev.vehicleIdx} fez melhor volta em ${ev.lapTime.toFixed(3)}s`,
      //     );
      //     break;
      //   case 'DRSE':
      //     console.log('🟢 DRS habilitado');
      //     break;
      //   case 'DRSD':
      //     console.log('🔴 DRS desabilitado');
      //     break;
      //   default:
      //     console.log(ev.eventCode);
      //   // ... trate os demais aqui
      // }

      // aqui é garantido que buf é um ParticipantsData
      const data = ParticipantParser.parse(buffer);
      if (!data) {
        // não é pacote de participantes, ignora
        return;
      }

      // aqui você pode chamar outros parsers/services
    });
    // note que não precisa mais chamar start() — OnModuleInit do UdpService já fez isso
  }
}
