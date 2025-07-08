import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dgram from 'dgram';
import { Subject } from 'rxjs';

@Injectable()
export class UdpService implements OnModuleInit, OnModuleDestroy {
  private socket = dgram.createSocket('udp4');
  public readonly raw$ = new Subject<Buffer>();

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const port = this.config.get<number>('UDP_PORT', 20777);
    const host = this.config.get<string>('LOCAL_IP', '0.0.0.0');

    this.socket.bind(port, host, () => {
      this.socket.setBroadcast(true);
      console.log(`📡 UDP bind em ${host}:${port}`);
    });
    this.socket.on('message', (msg) => this.raw$.next(msg));
  }

  onModuleDestroy() {
    this.socket.close();
    this.raw$.complete();
  }
}
