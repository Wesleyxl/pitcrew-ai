// src/simulators/f1-24/gateways/telemetry.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'telemetry/f1',
  cors: { origin: '*' }, // libera CORS para todo front
})
export class TelemetryGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`📡 Cliente conectado ao telemetry/f1: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`📴 Cliente desconectado do telemetry/f1: ${client.id}`);
  }
}
