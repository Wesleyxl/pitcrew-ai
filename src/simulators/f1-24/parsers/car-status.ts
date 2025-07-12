// src/telemetry/car-status/car-status.parser.ts

/**
 * Todos os campos extraídos do Pacote Car Status (Packet ID = 7)
 */
export interface CarStatusData {
  tractionControl: number; // 0 = off, 1 = medium, 2 = full
  antiLockBrakes: number; // 0 = off, 1 = on
  fuelMix: number; // 0 = lean, 1 = standard, 2 = rich, 3 = max
  frontBrakeBias: number; // Brake bias percentage
  pitLimiterStatus: number; // 0 = off, 1 = on
  fuelInTank: number; // Current fuel mass (kg)
  fuelCapacity: number; // Fuel capacity (kg)
  fuelRemainingLaps: number; // Estimated laps remaining
  maxRPM: number; // Cars max RPM
  idleRPM: number; // Cars idle RPM
  maxGears: number; // Maximum number of gears
  drsAllowed: number; // 0 = not allowed, 1 = allowed
  drsActivationDistance: number; // Distance (m) until DRS available
  actualTyreCompound: number; // See spec for codes
  visualTyreCompound: number; // See spec for codes
  tyresAgeLaps: number; // Age in laps of current tyre set
  vehicleFiaFlags: number; // -1 = invalid, 0 = none, 1 = green, 2 = blue, 3 = yellow
  enginePowerICE: number; // ICE power output (W)
  enginePowerMGUK: number; // MGU-K power output (W)
  ersStoreEnergy: number; // ERS energy store (J)
  ersDeployMode: number; // 0 = none, 1 = medium, 2 = hotlap, 3 = overtake
  ersHarvestedThisLapMGUK: number; // Energy harvested by MGU-K this lap (J)
  ersHarvestedThisLapMGUH: number; // Energy harvested by MGU-H this lap (J)
  ersDeployedThisLap: number; // Energy deployed this lap (J)
  networkPaused: number; // 0 = not paused, 1 = paused
}

export interface PacketCarStatus {
  /** Array de status para todos os carros (índice = vehicleIndex) */
  carStatusData: CarStatusData[];
}
export class CarStatusParser {
  public static readonly PACKET_ID = 7;
  private static readonly HEADER_LENGTH = 29;
  private static readonly DATA_LENGTH = 55;
  private static readonly NUM_CARS = 22;

  /**
   * Faz o parse de todo o PacketCarStatusData e retorna o array de CarStatusData
   * ou retorna null se não for Packet ID 7.
   */
  public static parse(buffer: Buffer): PacketCarStatus | null {
    // 1) Só processa se for o ID correto
    if (buffer.readUInt8(6) !== CarStatusParser.PACKET_ID) return null;

    // 2) Valida tamanho mínimo
    const minLen =
      CarStatusParser.HEADER_LENGTH +
      CarStatusParser.NUM_CARS * CarStatusParser.DATA_LENGTH;
    if (buffer.length < minLen) {
      throw new Error(
        `Buffer muito curto para CarStatusData: ${buffer.length} bytes, precisa de pelo menos ${minLen}`,
      );
    }

    const cars: CarStatusData[] = [];
    let offset = CarStatusParser.HEADER_LENGTH;

    for (let i = 0; i < CarStatusParser.NUM_CARS; i++) {
      const c: CarStatusData = {
        tractionControl: buffer.readUInt8(offset),
        antiLockBrakes: buffer.readUInt8(offset + 1),
        fuelMix: buffer.readUInt8(offset + 2),
        frontBrakeBias: buffer.readUInt8(offset + 3),
        pitLimiterStatus: buffer.readUInt8(offset + 4),
        fuelInTank: buffer.readFloatLE(offset + 5),
        fuelCapacity: buffer.readFloatLE(offset + 9),
        fuelRemainingLaps: buffer.readFloatLE(offset + 13),
        maxRPM: buffer.readUInt16LE(offset + 17),
        idleRPM: buffer.readUInt16LE(offset + 19),
        maxGears: buffer.readUInt8(offset + 21),
        drsAllowed: buffer.readUInt8(offset + 22),
        drsActivationDistance: buffer.readUInt16LE(offset + 23),
        actualTyreCompound: buffer.readUInt8(offset + 25),
        visualTyreCompound: buffer.readUInt8(offset + 26),
        tyresAgeLaps: buffer.readUInt8(offset + 27),
        vehicleFiaFlags: buffer.readInt8(offset + 28),
        enginePowerICE: buffer.readFloatLE(offset + 29),
        enginePowerMGUK: buffer.readFloatLE(offset + 33),
        ersStoreEnergy: buffer.readFloatLE(offset + 37),
        ersDeployMode: buffer.readUInt8(offset + 41),
        ersHarvestedThisLapMGUK: buffer.readFloatLE(offset + 42),
        ersHarvestedThisLapMGUH: buffer.readFloatLE(offset + 46),
        ersDeployedThisLap: buffer.readFloatLE(offset + 50),
        networkPaused: buffer.readUInt8(offset + 54),
      };

      cars.push(c);
      offset += CarStatusParser.DATA_LENGTH;
    }

    return { carStatusData: cars };
  }
}
