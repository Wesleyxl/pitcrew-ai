import { LapData } from '../parsers/lap.parse';
// importe aqui os demais tipos de parser que você tiver:
// import { CarStatusData } from '../parsers/car-status.parse';
// import { TelemetryData } from '../parsers/telemetry.parse';
// etc.

export type ParsedTelemetry = LapData;
// | CarStatusData
// | TelemetryData
// | … outros interfaces de parser
