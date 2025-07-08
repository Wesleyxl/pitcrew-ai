/**
 * Dados extraídos do Pacote Session Data (Packet ID = 1)
 * Estado da sessão: clima, tempo restante, setores, zonas de marshal, safety car, etc.
 */
export interface SessionData {
  /** Clima atual (0=clear,1=light cloud,2=overcast,3=light rain,4=heavy rain,5=storm) */
  weather: number;
  /** Temperatura da pista (°C) */
  trackTemperature: number;
  /** Temperatura do ar (°C) */
  airTemperature: number;
  /** Total de voltas da corrida */
  totalLaps: number;
  /** Comprimento do circuito (m) */
  trackLength: number;
  /** Tipo de sessão (0=unknown,1=P1,2=P2...15=Race, etc) */
  sessionType: number;
  /** ID da pista (conforme Appendix) */
  trackId: number;
  /** Fórmula (0=F1 Modern,1=F1 Classic,2=F2, etc) */
  formula: number;
  /** Tempo restante na sessão (s) */
  sessionTimeLeft: number;
  /** Duração total da sessão (s) */
  sessionDuration: number;
  /** Limite de velocidade no pit lane (km/h) */
  pitSpeedLimit: number;
  /** Estado do safety car (0=none,1=full,2=virtual,3=formation lap) */
  safetyCarStatus: number;
  /** Se a sessão é online (0=offline,1=online) */
  networkGame: number;
  /** Número de zonas de marshal ativas */
  numMarshalZones: number;
  /** Zonas de marshal: início (fractional lap) e flag (0=none,1=green,2=blue,3=yellow) */
  marshalZones: Array<{
    zoneStart: number;
    zoneFlag: number;
  }>;
  /** Precisão da previsão de tempo (0=perfect,1=approximate) */
  forecastAccuracy: number;
  /** Dificuldade do AI (0–110) */
  aiDifficulty: number;
  /** Ideal lap para o pit‐stop do jogador */
  pitStopWindowIdealLap: number;
  /** Última lap para o pit‐stop do jogador */
  pitStopWindowLatestLap: number;
  /** Pos. prevista ao retornar do pit (jogador) */
  pitStopRejoinPosition: number;
}

export class SessionParser {
  public static readonly PACKET_ID = 1;
  private static readonly HEADER_LENGTH = 29;
  private static readonly MAX_MARSHAL_ZONES = 21;

  public static parse(buffer: Buffer): SessionData | null {
    // 1) só trata pacotes ID = 1
    if (buffer.readUInt8(6) !== SessionParser.PACKET_ID) {
      return null;
    }
    // 2) valida comprimento mínimo (header + campos até numMarshalZones)
    const minLen =
      SessionParser.HEADER_LENGTH +
      /* até m_numMarshalZones */ 19 +
      SessionParser.MAX_MARSHAL_ZONES * /* cada zone */ 5 +
      /* safetyCar + networkGame */ 2 +
      /* forecastAccuracy + aiDifficulty */ 2 +
      /* pit stop windows */ 3;
    if (buffer.length < minLen) {
      throw new Error(
        `Buffer muito curto para SessionData: ${buffer.length} bytes`,
      );
    }

    const b = SessionParser.HEADER_LENGTH;
    // offset relativo:
    const weather = buffer.readUInt8(b + 0);
    const trackTemperature = buffer.readInt8(b + 1);
    const airTemperature = buffer.readInt8(b + 2);
    const totalLaps = buffer.readUInt8(b + 3);
    const trackLength = buffer.readUInt16LE(b + 4);
    const sessionType = buffer.readUInt8(b + 6);
    const trackId = buffer.readInt8(b + 7);
    const formula = buffer.readUInt8(b + 8);
    const sessionTimeLeft = buffer.readUInt16LE(b + 9);
    const sessionDuration = buffer.readUInt16LE(b + 11);
    const pitSpeedLimit = buffer.readUInt8(b + 13);
    // saltamos 1 byte pause flag
    const safetyCarStatus = buffer.readUInt8(b + 15);
    const networkGame = buffer.readUInt8(b + 16);

    // Num de zonas de marshal
    const numMarshalZones = buffer.readUInt8(b + 17);
    const marshalZones: Array<{ zoneStart: number; zoneFlag: number }> = [];
    let offset = b + 18;
    for (
      let i = 0;
      i < Math.min(numMarshalZones, SessionParser.MAX_MARSHAL_ZONES);
      i++
    ) {
      const zoneStart = buffer.readFloatLE(offset);
      const zoneFlag = buffer.readInt8(offset + 4);
      marshalZones.push({ zoneStart, zoneFlag });
      offset += 5;
    }

    // após as marshal zones
    const forecastAccuracy = buffer.readUInt8(offset);
    const aiDifficulty = buffer.readUInt8(offset + 1);
    const pitStopWindowIdealLap = buffer.readUInt8(offset + 2);
    const pitStopWindowLatestLap = buffer.readUInt8(offset + 3);
    const pitStopRejoinPosition = buffer.readUInt8(offset + 4);

    return {
      weather,
      trackTemperature,
      airTemperature,
      totalLaps,
      trackLength,
      sessionType,
      trackId,
      formula,
      sessionTimeLeft,
      sessionDuration,
      pitSpeedLimit,
      safetyCarStatus,
      networkGame,
      numMarshalZones,
      marshalZones,
      forecastAccuracy,
      aiDifficulty,
      pitStopWindowIdealLap,
      pitStopWindowLatestLap,
      pitStopRejoinPosition,
    };
  }
}
