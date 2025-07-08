/**
 * Todos os campos extraídos do Pacote Lap Data (Packet ID = 2)
 */
export interface LapData {
  /** Última volta em milissegundos */
  lastLapTimeMs: number;
  /** Tempo na volta atual em milissegundos */
  currentLapTimeMs: number;
  /** Setor 1 — parte em milissegundos */
  sector1TimeMsPart: number;
  /** Setor 1 — parte em minutos */
  sector1TimeMinutesPart: number;
  /** Setor 2 — parte em milissegundos */
  sector2TimeMsPart: number;
  /** Setor 2 — parte em minutos */
  sector2TimeMinutesPart: number;
  /** Delta para carro à frente — parte em milissegundos */
  deltaToCarInFrontMsPart: number;
  /** Delta para carro à frente — parte em minutos */
  deltaToCarInFrontMinutesPart: number;
  /** Delta para líder de corrida — parte em milissegundos */
  deltaToRaceLeaderMsPart: number;
  /** Delta para líder de corrida — parte em minutos */
  deltaToRaceLeaderMinutesPart: number;
  /** Distância na volta atual (m) */
  lapDistance: number;
  /** Distância total na sessão (m) */
  totalDistance: number;
  /** Delta em relação ao safety car (s) */
  safetyCarDelta: number;
  /** Posição de corrida (1 = primeiro) */
  carPosition: number;
  /** Número da volta atual */
  currentLapNum: number;
  /** 0 = não em pit, 1 = entrando, 2 = na área de pit */
  pitStatus: number;
  /** Quantidade de pit-stops já feitos */
  numPitStops: number;
  /** Setor atual (0, 1 ou 2) */
  sector: number;
  /** 0 = volta válida, 1 = volta inválida */
  currentLapInvalid: number;
  /** Segundos de penalidade acumulados */
  penalties: number;
  /** Número de warnings recebidos */
  totalWarnings: number;
  /** Warnings por cortar chicane */
  cornerCuttingWarnings: number;
  /** Drive-throughs a cumprir */
  numUnservedDriveThroughPens: number;
  /** Stop-go a cumprir */
  numUnservedStopGoPens: number;
  /** Posição de largada */
  gridPosition: number;
  /** Status do piloto (0=garage,1=flying,2=in lap,3=out lap,4=on track) */
  driverStatus: number;
  /** Resultado (0=invalid,1=inactive,2=active,3=finished,4=DNF,5=disqualified,6=not classified,7=retired) */
  resultStatus: number;
  /** 0 = pit-lane timer off, 1 = on */
  pitLaneTimerActive: number;
  /** Tempo no pit-lane em ms */
  pitLaneTimeInLaneInMs: number;
  /** Duração do pit-stop em ms */
  pitStopTimerInMs: number;
  /** 1 = deve cumprir penalidade no pit-stop */
  pitStopShouldServePen: number;
  /** Velocidade máxima no speed trap (km/h) */
  speedTrapFastestSpeed: number;
  /** Volta em que se obteve essa velocidade (255 = n/a) */
  speedTrapFastestLap: number;
}

export class LapParser {
  /** Packet ID oficial para Lap Data */
  public static readonly PACKET_ID = 2;
  /** Tamanho do cabeçalho PacketHeader em bytes */
  private static readonly HEADER_LENGTH = 29;
  /** Tamanho mínimo do payload de LapData em bytes */
  private static readonly PAYLOAD_LENGTH = 38;

  /**
   * Tenta fazer parse de um buffer UDP como Lap Data.
   * Retorna null se não for Packet ID 2.
   */
  public static parse(buffer: Buffer): LapData | null {
    // 1) Verifica Packet ID se é Lap Data
    if (buffer.readUInt8(6) !== LapParser.PACKET_ID) return null;

    // 2) Valida tamanho mínimo: HEADER + payload
    const minLen = LapParser.HEADER_LENGTH + LapParser.PAYLOAD_LENGTH;
    if (buffer.length < minLen) {
      throw new Error(
        `Buffer muito curto para LapData: ${buffer.length} bytes`,
      );
    }

    const b = LapParser.HEADER_LENGTH;

    // 3) Extrai cada campo conforme offsets da spec
    const lastLapTimeMs = buffer.readUInt32LE(b + 0); // 29..32
    const currentLapTimeMs = buffer.readUInt32LE(b + 4); // 33..36
    const sector1TimeMsPart = buffer.readUInt16LE(b + 8); // 37..38
    const sector1TimeMinutesPart = buffer.readUInt8(b + 10); // 39
    const sector2TimeMsPart = buffer.readUInt16LE(b + 11); // 40..41
    const sector2TimeMinutesPart = buffer.readUInt8(b + 13); // 42
    const deltaToCarInFrontMsPart = buffer.readUInt16LE(b + 14); // 43..44
    const deltaToCarInFrontMinutesPart = buffer.readUInt8(b + 16); // 45
    const deltaToRaceLeaderMsPart = buffer.readUInt16LE(b + 17); // 46..47
    const deltaToRaceLeaderMinutesPart = buffer.readUInt8(b + 19); // 48
    const lapDistance = buffer.readFloatLE(b + 20); // 49..52
    const totalDistance = buffer.readFloatLE(b + 24); // 53..56
    const safetyCarDelta = buffer.readFloatLE(b + 28); // 57..60
    const carPosition = buffer.readUInt8(b + 32); // 61
    const currentLapNum = buffer.readUInt8(b + 33); // 62
    const pitStatus = buffer.readUInt8(b + 34); // 63
    const numPitStops = buffer.readUInt8(b + 35); // 64
    const sector = buffer.readUInt8(b + 36); // 65
    const currentLapInvalid = buffer.readUInt8(b + 37); // 66
    const penalties = buffer.readUInt8(b + 38); // 67
    const totalWarnings = buffer.readUInt8(b + 39); // 68
    const cornerCuttingWarnings = buffer.readUInt8(b + 40); // 69
    const numUnservedDriveThroughPens = buffer.readUInt8(b + 41); // 70
    const numUnservedStopGoPens = buffer.readUInt8(b + 42); // 71
    const gridPosition = buffer.readUInt8(b + 43); // 72
    const driverStatus = buffer.readUInt8(b + 44); // 73
    const resultStatus = buffer.readUInt8(b + 45); // 74
    const pitLaneTimerActive = buffer.readUInt8(b + 46); // 75
    const pitLaneTimeInLaneInMs = buffer.readUInt16LE(b + 47); // 76..77
    const pitStopTimerInMs = buffer.readUInt16LE(b + 49); // 78..79
    const pitStopShouldServePen = buffer.readUInt8(b + 51); // 80
    const speedTrapFastestSpeed = buffer.readFloatLE(b + 52); // 81..84
    const speedTrapFastestLap = buffer.readUInt8(b + 56); // 85

    return {
      lastLapTimeMs,
      currentLapTimeMs,
      sector1TimeMsPart,
      sector1TimeMinutesPart,
      sector2TimeMsPart,
      sector2TimeMinutesPart,
      deltaToCarInFrontMsPart,
      deltaToCarInFrontMinutesPart,
      deltaToRaceLeaderMsPart,
      deltaToRaceLeaderMinutesPart,
      lapDistance,
      totalDistance,
      safetyCarDelta,
      carPosition,
      currentLapNum,
      pitStatus,
      numPitStops,
      sector,
      currentLapInvalid,
      penalties,
      totalWarnings,
      cornerCuttingWarnings,
      numUnservedDriveThroughPens,
      numUnservedStopGoPens,
      gridPosition,
      driverStatus,
      resultStatus,
      pitLaneTimerActive,
      pitLaneTimeInLaneInMs,
      pitStopTimerInMs,
      pitStopShouldServePen,
      speedTrapFastestSpeed,
      speedTrapFastestLap,
    };
  }
}
