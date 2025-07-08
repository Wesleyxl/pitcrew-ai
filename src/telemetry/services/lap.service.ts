import { Injectable } from '@nestjs/common';
import { LapData } from '../parser/lap.parse';
import { FormatUtil } from '../utils/format.utils';
import { AlertService } from './alert.service';

@Injectable()
export class LapService {
  private lastLapNum = 0;

  constructor(private alerts: AlertService) {}

  handle(lap: LapData) {
    const last = FormatUtil.lapTime(lap.lastLapTimeMs);
    const curr = FormatUtil.lapTime(lap.currentLapTimeMs);
    console.log(
      `⏱ Última: ${last} — Atual: ${curr} — Volta: ${lap.currentLapNum}`,
    );

    // exibe alerta quando a volta mudar
    if (lap.currentLapNum > this.lastLapNum) {
      this.alerts.notify(`Nova volta: ${lap.currentLapNum}`);
    }
    this.lastLapNum = lap.currentLapNum;
  }
}
