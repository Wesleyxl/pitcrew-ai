// src/telemetry/lobby/lobby-info.parser.ts

/**
 * Data de um único participante no lobby (Packet ID = 9)
 */
export interface LobbyInfoData {
  /** 1 = AI controlled, 0 = human */
  aiControlled: boolean;
  /** ID do time (appendix) */
  teamId: number;
  /** Nacionalidade do jogador (appendix) */
  nationality: number;
  /** Plataforma: 1=Steam,3=PlayStation,4=Xbox,6=Origin,255=unknown */
  platform: number;
  /** Nome do jogador (UTF-8, até 48 bytes, null-terminated) */
  name: string;
  /** Número do carro */
  carNumber: number;
  /** Telemetry setting: 0=restricted,1=public */
  yourTelemetry: number;
  /** Show online names setting: 0=off,1=on */
  showOnlineNames: number;
  /** Tech level (F1 World) */
  techLevel: number;
  /** Ready status: 0=not ready,1=ready,2=spectating */
  readyStatus: number;
}

/**
 * Pacote completo de lobby multiplayer
 */
export interface LobbyInfoPacket {
  /** Quantidade de jogadores no lobby */
  numPlayers: number;
  /** Dados de cada participante ativo */
  players: LobbyInfoData[];
}

export class LobbyInfoParser {
  public static readonly PACKET_ID = 9;
  private static readonly HEADER_LENGTH = 29; // tamanho do PacketHeader
  private static readonly ENTRY_LENGTH = 58; // tamanho de cada LobbyPlayer
  private static readonly MAX_PLAYERS = 22;

  /**
   * Faz parse de um buffer UDP e retorna os dados de lobby.
   * Retorna null se não for Packet ID = 9.
   */
  public static parse(buffer: Buffer): LobbyInfoPacket | null {
    // 1) verifica packetId
    if (buffer.readUInt8(6) !== LobbyInfoParser.PACKET_ID) {
      return null;
    }

    // 2) lê número de jogadores
    const numPlayers = buffer.readUInt8(LobbyInfoParser.HEADER_LENGTH);
    if (numPlayers > LobbyInfoParser.MAX_PLAYERS) {
      throw new Error(`numPlayers inválido: ${numPlayers}`);
    }

    // 3) valida tamanho mínimo
    const expectedLen =
      LobbyInfoParser.HEADER_LENGTH +
      1 +
      numPlayers * LobbyInfoParser.ENTRY_LENGTH;
    if (buffer.length < expectedLen) {
      throw new Error(
        `Buffer muito curto para LobbyInfo: ${buffer.length} bytes, esperado pelo menos ${expectedLen}`,
      );
    }

    const players: LobbyInfoData[] = [];
    let offset = LobbyInfoParser.HEADER_LENGTH + 1;

    for (let i = 0; i < numPlayers; i++) {
      const aiControlled = buffer.readUInt8(offset + 0) === 1;
      const teamId = buffer.readUInt8(offset + 1);
      const nationality = buffer.readUInt8(offset + 2);
      const platform = buffer.readUInt8(offset + 3);

      // nome UTF-8 de até 48 bytes, null-terminated
      const nameBuf = buffer.slice(offset + 4, offset + 52);
      const name = nameBuf.toString('utf8').replace(/\0.*$/, '');

      const carNumber = buffer.readUInt8(offset + 52);
      const yourTelemetry = buffer.readUInt8(offset + 53);
      const showOnlineNames = buffer.readUInt8(offset + 54);
      const techLevel = buffer.readUInt16LE(offset + 55);
      const readyStatus = buffer.readUInt8(offset + 57);

      players.push({
        aiControlled,
        teamId,
        nationality,
        platform,
        name,
        carNumber,
        yourTelemetry,
        showOnlineNames,
        techLevel,
        readyStatus,
      });

      offset += LobbyInfoParser.ENTRY_LENGTH;
    }

    return { numPlayers, players };
  }
}
