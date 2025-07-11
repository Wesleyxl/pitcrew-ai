/**
 * src/simulators/f1-24/services/lap.service.ts
 * Serviço de lógica de voltas para F1-24
 */
import { Injectable } from '@nestjs/common';
import { LapData } from '../parsers/lap.parse';
import { FormatUtil } from 'src/common/format.util';
import { AlertService } from './alert.service';

@Injectable()
export class LapService {
  private lastLapNum = 0;

  constructor(private readonly alertService: AlertService) {}

  /**
   * Processa dados de volta.
   * Exibe tempo da volta anterior e atual, e emite alerta de nova volta.
   */
  handle(lap: LapData) {
    const last = FormatUtil.lapTime(lap.lastLapTimeMs);
    const current = FormatUtil.lapTime(lap.currentLapTimeMs);

    console.log(
      `⏱ Última: ${last} — Atual: ${current} — Volta: ${lap.currentLapNum}`,
    );

    // Quando a volta atual superar a última registrada, emite alerta
    if (lap.currentLapNum > this.lastLapNum) {
      this.alertService.notify(`Nova volta: ${lap.currentLapNum}`);
    }

    this.lastLapNum = lap.currentLapNum;
  }
}
