import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UdpModule } from './core/udp.module';
import { F124Module } from './simulators/f1-24/f1-24.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UdpModule, F124Module],
})
export class AppModule {}
