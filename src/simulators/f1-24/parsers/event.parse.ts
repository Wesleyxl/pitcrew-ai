// src/telemetry/event/event.parser.ts

/**
 * Todos os campos extraídos do Pacote Event Data (Packet ID = 3)
 * Eventos disparados durante a sessão: melhor volta, DRS, safety car, flashbacks, colisões etc.
 */

export type EventData =
  | FastestLapEvent
  | RetirementEvent
  | DrsEvent
  | TeamMateInPitsEvent
  | ChequeredFlagEvent
  | RaceWinnerEvent
  | PenaltyEvent
  | SpeedTrapEvent
  | StartLightsEvent
  | LightsOutEvent
  | DriveThroughServedEvent
  | StopGoServedEvent
  | FlashbackEvent
  | ButtonStatusEvent
  | OvertakeEvent
  | SafetyCarEvent
  | CollisionEvent;

interface BaseEvent {
  /** Código de 4 caracteres do evento (e.g. "FTLP", "DRSE") */
  eventCode: string;
}

export interface FastestLapEvent extends BaseEvent {
  eventCode: 'FTLP';
  vehicleIdx: number;
  lapTime: number; // em segundos
}

export interface RetirementEvent extends BaseEvent {
  eventCode: 'RTMT';
  vehicleIdx: number;
}

export interface DrsEvent extends BaseEvent {
  eventCode: 'DRSE' | 'DRSD';
  // tipo pode ser “DRSE” (enabled) ou “DRSD” (disabled)
}

export interface TeamMateInPitsEvent extends BaseEvent {
  eventCode: 'TMPT';
  vehicleIdx: number;
}

export interface ChequeredFlagEvent extends BaseEvent {
  eventCode: 'CHQF';
}

export interface RaceWinnerEvent extends BaseEvent {
  eventCode: 'RCWN';
  vehicleIdx: number;
}

export interface PenaltyEvent extends BaseEvent {
  eventCode: 'PENA';
  penaltyType: number;
  infringementType: number;
  vehicleIdx: number;
  otherVehicleIdx: number;
  time: number; // segundos ou penalidade fixa
  lapNum: number;
  placesGained: number;
}

export interface SpeedTrapEvent extends BaseEvent {
  eventCode: 'SPTP';
  vehicleIdx: number;
  speed: number; // km/h
  isOverallFastestInSession: boolean;
  isDriverFastestInSession: boolean;
  fastestVehicleIdxInSession: number;
  fastestSpeedInSession: number; // km/h
}

export interface StartLightsEvent extends BaseEvent {
  eventCode: 'STLG';
  numLights: number;
}

export interface LightsOutEvent extends BaseEvent {
  eventCode: 'LGOT';
}

export interface DriveThroughServedEvent extends BaseEvent {
  eventCode: 'DTSV';
  vehicleIdx: number;
}

export interface StopGoServedEvent extends BaseEvent {
  eventCode: 'SGSV';
  vehicleIdx: number;
}

export interface FlashbackEvent extends BaseEvent {
  eventCode: 'FLBK';
  flashbackFrameIdentifier: number;
  flashbackSessionTime: number; // em segundos
}

export interface ButtonStatusEvent extends BaseEvent {
  eventCode: 'BUTN';
  buttonStatus: number; // bitmask
}

export interface OvertakeEvent extends BaseEvent {
  eventCode: 'OVTK';
  overtakingVehicleIdx: number;
  beingOvertakenVehicleIdx: number;
}

export interface SafetyCarEvent extends BaseEvent {
  eventCode: 'SCAR';
  safetyCarType: number; // 0=none,1=full,2=virtual,3=formation
  eventType: number; // 0=deployed,1=returning,2=returned,3=resume race
}

export interface CollisionEvent extends BaseEvent {
  eventCode: 'COLL';
  vehicle1Idx: number;
  vehicle2Idx: number;
}

export class EventParser {
  public static readonly PACKET_ID = 3;
  private static readonly HEADER_LENGTH = 9; // até o código de evento

  /**
   * Faz parse de um buffer UDP de Event Data.
   * Retorna um EventData tipado ou null se não for ID 3.
   */
  public static parse(buffer: Buffer): EventData | null {
    if (buffer.readUInt8(6) !== EventParser.PACKET_ID) return null;

    // 9..13 contém o código de evento (4 bytes ASCII)
    const code = buffer.toString(
      'utf8',
      EventParser.HEADER_LENGTH,
      EventParser.HEADER_LENGTH + 4,
    ) as EventData['eventCode'];
    const o = EventParser.HEADER_LENGTH + 4;

    switch (code) {
      case 'FTLP':
        return {
          eventCode: code,
          vehicleIdx: buffer.readUInt8(o + 0),
          lapTime: buffer.readFloatLE(o + 1),
        };
      case 'RTMT':
        return {
          eventCode: code,
          vehicleIdx: buffer.readUInt8(o + 0),
        };
      case 'DRSE':
      case 'DRSD':
        return { eventCode: code };
      case 'TMPT':
        return {
          eventCode: code,
          vehicleIdx: buffer.readUInt8(o + 0),
        };
      case 'CHQF':
        return { eventCode: code };
      case 'RCWN':
        return {
          eventCode: code,
          vehicleIdx: buffer.readUInt8(o + 0),
        };
      case 'PENA':
        return {
          eventCode: code,
          penaltyType: buffer.readUInt8(o + 0),
          infringementType: buffer.readUInt8(o + 1),
          vehicleIdx: buffer.readUInt8(o + 2),
          otherVehicleIdx: buffer.readUInt8(o + 3),
          time: buffer.readUInt8(o + 4),
          lapNum: buffer.readUInt8(o + 5),
          placesGained: buffer.readUInt8(o + 6),
        };
      case 'SPTP':
        return {
          eventCode: code,
          vehicleIdx: buffer.readUInt8(o + 0),
          speed: buffer.readFloatLE(o + 1),
          isOverallFastestInSession: !!buffer.readUInt8(o + 5),
          isDriverFastestInSession: !!buffer.readUInt8(o + 6),
          fastestVehicleIdxInSession: buffer.readUInt8(o + 7),
          fastestSpeedInSession: buffer.readFloatLE(o + 8),
        };
      case 'STLG':
        return {
          eventCode: code,
          numLights: buffer.readUInt8(o + 0),
        };
      case 'LGOT':
        return { eventCode: code };
      case 'DTSV':
        return {
          eventCode: code,
          vehicleIdx: buffer.readUInt8(o + 0),
        };
      case 'SGSV':
        return {
          eventCode: code,
          vehicleIdx: buffer.readUInt8(o + 0),
        };
      case 'FLBK':
        return {
          eventCode: code,
          flashbackFrameIdentifier: buffer.readUInt32LE(o + 0),
          flashbackSessionTime: buffer.readFloatLE(o + 4),
        };
      case 'BUTN':
        return {
          eventCode: code,
          buttonStatus: buffer.readUInt32LE(o + 0),
        };
      case 'OVTK':
        return {
          eventCode: code,
          overtakingVehicleIdx: buffer.readUInt8(o + 0),
          beingOvertakenVehicleIdx: buffer.readUInt8(o + 1),
        };
      case 'SCAR':
        return {
          eventCode: code,
          safetyCarType: buffer.readUInt8(o + 0),
          eventType: buffer.readUInt8(o + 1),
        };
      case 'COLL':
        return {
          eventCode: code,
          vehicle1Idx: buffer.readUInt8(o + 0),
          vehicle2Idx: buffer.readUInt8(o + 1),
        };
      default:
        // eventos não mapeados
        return null;
    }
  }
}
