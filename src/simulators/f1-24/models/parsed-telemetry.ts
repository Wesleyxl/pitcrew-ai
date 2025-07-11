import { LapData } from '../parsers/lap.parse';
import { EventData } from '../parsers/event.parse';
// etc.

export type ParsedTelemetry = LapData | EventData;
// | … outros interfaces de parser
