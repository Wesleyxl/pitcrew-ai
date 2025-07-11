// src/simulators/f1-24/adapter/f124.adapter.ts

import { SimulatorAdapter } from './simulator-adapter.interface';
import { ParsedTelemetry } from '../models/parsed-telemetry';
import { LapParser } from '../parsers/lap.parse';
import { EventParser } from '../parsers/event.parse';
// … outros parsers

export class F124Adapter implements SimulatorAdapter<ParsedTelemetry | null> {
  private readonly validIds = [
    LapParser.PACKET_ID,
    EventParser.PACKET_ID,
    // … demais packet IDs
  ];

  supports(buffer: Buffer): boolean {
    const pid = buffer.readUInt8(6);
    return this.validIds.includes(pid);
  }

  parse(buffer: Buffer): ParsedTelemetry | null {
    const pid = buffer.readUInt8(6);

    try {
      switch (pid) {
        case LapParser.PACKET_ID:
          return LapParser.parse(buffer);
        case EventParser.PACKET_ID:
          return EventParser.parse(buffer); // agora pode retornar null
        // … demais parsers:
        // case XParser.PACKET_ID: return XParser.parse(buffer);
        default:
          return null;
      }
    } catch (err) {
      console.warn(`F124Adapter: erro ao parse PID=${pid}`, err);
      return null;
    }
  }
}
