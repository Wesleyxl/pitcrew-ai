// src/simulators/f1-24/gateways/alerts.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'alerts/f1' })
export class AlertsGateway {
  @WebSocketServer() server: Server;
}
