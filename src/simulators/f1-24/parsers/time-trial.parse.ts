// src/telemetry/time-trial/time-trial.parser.ts

export interface TimeTrialDataSet {
  carIdx: number;
  teamId: number;
  lapTimeMs: number; // m_lapTimeInMS
  sector1TimeMs: number; // m_sector1TimeInMS
  sector2TimeMs: number; // m_sector2TimeInMS
  sector3TimeMs: number; // m_sector3TimeInMS
  tractionControl: number;
  gearboxAssist: number;
  antiLockBrakes: number;
  equalCarPerformance: number;
  customSetup: number;
  valid: number;
}

export interface TimeTrialData {
  playerSessionBest: TimeTrialDataSet;
  personalBest: TimeTrialDataSet;
  rival: TimeTrialDataSet;
}

export class TimeTrialParser {
  public static readonly PACKET_ID = 14;
  private static readonly HEADER_LENGTH = 29;
  // Agora 24 bytes por TimeTrialDataSet (1+1+4+4+4+4+1+1+1+1+1+1)
  private static readonly SET_LENGTH = 24;

  public static parse(buffer: Buffer): TimeTrialData | null {
    if (buffer.readUInt8(6) !== TimeTrialParser.PACKET_ID) return null;
    const expectedMin =
      TimeTrialParser.HEADER_LENGTH + TimeTrialParser.SET_LENGTH * 3;
    if (buffer.length < expectedMin) {
      throw new Error(
        `Buffer muito curto para TimeTrialData: ${buffer.length} bytes, esperado ≥ ${expectedMin}`,
      );
    }

    const readSet = (base: number): TimeTrialDataSet => ({
      carIdx: buffer.readUInt8(base + 0),
      teamId: buffer.readUInt8(base + 1),
      lapTimeMs: buffer.readUInt32LE(base + 2),
      sector1TimeMs: buffer.readUInt32LE(base + 6),
      sector2TimeMs: buffer.readUInt32LE(base + 10),
      sector3TimeMs: buffer.readUInt32LE(base + 14),
      tractionControl: buffer.readUInt8(base + 18),
      gearboxAssist: buffer.readUInt8(base + 19),
      antiLockBrakes: buffer.readUInt8(base + 20),
      equalCarPerformance: buffer.readUInt8(base + 21),
      customSetup: buffer.readUInt8(base + 22),
      valid: buffer.readUInt8(base + 23),
    });

    const b = TimeTrialParser.HEADER_LENGTH;
    return {
      playerSessionBest: readSet(b + TimeTrialParser.SET_LENGTH * 0),
      personalBest: readSet(b + TimeTrialParser.SET_LENGTH * 1),
      rival: readSet(b + TimeTrialParser.SET_LENGTH * 2),
    };
  }
}
