// src/simulators/f1-24/gateways/telemetry.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'telemetry/f1' })
export class TelemetryGateway {
  @WebSocketServer() server: Server;
}
