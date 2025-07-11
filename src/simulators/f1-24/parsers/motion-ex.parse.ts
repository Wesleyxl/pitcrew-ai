// src/telemetry/motion-ex/motion-ex.parser.ts

/**
 * Dados estendidos de motion do Pacote Motion Ex (Packet ID = 13)
 * (suspensão, velocidade das rodas, forças, chassis yaw etc.)
 */
export interface MotionExData {
  suspensionPosition: number[]; // [RL, RR, FL, FR]
  suspensionVelocity: number[];
  suspensionAcceleration: number[];
  wheelSpeed: number[];
  wheelSlipRatio: number[];
  wheelSlipAngle: number[];
  wheelLatForce: number[];
  wheelLongForce: number[];
  heightOfCOGAboveGround: number;
  localVelocityX: number;
  localVelocityY: number;
  localVelocityZ: number;
  angularVelocityX: number;
  angularVelocityY: number;
  angularVelocityZ: number;
  angularAccelerationX: number;
  angularAccelerationY: number;
  angularAccelerationZ: number;
  frontWheelsAngle: number;
  wheelVertForce: number[]; // [RL, RR, FL, FR]
  frontAeroHeight: number;
  rearAeroHeight: number;
  frontRollAngle: number;
  rearRollAngle: number;
  chassisYaw: number;
}

export class MotionExParser {
  public static readonly PACKET_ID = 13;
  private static readonly HEADER_LENGTH = 29;

  /**
   * Faz parse de um buffer UDP como Motion Ex Data.
   * Retorna null se não for Packet ID 13.
   */
  public static parse(buf: Buffer): MotionExData | null {
    // verifica Packet ID
    if (buf.readUInt8(6) !== MotionExParser.PACKET_ID) {
      return null;
    }

    const b = MotionExParser.HEADER_LENGTH;
    let offset = b;

    // Helper para ler arrays de floats
    const readFloats = (count: number) => {
      const arr: number[] = [];
      for (let i = 0; i < count; i++) {
        arr.push(buf.readFloatLE(offset));
        offset += 4;
      }
      return arr;
    };

    const suspensionPosition = readFloats(4);
    const suspensionVelocity = readFloats(4);
    const suspensionAcceleration = readFloats(4);
    const wheelSpeed = readFloats(4);
    const wheelSlipRatio = readFloats(4);
    const wheelSlipAngle = readFloats(4);
    const wheelLatForce = readFloats(4);
    const wheelLongForce = readFloats(4);

    const heightOfCOGAboveGround = buf.readFloatLE(offset);
    offset += 4;
    const localVelocityX = buf.readFloatLE(offset);
    offset += 4;
    const localVelocityY = buf.readFloatLE(offset);
    offset += 4;
    const localVelocityZ = buf.readFloatLE(offset);
    offset += 4;

    const angularVelocityX = buf.readFloatLE(offset);
    offset += 4;
    const angularVelocityY = buf.readFloatLE(offset);
    offset += 4;
    const angularVelocityZ = buf.readFloatLE(offset);
    offset += 4;

    const angularAccelerationX = buf.readFloatLE(offset);
    offset += 4;
    const angularAccelerationY = buf.readFloatLE(offset);
    offset += 4;
    const angularAccelerationZ = buf.readFloatLE(offset);
    offset += 4;

    const frontWheelsAngle = buf.readFloatLE(offset);
    offset += 4;

    const wheelVertForce = readFloats(4);

    const frontAeroHeight = buf.readFloatLE(offset);
    offset += 4;
    const rearAeroHeight = buf.readFloatLE(offset);
    offset += 4;
    const frontRollAngle = buf.readFloatLE(offset);
    offset += 4;
    const rearRollAngle = buf.readFloatLE(offset);
    offset += 4;

    const chassisYaw = buf.readFloatLE(offset);

    return {
      suspensionPosition,
      suspensionVelocity,
      suspensionAcceleration,
      wheelSpeed,
      wheelSlipRatio,
      wheelSlipAngle,
      wheelLatForce,
      wheelLongForce,
      heightOfCOGAboveGround,
      localVelocityX,
      localVelocityY,
      localVelocityZ,
      angularVelocityX,
      angularVelocityY,
      angularVelocityZ,
      angularAccelerationX,
      angularAccelerationY,
      angularAccelerationZ,
      frontWheelsAngle,
      wheelVertForce,
      frontAeroHeight,
      rearAeroHeight,
      frontRollAngle,
      rearRollAngle,
      chassisYaw,
    };
  }
}
