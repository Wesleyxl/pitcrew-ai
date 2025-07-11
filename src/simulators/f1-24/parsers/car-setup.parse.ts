// src/telemetry/car-setup/car-setup.parser.ts

/**
 * Todos os campos extraídos do Pacote Car Setups (Packet ID = 5)
 */
export interface CarSetupData {
  /** Front wing aero (0–255) */
  frontWing: number;
  /** Rear wing aero (0–255) */
  rearWing: number;
  /** Differential adjustment on throttle (%) */
  onThrottle: number;
  /** Differential adjustment off throttle (%) */
  offThrottle: number;
  /** Front camber angle (suspension geometry) */
  frontCamber: number;
  /** Rear camber angle (suspension geometry) */
  rearCamber: number;
  /** Front toe angle (suspension geometry) */
  frontToe: number;
  /** Rear toe angle (suspension geometry) */
  rearToe: number;
  /** Front suspension stiffness (0–255) */
  frontSuspension: number;
  /** Rear suspension stiffness (0–255) */
  rearSuspension: number;
  /** Front anti-roll bar (0–255) */
  frontAntiRollBar: number;
  /** Rear anti-roll bar (0–255) */
  rearAntiRollBar: number;
  /** Front ride height (0–255) */
  frontSuspensionHeight: number;
  /** Rear ride height (0–255) */
  rearSuspensionHeight: number;
  /** Brake pressure (%) */
  brakePressure: number;
  /** Brake bias (%) */
  brakeBias: number;
  /** Engine braking (%) */
  engineBraking: number;
  /** Rear left tyre pressure (PSI) */
  rearLeftTyrePressure: number;
  /** Rear right tyre pressure (PSI) */
  rearRightTyrePressure: number;
  /** Front left tyre pressure (PSI) */
  frontLeftTyrePressure: number;
  /** Front right tyre pressure (PSI) */
  frontRightTyrePressure: number;
  /** Ballast (0–255) */
  ballast: number;
  /** Fuel load (kg) */
  fuelLoad: number;
}

export interface PacketCarSetup {
  /** Array de setups para todos os carros (índice = vehicleIndex) */
  carSetups: CarSetupData[];
  /** Valor de asa dianteira que será aplicado no próximo pit stop (player-only) */
  nextFrontWingValue: number;
}

export class CarSetupParser {
  /** Packet ID oficial para Car Setups */
  public static readonly PACKET_ID = 5;
  /** Tamanho em bytes do cabeçalho PacketHeader */
  private static readonly HEADER_LENGTH = 29;
  /** Tamanho em bytes de cada CarSetupData */
  private static readonly SETUP_RECORD_LENGTH = 50;
  /** Número máximo de carros */
  private static readonly MAX_CARS = 22;

  /**
   * Faz o parse do buffer bruto UDP e retorna todos os CarSetupData
   * @param buffer Buffer recebido pelo socket
   * @returns PacketCarSetup ou null se não for ID = 5
   */
  public static parse(buffer: Buffer): PacketCarSetup | null {
    // 1) verifica se é o packetId correto (na posição 6 do header)
    if (buffer.readUInt8(6) !== CarSetupParser.PACKET_ID) {
      return null;
    }

    // 2) valida tamanho mínimo: HEADER + N registros + nextFrontWing
    const minLength =
      CarSetupParser.HEADER_LENGTH +
      CarSetupParser.MAX_CARS * CarSetupParser.SETUP_RECORD_LENGTH +
      4;
    if (buffer.length < minLength) {
      throw new Error(
        `Buffer muito curto para CarSetupData: ${buffer.length} bytes`,
      );
    }

    const setups: CarSetupData[] = [];
    const base = CarSetupParser.HEADER_LENGTH;

    for (let i = 0; i < CarSetupParser.MAX_CARS; i++) {
      const offset = base + i * CarSetupParser.SETUP_RECORD_LENGTH;
      setups.push({
        frontWing: buffer.readUInt8(offset + 0),
        rearWing: buffer.readUInt8(offset + 1),
        onThrottle: buffer.readUInt8(offset + 2),
        offThrottle: buffer.readUInt8(offset + 3),
        frontCamber: buffer.readFloatLE(offset + 4),
        rearCamber: buffer.readFloatLE(offset + 8),
        frontToe: buffer.readFloatLE(offset + 12),
        rearToe: buffer.readFloatLE(offset + 16),
        frontSuspension: buffer.readUInt8(offset + 20),
        rearSuspension: buffer.readUInt8(offset + 21),
        frontAntiRollBar: buffer.readUInt8(offset + 22),
        rearAntiRollBar: buffer.readUInt8(offset + 23),
        frontSuspensionHeight: buffer.readUInt8(offset + 24),
        rearSuspensionHeight: buffer.readUInt8(offset + 25),
        brakePressure: buffer.readUInt8(offset + 26),
        brakeBias: buffer.readUInt8(offset + 27),
        engineBraking: buffer.readUInt8(offset + 28),
        rearLeftTyrePressure: buffer.readFloatLE(offset + 29),
        rearRightTyrePressure: buffer.readFloatLE(offset + 33),
        frontLeftTyrePressure: buffer.readFloatLE(offset + 37),
        frontRightTyrePressure: buffer.readFloatLE(offset + 41),
        ballast: buffer.readUInt8(offset + 45),
        fuelLoad: buffer.readFloatLE(offset + 46),
      });
    }

    // 3) extrai o nextFrontWingValue (4 bytes após todos os SETUP_RECORDs)
    const nextFrontWingValueOffset =
      base + CarSetupParser.MAX_CARS * CarSetupParser.SETUP_RECORD_LENGTH;
    const nextFrontWingValue = buffer.readFloatLE(nextFrontWingValueOffset);

    return {
      carSetups: setups,
      nextFrontWingValue,
    };
  }
}
