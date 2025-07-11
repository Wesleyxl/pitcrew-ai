// src/telemetry/tyre-set/tyre-set.parser.ts

/**
 * Detalhes de cada conjunto de pneus no Pacote Tyre Sets (Packet ID = 12)
 */
export interface TyreSetData {
  /** Índice de composto real (ver appendix) */
  actualTyreCompound: number;
  /** Índice de composto visual */
  visualTyreCompound: number;
  /** Desgaste em % */
  wear: number;
  /** Disponível (0 = não, 1 = sim) */
  available: number;
  /** Sessão recomendada (ver appendix) */
  recommendedSession: number;
  /** Vida útil restante em voltas */
  lifeSpan: number;
  /** Vida útil recomendada em voltas */
  usableLife: number;
  /** Delta de tempo em ms comparado ao conjunto em uso */
  lapDeltaTime: number;
  /** Está em uso (0 = não, 1 = sim) */
  fitted: number;
}

/**
 * Payload completo do Pacote Tyre Sets (ID = 12)
 */
export interface TyreSetsPacket {
  /** Índice do carro a que se refere (0–21) */
  carIdx: number;
  /** Lista de até 20 conjuntos de pneus */
  tyreSetData: TyreSetData[];
  /** Índice no array de qual set está atualmente montado */
  fittedIdx: number;
}

export class TyreSetParser {
  /** Packet ID oficial para Tyre Sets */
  public static readonly PACKET_ID = 12;

  /** Tamanho do cabeçalho PacketHeader em bytes */
  private static readonly HEADER_LENGTH = 29;
  /** Número máximo de conjuntos */
  private static readonly NUM_SETS = 20;
  /** Tamanho de cada entrada TyreSetData em bytes */
  private static readonly ENTRY_LENGTH = 11;

  /**
   * Tenta parsear um buffer UDP como Tyre Sets Data.
   * @param buf Buffer bruto recebido
   * @returns TyreSetsPacket ou null se não for ID 12
   */
  public static parse(buf: Buffer): TyreSetsPacket | null {
    // 1) verifica packetId
    if (buf.readUInt8(6) !== TyreSetParser.PACKET_ID) {
      return null;
    }

    // 2) offset base após cabeçalho
    const b = TyreSetParser.HEADER_LENGTH;

    // 3) ler carIdx
    const carIdx = buf.readUInt8(b);

    // 4) ler cada TyreSetData
    const tyreSetData: TyreSetData[] = [];
    let offset = b + 1;
    for (let i = 0; i < TyreSetParser.NUM_SETS; i++) {
      const actualTyreCompound = buf.readUInt8(offset + 0);
      const visualTyreCompound = buf.readUInt8(offset + 1);
      const wear = buf.readUInt8(offset + 2);
      const available = buf.readUInt8(offset + 3);
      const recommendedSession = buf.readUInt8(offset + 4);
      const lifeSpan = buf.readUInt8(offset + 5);
      const usableLife = buf.readUInt8(offset + 6);
      const lapDeltaTime = buf.readInt16LE(offset + 7);
      const fitted = buf.readUInt8(offset + 9);

      tyreSetData.push({
        actualTyreCompound,
        visualTyreCompound,
        wear,
        available,
        recommendedSession,
        lifeSpan,
        usableLife,
        lapDeltaTime,
        fitted,
      });
      offset += TyreSetParser.ENTRY_LENGTH;
    }

    // 5) ler fittedIdx
    const fittedIdx = buf.readUInt8(offset);

    return {
      carIdx,
      tyreSetData,
      fittedIdx,
    };
  }
}
