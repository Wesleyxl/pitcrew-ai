import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UdpService } from './udp.service';

@Module({
  imports: [ConfigModule],
  providers: [UdpService],
  exports: [UdpService],
})
export class UdpModule {}
