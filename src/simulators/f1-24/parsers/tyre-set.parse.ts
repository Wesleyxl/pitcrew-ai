// src/simulators/f1-24/parsers/tyre-sets.parse.ts

/**
 * Dados de cada conjunto de pneus (front e rear) disponíveis
 */
export interface TyreSetsData {
  numCarTyreSets: number;
  tyreSetActualCompound: number[]; // compósitos atuais por slot
  tyreSetVisualCompound: number[]; // compósitos visuais por slot
  tyreSetAgeLaps: number[]; // idade em voltas por slot
}

export class TyreSetsParser {
  public static readonly PACKET_ID = 12;
  private static readonly HEADER_LENGTH = 29;
  private static readonly SET_SIZE = 7; // número de campos por set
  private static readonly NUM_SETS = 4; // 4 sets por carro
  private static readonly PAYLOAD_LENGTH =
    TyreSetsParser.SET_SIZE * TyreSetsParser.NUM_SETS;

  /**
   * Faz parse de um buffer UDP de Tyre Sets (ID 12).
   * Retorna null se não for o packet correto ou buffer for curto.
   */
  public static parse(buffer: Buffer): TyreSetsData | null {
    // 1) Verifica Packet ID
    if (buffer.readUInt8(6) !== TyreSetsParser.PACKET_ID) {
      return null;
    }

    // 2) Verifica tamanho mínimo
    const minLen = TyreSetsParser.HEADER_LENGTH + TyreSetsParser.PAYLOAD_LENGTH;
    if (buffer.length < minLen) {
      console.warn(
        `TyreSetsParser: buffer muito curto (${buffer.length} bytes), precisa de pelo menos ${minLen}`,
      );
      return null;
    }

    const base = TyreSetsParser.HEADER_LENGTH;
    const numCarTyreSets = buffer.readUInt8(base);
    const actual: number[] = [];
    const visual: number[] = [];
    const age: number[] = [];

    // 3) Offset para arrays
    let offset = base + 1;
    for (let i = 0; i < TyreSetsParser.NUM_SETS; i++) {
      actual.push(buffer.readUInt8(offset + i)); // compósito atual
    }
    offset += TyreSetsParser.NUM_SETS;
    for (let i = 0; i < TyreSetsParser.NUM_SETS; i++) {
      visual.push(buffer.readUInt8(offset + i)); // compósito visual
    }
    offset += TyreSetsParser.NUM_SETS;
    for (let i = 0; i < TyreSetsParser.NUM_SETS; i++) {
      age.push(buffer.readUInt8(offset + i)); // idade
    }

    return {
      numCarTyreSets,
      tyreSetActualCompound: actual,
      tyreSetVisualCompound: visual,
      tyreSetAgeLaps: age,
    };
  }
}
