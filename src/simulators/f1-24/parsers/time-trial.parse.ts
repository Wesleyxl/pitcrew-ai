// src/telemetry/time-trial/time-trial.parser.ts

/**
 * Um único conjunto de dados de Time Trial
 */
export interface TimeTrialDataSet {
  /** Índice do carro a que se refere */
  carIdx: number;
  /** ID da equipe */
  teamId: number;
  /** Tempo de volta em milisegundos */
  lapTimeMs: number;
  /** Tempo do setor 1 em milisegundos */
  sector1TimeMs: number;
  /** Tempo do setor 2 em milisegundos */
  sector2TimeMs: number;
  /** Traction control – 0=off, 1=medium, 2=full */
  tractionControl: number;
  /** Gearbox assist – 1=manual, 2=manual&suggested, 3=auto */
  gearboxAssist: number;
  /** Anti-lock brakes – 0=off, 1=on */
  antiLockBrakes: number;
  /** Equal car performance – 0=realistic, 1=equal */
  equalCarPerformance: number;
  /** Custom setup – 0=no, 1=yes */
  customSetup: number;
  /** Marca se o conjunto é válido – 0=invalid, 1=valid */
  valid: number;
}

/**
 * Pacote completo de Time Trial (Packet ID = 14)
 */
export interface TimeTrialData {
  /** Melhor da sessão (player session best) */
  playerSessionBest: TimeTrialDataSet;
  /** Melhor pessoal (personal best) */
  personalBest: TimeTrialDataSet;
  /** Dados do rival */
  rival: TimeTrialDataSet;
}

export class TimeTrialParser {
  /** Packet ID oficial para Time Trial */
  public static readonly PACKET_ID = 14;
  /** Tamanho do cabeçalho PacketHeader em bytes */
  private static readonly HEADER_LENGTH = 29;
  /** Tamanho em bytes de cada TimeTrialDataSet */
  private static readonly SET_LENGTH = 20;

  /**
   * Faz parse do buffer bruto UDP como Time Trial Data.
   * Retorna null se não for Packet ID 14.
   */
  public static parse(buffer: Buffer): TimeTrialData | null {
    // 1) Verifica packet id
    if (buffer.readUInt8(6) !== TimeTrialParser.PACKET_ID) {
      return null;
    }
    // 2) Confirma tamanho mínimo (header + 3 conjuntos)
    const expectedMin = this.HEADER_LENGTH + this.SET_LENGTH * 3;
    if (buffer.length < expectedMin) {
      throw new Error(
        `Buffer muito curto para TimeTrialData: ${buffer.length} bytes, esperado ao menos ${expectedMin}`,
      );
    }

    // Função auxiliar para ler um TimeTrialDataSet
    const readSet = (base: number): TimeTrialDataSet => {
      return {
        carIdx: buffer.readUInt8(base + 0),
        teamId: buffer.readUInt8(base + 1),
        lapTimeMs: buffer.readUInt32LE(base + 2),
        sector1TimeMs: buffer.readUInt32LE(base + 6),
        sector2TimeMs: buffer.readUInt32LE(base + 10),
        tractionControl: buffer.readUInt8(base + 14),
        gearboxAssist: buffer.readUInt8(base + 15),
        antiLockBrakes: buffer.readUInt8(base + 16),
        equalCarPerformance: buffer.readUInt8(base + 17),
        customSetup: buffer.readUInt8(base + 18),
        valid: buffer.readUInt8(base + 19),
      };
    };

    const b = TimeTrialParser.HEADER_LENGTH;
    return {
      playerSessionBest: readSet(b + this.SET_LENGTH * 0),
      personalBest: readSet(b + this.SET_LENGTH * 1),
      rival: readSet(b + this.SET_LENGTH * 2),
    };
  }
}
