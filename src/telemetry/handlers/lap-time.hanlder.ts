import chalk from 'chalk';

interface Packet {
  m_header: {
    playerCarIndex: number;
  };
  m_lapData: {
    [index: number]: {
      m_lastLapTimeInMS: number;
      m_currentLapTimeInMS: number;
    };
  };
}
export class LapTimeHandler {
  static processLapData(packet: Packet) {
    try {
      console.log(packet);

      const carIndex = packet.m_header.playerCarIndex;
      const lapData = packet.m_lapData[carIndex];
      const lastLapTimeSec = lapData.m_lastLapTimeInMS / 1000;
      const currentLapTimeSec = lapData.m_currentLapTimeInMS / 1000;

      console.log(chalk.blue(`Última volta: ${lastLapTimeSec.toFixed(3)}s`));
      console.log(chalk.green(`Volta atual: ${currentLapTimeSec.toFixed(3)}s`));
    } catch (error) {
      console.log(
        chalk.red('❌ Erro ao processar pacote de volta:'),
        (error as Error).message,
      );
    }
  }
}
