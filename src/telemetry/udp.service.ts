import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dgram from 'dgram';
import chalk from 'chalk';

@Injectable()
export class UdpService implements OnModuleInit {
  private received = new Set<number>();

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const port = this.config.get<number>('UDP_PORT', 20777);
    const localIp = this.config.get<string>('LOCAL_IP', '0.0.0.0');
    const ps5Ip = this.config.get<string>('PS5_IP', '192.168.1.12');

    const socket = dgram.createSocket('udp4');

    socket.on('error', (err) => {
      console.error(chalk.red('UDP Error:'), err);
      socket.close();
    });

    socket.bind(port, localIp, () => {
      socket.setBroadcast(true);
      console.log(chalk.cyan(`📡 UDP bind em ${localIp}:${port}`));

      // handshake simples
      const handshake = Buffer.alloc(1);
      socket.send(handshake, 0, handshake.length, port, ps5Ip, (err) => {
        if (err) console.error(chalk.red('Handshake falhou:'), err);
        else
          console.log(
            chalk.green(`🤝 Handshake enviado para ${ps5Ip}:${port}`),
          );
      });
    });

    socket.on('message', (msg, rinfo) => {
      // log bruto para conferir
      console.log(
        chalk.magenta(
          `📥 Pacote bruto: ${msg.length} bytes de ${rinfo.address}:${rinfo.port}`,
        ),
      );

      // só do PS5
      if (rinfo.address !== ps5Ip) return;
      if (msg.length <= 6) return;

      // <-- CORREÇÃO AQUI
      const packetId = msg.readUInt8(6);

      if (!this.received.has(packetId)) {
        this.received.add(packetId);
        console.log(
          chalk.yellow(
            `📦 Novo Packet ID ${packetId} de ${rinfo.address}:${rinfo.port}`,
          ),
        );
        console.log(
          chalk.gray(
            `  IDs até agora: [${[...this.received].sort().join(', ')}]`,
          ),
        );
      }
    });
  }
}
