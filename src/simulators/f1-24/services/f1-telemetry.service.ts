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
import { ParticipantParser } from '../parsers/participants.parser';
import { SessionParser } from '../parsers/session.parse';
import { MotionParser } from '../parsers/motion.parse';
import { CarSetupParser } from '../parsers/car-setup.parse';
import { CarDamageParser } from '../parsers/car-damage.parse';
import { CarTelemetryParser } from '../parsers/car-telemetry.parse';
import { CarStatusParser } from '../parsers/car-status';
import { FinalClassificationParser } from '../parsers/final-classification.parse';
import { LobbyInfoParser } from '../parsers/lobby-info.parse';
import { TyreSetsParser } from '../parsers/tyre-set.parse';
import { TimeTrialParser } from '../parsers/time-trial.parse';
import { SessionHistoryParser } from '../parsers/session-history.parse';
import { MotionExParser } from '../parsers/motion-ex.parse';

type TelemetryType =
  | 'lap'
  | 'event'
  | 'participants'
  | 'session'
  | 'motion'
  | 'carSetup'
  | 'carDamage'
  | 'carTelemetry'
  | 'carStatus'
  | 'finalClassification'
  | 'lobbyInfo'
  | 'tyreSets'
  | 'timeTrial'
  | 'sessionHistory'
  | 'motionEx'
  | 'unknown';

interface TelemetryMessage<T extends TelemetryType, D> {
  type: T;
  data: D;
}

@Injectable()
export class F124TelemetryService implements OnModuleInit {
  private adapter = new F124Adapter();

  constructor(
    private readonly udp: UdpService,
    private readonly lapService: LapService,
    private readonly eventService: EventService,
    private readonly gateway: TelemetryGateway,
  ) {}

  onModuleInit() {
    this.udp.raw$
      .pipe(filter((buf) => this.adapter.supports(buf)))
      .subscribe((buffer) => {
        const pid = buffer.readUInt8(6);
        const parsed = this.adapter.parse(buffer);

        if (!parsed) {
          return;
        }

        let type: TelemetryType;
        if (pid === LapParser.PACKET_ID) {
          type = 'lap';
        } else if (pid === EventParser.PACKET_ID) {
          type = 'event';
        } else if (pid === ParticipantParser.PACKET_ID) {
          type = 'participants';
        } else if (pid === SessionParser.PACKET_ID) {
          type = 'session';
        } else if (pid === MotionParser.PACKET_ID) {
          type = 'motion';
        } else if (pid === CarSetupParser.PACKET_ID) {
          type = 'carSetup';
        } else if (pid === CarDamageParser.PACKET_ID) {
          type = 'carDamage';
        } else if (pid === CarTelemetryParser.PACKET_ID) {
          type = 'carTelemetry';
        } else if (pid === CarStatusParser.PACKET_ID) {
          type = 'carStatus';
        } else if (pid === FinalClassificationParser.PACKET_ID) {
          type = 'finalClassification';
        } else if (pid === LobbyInfoParser.PACKET_ID) {
          type = 'lobbyInfo';
        } else if (pid === TyreSetsParser.PACKET_ID) {
          type = 'tyreSets';
        } else if (pid === TimeTrialParser.PACKET_ID) {
          type = 'timeTrial';
        } else if (pid === SessionHistoryParser.PACKET_ID) {
          type = 'sessionHistory';
        } else if (pid === MotionExParser.PACKET_ID) {
          type = 'motionEx';
        } else {
          type = 'unknown';
        }

        const msg: TelemetryMessage<typeof type, typeof parsed> = {
          type,
          data: parsed,
        };

        this.gateway.server.emit('telemetry', msg);

        // regras e processamento de dados
        // 1) se for LapData, processa
        if (pid === LapParser.PACKET_ID) {
          this.lapService.handle(parsed as any);
        }

        // // 2) se for EventData, processa
        // if (pid === EventParser.PACKET_ID) {
        //   this.eventService.handle(data as any);
        // }
      });
  }
}
