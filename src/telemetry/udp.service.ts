import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dgram from 'dgram';
import chalk from 'chalk';

@Injectable()
export class UdpService implements OnModuleInit {
  private receivedPacketIds: Set<number> = new Set();

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const port = this.configService.get<number>('UDP_PORT', 20777);
    const udpSocket = dgram.createSocket('udp4');

    udpSocket.on('message', (msg, rinfo) => {
      const packetId = msg.readUInt8(21);
      console.log(packetId);
    });

    udpSocket.bind(port, () => {
      console.log(
        chalk.cyan(
          `📡 Listener UDP ativo na porta ${port} (monitorando IDs de pacotes)...`,
        ),
      );
    });
  }
}
