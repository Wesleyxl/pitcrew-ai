/**
 * src/simulators/f1-24/parsers/motion.parse.ts
 * Parser for Motion Data packet (Packet ID = 0) in F1-24 telemetry
 */

/**
 * Physics and position data for a single car in world space
 */
export interface CarMotionData {
  /** World position in metres */
  worldPositionX: number;
  worldPositionY: number;
  worldPositionZ: number;
  /** Velocity in world space metres/s */
  worldVelocityX: number;
  worldVelocityY: number;
  worldVelocityZ: number;
  /** Forward direction as normalized vector component (raw int16) */
  worldForwardDirX: number;
  worldForwardDirY: number;
  worldForwardDirZ: number;
  /** Right direction as normalized vector component (raw int16) */
  worldRightDirX: number;
  worldRightDirY: number;
  worldRightDirZ: number;
  /** G-Force components (g) */
  gForceLateral: number;
  gForceLongitudinal: number;
  gForceVertical: number;
  /** Orientation angles (radians) */
  yaw: number;
  pitch: number;
  roll: number;
}

/**
 * PacketMotionData holds motion data for all cars on track
 */
export interface MotionData {
  carMotionData: CarMotionData[];
}

export class MotionParser {
  public static readonly PACKET_ID = 0;
  private static readonly HEADER_LENGTH = 29;
  private static readonly CAR_MOTION_DATA_SIZE = 60;
  private static readonly NUM_CARS = 22;
  private static readonly PAYLOAD_LENGTH =
    MotionParser.CAR_MOTION_DATA_SIZE * MotionParser.NUM_CARS;

  /**
   * Parses a UDP buffer as Motion Data.
   * Returns null if not Packet ID 0 or buffer too short.
   */
  public static parse(buffer: Buffer): MotionData | null {
    // Verify Packet ID
    if (buffer.readUInt8(6) !== MotionParser.PACKET_ID) {
      return null;
    }
    // Check minimum length: header + payload
    const minLen = MotionParser.HEADER_LENGTH + MotionParser.PAYLOAD_LENGTH;
    if (buffer.length < minLen) {
      console.warn(`MotionParser: buffer too short (${buffer.length} bytes)`);
      return null;
    }
    const baseOffset = MotionParser.HEADER_LENGTH;
    const data: CarMotionData[] = [];

    for (let i = 0; i < MotionParser.NUM_CARS; i++) {
      const b = baseOffset + i * MotionParser.CAR_MOTION_DATA_SIZE;
      const worldPositionX = buffer.readFloatLE(b + 0);
      const worldPositionY = buffer.readFloatLE(b + 4);
      const worldPositionZ = buffer.readFloatLE(b + 8);
      const worldVelocityX = buffer.readFloatLE(b + 12);
      const worldVelocityY = buffer.readFloatLE(b + 16);
      const worldVelocityZ = buffer.readFloatLE(b + 20);
      const worldForwardDirX = buffer.readInt16LE(b + 24);
      const worldForwardDirY = buffer.readInt16LE(b + 26);
      const worldForwardDirZ = buffer.readInt16LE(b + 28);
      const worldRightDirX = buffer.readInt16LE(b + 30);
      const worldRightDirY = buffer.readInt16LE(b + 32);
      const worldRightDirZ = buffer.readInt16LE(b + 34);
      const gForceLateral = buffer.readFloatLE(b + 36);
      const gForceLongitudinal = buffer.readFloatLE(b + 40);
      const gForceVertical = buffer.readFloatLE(b + 44);
      const yaw = buffer.readFloatLE(b + 48);
      const pitch = buffer.readFloatLE(b + 52);
      const roll = buffer.readFloatLE(b + 56);

      data.push({
        worldPositionX,
        worldPositionY,
        worldPositionZ,
        worldVelocityX,
        worldVelocityY,
        worldVelocityZ,
        worldForwardDirX,
        worldForwardDirY,
        worldForwardDirZ,
        worldRightDirX,
        worldRightDirY,
        worldRightDirZ,
        gForceLateral,
        gForceLongitudinal,
        gForceVertical,
        yaw,
        pitch,
        roll,
      });
    }

    return { carMotionData: data };
  }
}
