// src/telemetry/session-history/session-history.parser.ts

/**
 * Todos os campos extraídos do Pacote Session History Data (Packet ID = 11)
 * Contém histórico de voltas e stint de pneus para cada carro.
 */

export interface LapHistoryEntry {
  /** Tempo da volta em milissegundos */
  lapTimeInMs: number;
  /** Setor 1 — milissegundos */
  sector1TimeMsPart: number;
  /** Setor 1 — minutos */
  sector1TimeMinutesPart: number;
  /** Setor 2 — milissegundos */
  sector2TimeMsPart: number;
  /** Setor 2 — minutos */
  sector2TimeMinutesPart: number;
  /** Setor 3 — milissegundos */
  sector3TimeMsPart: number;
  /** Setor 3 — minutos */
  sector3TimeMinutesPart: number;
  /** Flags de validade (bit0=lap, bit1=sector1, bit2=sector2, bit3=sector3) */
  lapValidBitFlags: number;
}

export interface TyreStintEntry {
  /** Volta em que o stint termina (255 = atual) */
  endLap: number;
  /** Composto real utilizado */
  tyreActualCompound: number;
  /** Composto visual utilizado */
  tyreVisualCompound: number;
}

export interface SessionHistoryData {
  /** Índice do carro a que se refere (0–21) */
  carIdx: number;
  /** Número de voltas armazenadas (incluindo parcial) */
  numLaps: number;
  /** Número de stints de pneus registrados */
  numTyreStints: number;
  /** Volta da melhor volta */
  bestLapTimeLapNum: number;
  /** Volta do melhor setor 1 */
  bestSector1LapNum: number;
  /** Volta do melhor setor 2 */
  bestSector2LapNum: number;
  /** Volta do melhor setor 3 */
  bestSector3LapNum: number;
  /** Histórico de voltas */
  lapHistoryData: LapHistoryEntry[];
  /** Histórico de stint de pneus */
  tyreStintsHistoryData: TyreStintEntry[];
}

export class SessionHistoryParser {
  /** Packet ID oficial para Session History Data */
  public static readonly PACKET_ID = 11;

  /** Tamanho do cabeçalho PacketHeader em bytes */
  private static readonly HEADER_LENGTH = 29;
  /** Tamanho de cada registro LapHistoryData em bytes */
  private static readonly LAP_ENTRY_LENGTH = 14;
  /** Tamanho de cada registro TyreStintHistoryData em bytes */
  private static readonly STINT_ENTRY_LENGTH = 3;
  /** Máximo de voltas armazenadas na spec */
  private static readonly MAX_LAPS = 100;
  /** Máximo de tyre stints na spec */
  private static readonly MAX_STINTS = 8;

  /**
   * Tenta parsear um buffer UDP como Session History Data.
   * @param buf Buffer bruto recebido
   * @returns SessionHistoryData ou null se não for ID 11
   */
  public static parse(buf: Buffer): SessionHistoryData | null {
    // 1) verifica packetId no byte 6
    if (buf.readUInt8(6) !== SessionHistoryParser.PACKET_ID) {
      return null;
    }

    // 2) offset base após o cabeçalho
    const b = SessionHistoryParser.HEADER_LENGTH;

    // 3) campos iniciais
    const carIdx = buf.readUInt8(b + 0);
    const numLaps = buf.readUInt8(b + 1);
    const numTyreStints = buf.readUInt8(b + 2);
    const bestLapTimeLapNum = buf.readUInt8(b + 3);
    const bestSector1LapNum = buf.readUInt8(b + 4);
    const bestSector2LapNum = buf.readUInt8(b + 5);
    const bestSector3LapNum = buf.readUInt8(b + 6);

    // 4) lê lapHistoryData
    const lapHistoryData: LapHistoryEntry[] = [];
    let offset = b + 7;
    for (let i = 0; i < SessionHistoryParser.MAX_LAPS; i++) {
      const lapTimeInMs = buf.readUInt32LE(offset + 0);
      const sector1TimeMsPart = buf.readUInt16LE(offset + 4);
      const sector1TimeMinutesPart = buf.readUInt8(offset + 6);
      const sector2TimeMsPart = buf.readUInt16LE(offset + 7);
      const sector2TimeMinutesPart = buf.readUInt8(offset + 9);
      const sector3TimeMsPart = buf.readUInt16LE(offset + 10);
      const sector3TimeMinutesPart = buf.readUInt8(offset + 12);
      const lapValidBitFlags = buf.readUInt8(offset + 13);

      lapHistoryData.push({
        lapTimeInMs,
        sector1TimeMsPart,
        sector1TimeMinutesPart,
        sector2TimeMsPart,
        sector2TimeMinutesPart,
        sector3TimeMsPart,
        sector3TimeMinutesPart,
        lapValidBitFlags,
      });
      offset += SessionHistoryParser.LAP_ENTRY_LENGTH;
    }

    // 5) lê tyreStintsHistoryData
    const tyreStintsHistoryData: TyreStintEntry[] = [];
    for (let i = 0; i < SessionHistoryParser.MAX_STINTS; i++) {
      const endLap = buf.readUInt8(offset + 0);
      const tyreActualCompound = buf.readUInt8(offset + 1);
      const tyreVisualCompound = buf.readUInt8(offset + 2);
      tyreStintsHistoryData.push({
        endLap,
        tyreActualCompound,
        tyreVisualCompound,
      });
      offset += SessionHistoryParser.STINT_ENTRY_LENGTH;
    }

    return {
      carIdx,
      numLaps,
      numTyreStints,
      bestLapTimeLapNum,
      bestSector1LapNum,
      bestSector2LapNum,
      bestSector3LapNum,
      lapHistoryData,
      tyreStintsHistoryData,
    };
  }
}
