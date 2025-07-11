// src/telemetry/car-telemetry/car-telemetry.parser.ts

/**
 * Dados de telemetria de um único carro no pacote Car Telemetry (ID = 6)
 */
export interface CarTelemetryData {
  speed: number; // km/h
  throttle: number; // 0.0–1.0
  steer: number; // –1.0–1.0
  brake: number; // 0.0–1.0
  clutch: number; // 0–100
  gear: number; // –1 = R, 0 = N, 1–8 = gears
  engineRPM: number;
  drs: number; // 0 = off, 1 = on
  revLightsPercent: number; // 0–100
  revLightsBitValue: number; // bitmap LEDs
  brakesTemperature: number[]; // [RL, RR, FL, FR] °C
  tyresSurfaceTemperature: number[]; // [RL, RR, FL, FR] °C
  tyresInnerTemperature: number[]; // [RL, RR, FL, FR] °C
  engineTemperature: number; // °C
  tyresPressure: number[]; // [RL, RR, FL, FR] PSI
  surfaceType: number[]; // [RL, RR, FL, FR]
}

/**
 * Estrutura do pacote Car Telemetry (ID = 6)
 */
export interface PacketCarTelemetry {
  carTelemetryData: CarTelemetryData[]; // 22 carros
  mfdPanelIndex: number; // painel atual (player)
  mfdPanelIndexSecondary: number; // painel player 2 (splitscreen)
  suggestedGear: number; // gear sugerida (–1 se nenhuma)
}

export class CarTelemetryParser {
  public static readonly PACKET_ID = 6;
  private static readonly HEADER_LENGTH = 29;
  private static readonly CAR_COUNT = 22;
  private static readonly RECORD_LENGTH = 60; // tamanho de CarTelemetryData em bytes

  /**
   * Faz o parse do buffer UDP e retorna PacketCarTelemetry ou null
   */
  public static parse(buffer: Buffer): PacketCarTelemetry | null {
    // 1) Verifica Packet ID
    if (buffer.readUInt8(6) !== CarTelemetryParser.PACKET_ID) {
      return null;
    }
    // 2) Valida tamanho mínimo
    const minLen =
      CarTelemetryParser.HEADER_LENGTH +
      CarTelemetryParser.CAR_COUNT * CarTelemetryParser.RECORD_LENGTH +
      3; // +3 bytes de metadata
    if (buffer.length < minLen) {
      throw new Error(
        `Buffer muito curto para CarTelemetry: ${buffer.length} bytes`,
      );
    }

    const cars: CarTelemetryData[] = [];
    const base = CarTelemetryParser.HEADER_LENGTH;

    // 3) Extrai telemetria de cada carro
    for (let i = 0; i < CarTelemetryParser.CAR_COUNT; i++) {
      const off = base + i * CarTelemetryParser.RECORD_LENGTH;
      cars.push({
        speed: buffer.readUInt16LE(off + 0),
        throttle: buffer.readFloatLE(off + 2),
        steer: buffer.readFloatLE(off + 6),
        brake: buffer.readFloatLE(off + 10),
        clutch: buffer.readUInt8(off + 14),
        gear: buffer.readInt8(off + 15),
        engineRPM: buffer.readUInt16LE(off + 16),
        drs: buffer.readUInt8(off + 18),
        revLightsPercent: buffer.readUInt8(off + 19),
        revLightsBitValue: buffer.readUInt16LE(off + 20),
        brakesTemperature: [
          buffer.readUInt16LE(off + 22),
          buffer.readUInt16LE(off + 24),
          buffer.readUInt16LE(off + 26),
          buffer.readUInt16LE(off + 28),
        ],
        tyresSurfaceTemperature: [
          buffer.readUInt8(off + 30),
          buffer.readUInt8(off + 31),
          buffer.readUInt8(off + 32),
          buffer.readUInt8(off + 33),
        ],
        tyresInnerTemperature: [
          buffer.readUInt8(off + 34),
          buffer.readUInt8(off + 35),
          buffer.readUInt8(off + 36),
          buffer.readUInt8(off + 37),
        ],
        engineTemperature: buffer.readUInt16LE(off + 38),
        tyresPressure: [
          buffer.readFloatLE(off + 40),
          buffer.readFloatLE(off + 44),
          buffer.readFloatLE(off + 48),
          buffer.readFloatLE(off + 52),
        ],
        surfaceType: [
          buffer.readUInt8(off + 56),
          buffer.readUInt8(off + 57),
          buffer.readUInt8(off + 58),
          buffer.readUInt8(off + 59),
        ],
      });
    }

    // 4) Extrai metadata final
    const metaOff =
      base + CarTelemetryParser.CAR_COUNT * CarTelemetryParser.RECORD_LENGTH;
    const mfdPanelIndex = buffer.readUInt8(metaOff);
    const mfdPanelIndexSecondary = buffer.readUInt8(metaOff + 1);
    const suggestedGear = buffer.readInt8(metaOff + 2);

    return {
      carTelemetryData: cars,
      mfdPanelIndex,
      mfdPanelIndexSecondary,
      suggestedGear,
    };
  }
}
