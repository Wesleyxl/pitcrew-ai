// src/telemetry/car-damage/car-damage.parser.ts

/**
 * Dados de dano do carro extraídos do Car Damage Packet (Packet ID = 10)
 */
export interface CarDamageData {
  /** Desgaste dos pneus (%) [RL, RR, FL, FR] */
  tyreWear: number[];
  /** Dano dos pneus (%) [RL, RR, FL, FR] */
  tyreDamage: number[];
  /** Dano dos freios (%) [RL, RR, FL, FR] */
  brakeDamage: number[];
  /** Dano da asa dianteira esquerda (%) */
  frontLeftWingDamage: number;
  /** Dano da asa dianteira direita (%) */
  frontRightWingDamage: number;
  /** Dano da asa traseira (%) */
  rearWingDamage: number;
  /** Dano do assoalho (%) */
  floorDamage: number;
  /** Dano do difusor (%) */
  diffuserDamage: number;
  /** Dano das laterais (%) */
  sidepodDamage: number;
  /** Falha no DRS (true = falha) */
  drsFault: boolean;
  /** Falha no ERS (true = falha) */
  ersFault: boolean;
  /** Dano na caixa de câmbio (%) */
  gearBoxDamage: number;
  /** Dano do motor (%) */
  engineDamage: number;
  /** Desgaste MGU-H (%) */
  engineMGUHWear: number;
  /** Desgaste ES (%) */
  engineESWear: number;
  /** Desgaste CE (%) */
  engineCEWear: number;
  /** Desgaste ICE (%) */
  engineICEWear: number;
  /** Desgaste MGU-K (%) */
  engineMGUKWear: number;
  /** Desgaste TC (%) */
  engineTCWear: number;
  /** Motor estourado (true = estourado) */
  engineBlown: boolean;
  /** Motor travado (true = travado) */
  engineSeized: boolean;
}

/**
 * Parser do Car Damage Packet (ID = 10).
 * Lê apenas os dados relativos ao carro do jogador, usando m_playerCarIndex.
 */
export class CarDamageParser {
  public static readonly PACKET_ID = 10;
  private static readonly HEADER_LENGTH = 29; // tamanho do PacketHeader :contentReference[oaicite:4]{index=4}
  private static readonly ENTRY_LENGTH = 42; // bytes por CarDamageData (4*4 + 4 + 4 + 18*1)

  /**
   * Tenta parsear um buffer UDP como Car Damage.
   * @param buf Buffer bruto recebido
   * @returns CarDamageData ou null se não for ID 10
   */
  public static parse(buf: Buffer): CarDamageData | null {
    // 1) verifica packetId
    if (buf.readUInt8(6) !== CarDamageParser.PACKET_ID) return null;

    // 2) lê índice do carro do jogador no cabeçalho
    const playerIdx = buf.readUInt8(27);
    const base =
      CarDamageParser.HEADER_LENGTH + playerIdx * CarDamageParser.ENTRY_LENGTH;
    const end = base + CarDamageParser.ENTRY_LENGTH;
    if (buf.length < end) {
      throw new Error(
        `Buffer muito curto para CarDamageData: ${buf.length} bytes`,
      );
    }

    // 3) extrai floats m_tyresWear[4]
    const tyreWear: number[] = [];
    for (let i = 0; i < 4; i++) {
      tyreWear.push(buf.readFloatLE(base + i * 4));
    }

    let o = base + 16;
    // 4) extrai uint8 arrays e campos únicos
    const tyreDamage = Array.from({ length: 4 }, (_, i) =>
      buf.readUInt8(o + i),
    );
    o += 4;
    const brakeDamage = Array.from({ length: 4 }, (_, i) =>
      buf.readUInt8(o + i),
    );
    o += 4;
    const frontLeftWingDamage = buf.readUInt8(o++);
    const frontRightWingDamage = buf.readUInt8(o++);
    const rearWingDamage = buf.readUInt8(o++);
    const floorDamage = buf.readUInt8(o++);
    const diffuserDamage = buf.readUInt8(o++);
    const sidepodDamage = buf.readUInt8(o++);
    const drsFault = buf.readUInt8(o++) === 1;
    const ersFault = buf.readUInt8(o++) === 1;
    const gearBoxDamage = buf.readUInt8(o++);
    const engineDamage = buf.readUInt8(o++);
    const engineMGUHWear = buf.readUInt8(o++);
    const engineESWear = buf.readUInt8(o++);
    const engineCEWear = buf.readUInt8(o++);
    const engineICEWear = buf.readUInt8(o++);
    const engineMGUKWear = buf.readUInt8(o++);
    const engineTCWear = buf.readUInt8(o++);
    const engineBlown = buf.readUInt8(o++) === 1;
    const engineSeized = buf.readUInt8(o++) === 1;

    return {
      tyreWear,
      tyreDamage,
      brakeDamage,
      frontLeftWingDamage,
      frontRightWingDamage,
      rearWingDamage,
      floorDamage,
      diffuserDamage,
      sidepodDamage,
      drsFault,
      ersFault,
      gearBoxDamage,
      engineDamage,
      engineMGUHWear,
      engineESWear,
      engineCEWear,
      engineICEWear,
      engineMGUKWear,
      engineTCWear,
      engineBlown,
      engineSeized,
    };
  }
}
