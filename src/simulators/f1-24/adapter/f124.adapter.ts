import { SimulatorAdapter } from './simulator-adapter.interface';
import { LapParser } from '../parsers/lap.parse';
import { ParsedTelemetry } from '../models/parsed-telemetry';

export class F124Adapter implements SimulatorAdapter<ParsedTelemetry> {
  private readonly validIds = [
    LapParser.PACKET_ID,

    // …outros packet IDs (3..14)
  ];

  supports(buffer: Buffer): boolean {
    const pid = buffer.readUInt8(6);
    return this.validIds.includes(pid);
  }

  parse(buffer: Buffer): ParsedTelemetry {
    const pid = buffer.readUInt8(6);
    switch (pid) {
      case LapParser.PACKET_ID: {
        const lapData = LapParser.parse(buffer);
        if (lapData === null) {
          throw new Error('Failed to parse LapData');
        }
        return lapData;
      }
      // …demais parsers
      default:
        throw new Error(`F124Adapter: packetId ${pid} não suportado`);
    }
  }
}
