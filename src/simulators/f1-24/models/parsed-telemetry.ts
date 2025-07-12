// src/simulators/f1-24/models/parsed-telemetry.ts

import { LapData } from '../parsers/lap.parse';
import { EventData } from '../parsers/event.parse';
import { ParticipantsData } from '../parsers/participants.parser';
import { SessionHistoryData } from '../parsers/session-history.parse';
import { MotionData } from '../parsers/motion.parse';
import { PacketCarSetup } from '../parsers/car-setup.parse';
import { PacketCarTelemetry } from '../parsers/car-telemetry.parse';
import { CarDamageData } from '../parsers/car-damage.parse';
import { TimeTrialData } from '../parsers/time-trial.parse';
import { PacketCarStatus } from '../parsers/car-status';
import { TyreSetsData } from '../parsers/tyre-set.parse';
import { FinalClassificationPacket } from '../parsers/final-classification.parse';
import { LobbyInfoPacket } from '../parsers/lobby-info.parse';
import { SessionData } from '../parsers/session.parse';
import { MotionExData } from '../parsers/motion-ex.parse';

export type ParsedTelemetry =
  | LapData
  | SessionData
  | EventData
  | ParticipantsData
  | SessionHistoryData
  | MotionData
  | PacketCarSetup
  | PacketCarTelemetry
  | PacketCarStatus
  | FinalClassificationPacket
  | LobbyInfoPacket
  | CarDamageData
  | TyreSetsData
  | MotionExData
  | TimeTrialData;
