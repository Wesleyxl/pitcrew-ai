// src/telemetry/final-classification/final-classification.parser.ts

/**
 * Todos os campos extraídos do Pacote Final Classification (Packet ID = 8)
 */
export interface FinalClassificationData {
  /** Posição de chegada (1 = vencedor) */
  position: number;
  /** Total de voltas completadas */
  numLaps: number;
  /** Posição no grid de largada */
  gridPosition: number;
  /** Pontos ganhos nesta corrida */
  points: number;
  /** Quantidade de pit stops feitos */
  numPitStops: number;
  /** Status do resultado:
   * 0 = invalid, 1 = inactive, 2 = active,
   * 3 = finished, 4 = didnotfinish,
   * 5 = disqualified, 6 = not classified, 7 = retired
   */
  resultStatus: number;
  /** Melhor volta da sessão em milissegundos */
  bestLapTimeInMS: number;
  /** Tempo total de corrida em segundos (sem penalidades) */
  totalRaceTime: number;
  /** Tempo total de penalidades acumulado em segundos */
  penaltiesTime: number;
  /** Número de penalidades aplicadas */
  numPenalties: number;
  /** Número de stints de pneus utilizados */
  numTyreStints: number;
  /** Códigos dos compostos usados em cada stint (até 8) */
  tyreStintsActual: number[];
  /** Códigos visuais dos compostos em cada stint (até 8) */
  tyreStintsVisual: number[];
  /** Voltas em que cada stint terminou (até 8) */
  tyreStintsEndLaps: number[];
}

export interface FinalClassificationPacket {
  /** Número de carros na classificação final */
  numCars: number;
  /** Lista de dados de classificação, na ordem de veículo (0–21) */
  classifications: FinalClassificationData[];
}

export class FinalClassificationParser {
  public static readonly PACKET_ID = 8;
  private static readonly HEADER_LENGTH = 29; // PacketHeader size
  private static readonly ENTRY_LENGTH = 45; // Size of each FinalClassificationEntry
  private static readonly MAX_CARS = 22; // Máximo de carros por pacote

  /**
   * Faz o parse de um buffer UDP e retorna os dados de classificação final.
   * Retorna null se não for Packet ID = 8.
   */
  public static parse(buffer: Buffer): FinalClassificationPacket | null {
    // 1) Verifica Packet ID
    if (buffer.readUInt8(6) !== FinalClassificationParser.PACKET_ID) {
      return null;
    }

    // 2) Lê número de carros
    const numCars = buffer.readUInt8(FinalClassificationParser.HEADER_LENGTH);
    if (numCars > FinalClassificationParser.MAX_CARS) {
      throw new Error(`numCars inválido: ${numCars}`);
    }

    // 3) Valida tamanho mínimo
    const expectedLen =
      FinalClassificationParser.HEADER_LENGTH +
      1 +
      numCars * FinalClassificationParser.ENTRY_LENGTH;
    if (buffer.length < expectedLen) {
      throw new Error(
        `Buffer muito curto para FinalClassification: ${buffer.length} bytes, esperado pelo menos ${expectedLen}`,
      );
    }

    const classifications: FinalClassificationData[] = [];
    let offset = FinalClassificationParser.HEADER_LENGTH + 1;

    for (let i = 0; i < numCars; i++) {
      const entry: FinalClassificationData = {
        position: buffer.readUInt8(offset + 0),
        numLaps: buffer.readUInt8(offset + 1),
        gridPosition: buffer.readUInt8(offset + 2),
        points: buffer.readUInt8(offset + 3),
        numPitStops: buffer.readUInt8(offset + 4),
        resultStatus: buffer.readUInt8(offset + 5),
        bestLapTimeInMS: buffer.readUInt32LE(offset + 6),
        totalRaceTime: buffer.readDoubleLE(offset + 10),
        penaltiesTime: buffer.readUInt8(offset + 18),
        numPenalties: buffer.readUInt8(offset + 19),
        numTyreStints: buffer.readUInt8(offset + 20),
        tyreStintsActual: Array.from(buffer.slice(offset + 21, offset + 29)),
        tyreStintsVisual: Array.from(buffer.slice(offset + 29, offset + 37)),
        tyreStintsEndLaps: Array.from(buffer.slice(offset + 37, offset + 45)),
      };

      classifications.push(entry);
      offset += FinalClassificationParser.ENTRY_LENGTH;
    }

    return { numCars, classifications };
  }
}
