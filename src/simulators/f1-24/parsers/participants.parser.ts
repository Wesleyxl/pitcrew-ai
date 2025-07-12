// src/telemetry/participants/participant.parser.ts

/**
 * Dados de um único participante (carro/piloto) na sessão.
 */
export interface ParticipantData {
  /** 1 = AI, 0 = humano */
  aiControlled: number;
  /** Driver ID (veja apêndice de Driver IDs) */
  driverId: number;
  /** ID de rede (em multiplayer) */
  networkId: number;
  /** Team ID (veja apêndice de Team IDs) */
  teamId: number;
  /** 1 = é seu time, 0 = outro time */
  myTeam: number;
  /** Número no carro */
  raceNumber: number;
  /** Nacionalidade (veja apêndice de Nationality IDs) */
  nationality: number;
  /** Nome do piloto ou gamertag (UTF-8, sem terminação NULL) */
  name: string;
  /** 0 = telemetry restrita, 1 = pública */
  yourTelemetry: number;
  /** 0 = não mostra online names, 1 = mostra */
  showOnlineNames: number;
  /** Tech level em F1 World */
  techLevel: number;
  /** Plataforma (1=Steam,3=PlayStation,4=Xbox,6=Origin,255=unknown) */
  platform: number;
}

/**
 * Conjunto de dados do pacote Participants (Packet ID = 4)
 */
export interface ParticipantsData {
  /** Número de carros ativos na sessão */
  numActiveCars: number;
  /** Array de participantes (até 22) */
  participants: ParticipantData[];
}

export class ParticipantParser {
  /** Packet ID oficial para Participants Data */
  public static readonly PACKET_ID = 4;
  /** Tamanho do cabeçalho PacketHeader em bytes */
  private static readonly HEADER_LENGTH = 29;
  /** Tamanho em bytes de cada ParticipantData */
  private static readonly ENTRY_SIZE = 60;

  /**
   * Faz o parse do buffer bruto UDP e retorna ParticipantsData
   * @param buffer Buffer recebido pelo socket
   * @returns ParticipantsData ou null se não for Packet ID 4
   */
  public static parse(buffer: Buffer): ParticipantsData | null {
    // 1) verifica Packet ID
    if (buffer.readUInt8(6) !== ParticipantParser.PACKET_ID) {
      return null;
    }

    // 2) leitura do número de carros ativos
    const numActiveCars = buffer.readUInt8(ParticipantParser.HEADER_LENGTH);
    const participants: ParticipantData[] = [];

    // 3) offset inicial logo após numActiveCars
    const base = ParticipantParser.HEADER_LENGTH + 1;

    for (let i = 0; i < numActiveCars; i++) {
      const offset = base + i * ParticipantParser.ENTRY_SIZE;

      const aiControlled = buffer.readUInt8(offset + 0);
      const driverId = buffer.readUInt8(offset + 1);
      const networkId = buffer.readUInt8(offset + 2);
      const teamId = buffer.readUInt8(offset + 3);
      const myTeam = buffer.readUInt8(offset + 4);
      const raceNumber = buffer.readUInt8(offset + 5);
      const nationality = buffer.readUInt8(offset + 6);
      // lê 48 bytes de nome e remove tudo após o '\0'
      const rawName = buffer.toString('utf8', offset + 7, offset + 7 + 48);
      const name = rawName.replace(/\0.*$/g, '');
      const yourTelemetry = buffer.readUInt8(offset + 55);
      const showOnlineNames = buffer.readUInt8(offset + 56);
      const techLevel = buffer.readUInt16LE(offset + 57);
      const platform = buffer.readUInt8(offset + 59);

      participants.push({
        aiControlled,
        driverId,
        networkId,
        teamId,
        myTeam,
        raceNumber,
        nationality,
        name,
        yourTelemetry,
        showOnlineNames,
        techLevel,
        platform,
      });
    }

    return { numActiveCars, participants };
  }
}
