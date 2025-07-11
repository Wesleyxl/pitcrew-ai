// src/simulators/f1-24/services/event.service.ts
import { Injectable } from '@nestjs/common';
import { EventData } from '../parsers/event.parse';
import { AlertService } from './alert.service';

@Injectable()
export class EventService {
  constructor(private readonly alertService: AlertService) {}

  /**
   * Processa eventos de corrida (Safety Car, FTLP, DRS, etc.)
   */
  handle(ev: EventData) {
    switch (ev.eventCode) {
      case 'FTLP':
        this.alertService.notify(
          `🏁 Piloto ${ev.vehicleIdx} fez a primeira volta rápida em ${ev.lapTime?.toFixed(3)}s`,
        );
        break;
      case 'DRSE':
        this.alertService.notify('🟢 DRS habilitado');
        break;
      case 'DRSD':
        this.alertService.notify('🔴 DRS desabilitado');
        break;
      // … outros eventCodes conforme spec
      default:
        console.log(`Event ${ev.eventCode} ignorado`);
    }
  }
}
