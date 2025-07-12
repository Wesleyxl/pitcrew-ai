// src/simulators/f1-24/adapter/f124.adapter.ts

import { SimulatorAdapter } from './simulator-adapter.interface';
import { ParsedTelemetry } from '../models/parsed-telemetry';
import { LapParser } from '../parsers/lap.parse';
import { EventParser } from '../parsers/event.parse';
import { SessionParser } from '../parsers/session.parse';
import { MotionParser } from '../parsers/motion.parse';
import { ParticipantParser } from '../parsers/participants.parser';
import { SessionHistoryParser } from '../parsers/session-history.parse';
import { CarSetupParser } from '../parsers/car-setup.parse';
import { CarTelemetryParser } from '../parsers/car-telemetry.parse';
import { CarStatusParser } from '../parsers/car-status';
import { FinalClassificationParser } from '../parsers/final-classification.parse';
import { LobbyInfoParser } from '../parsers/lobby-info.parse';
import { CarDamageParser } from '../parsers/car-damage.parse';
import { TyreSetsParser } from '../parsers/tyre-set.parse';
import { MotionExParser } from '../parsers/motion-ex.parse';
import { TimeTrialParser } from '../parsers/time-trial.parse';
// … outros parsers

export class F124Adapter implements SimulatorAdapter<ParsedTelemetry | null> {
  private readonly validIds = [
    LapParser.PACKET_ID,
    SessionParser.PACKET_ID,
    EventParser.PACKET_ID,
    ParticipantParser.PACKET_ID,
    SessionHistoryParser.PACKET_ID,
    MotionParser.PACKET_ID,
    CarSetupParser.PACKET_ID,
    CarTelemetryParser.PACKET_ID,
    CarStatusParser.PACKET_ID,
    FinalClassificationParser.PACKET_ID,
    LobbyInfoParser.PACKET_ID,
    CarDamageParser.PACKET_ID,
    TyreSetsParser.PACKET_ID,
    MotionExParser.PACKET_ID,
    TimeTrialParser.PACKET_ID,
  ];

  supports(buffer: Buffer): boolean {
    const pid = buffer.readUInt8(6);
    return this.validIds.includes(pid);
  }

  parse(buffer: Buffer): ParsedTelemetry | null {
    const pid = buffer.readUInt8(6);

    try {
      switch (pid) {
        case LapParser.PACKET_ID:
          return LapParser.parse(buffer);
        case SessionParser.PACKET_ID:
          return SessionParser.parse(buffer);
        case EventParser.PACKET_ID:
          return EventParser.parse(buffer);
        case ParticipantParser.PACKET_ID:
          return ParticipantParser.parse(buffer);
        case SessionHistoryParser.PACKET_ID:
          return SessionHistoryParser.parse(buffer);
        case MotionParser.PACKET_ID:
          return MotionParser.parse(buffer);
        case CarSetupParser.PACKET_ID:
          return CarSetupParser.parse(buffer);
        case CarTelemetryParser.PACKET_ID:
          return CarTelemetryParser.parse(buffer);
        case CarStatusParser.PACKET_ID:
          return CarStatusParser.parse(buffer);
        case FinalClassificationParser.PACKET_ID:
          return FinalClassificationParser.parse(buffer);
        case LobbyInfoParser.PACKET_ID:
          return LobbyInfoParser.parse(buffer);
        case CarDamageParser.PACKET_ID:
          return CarDamageParser.parse(buffer);
        case TyreSetsParser.PACKET_ID:
          return TyreSetsParser.parse(buffer);
        case MotionExParser.PACKET_ID:
          return MotionExParser.parse(buffer);
        case TimeTrialParser.PACKET_ID:
          return TimeTrialParser.parse(buffer);
        default:
          return null;
      }
    } catch (err) {
      console.warn(`F124Adapter: erro ao parse PID=${pid}`, err);
      return null;
    }
  }
}
