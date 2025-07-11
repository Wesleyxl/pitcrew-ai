/**
 * src/simulators/f1-24/services/alert.service.ts
 * Serviço para emitir alertas no namespace de Alerts do F1-24
 */
import { Injectable } from '@nestjs/common';
import { AlertsGateway } from '../gateways/alerts.gateway';

@Injectable()
export class AlertService {
  constructor(private readonly alertsGateway: AlertsGateway) {}

  /**
   * Emite um alerta simples para o front-end
   * @param message Mensagem a ser enviada
   */
  notify(message: string): void {
    const payload = { message, timestamp: Date.now() };
    // Emite no canal 'alert' do namespace /alerts/f1
    this.alertsGateway.server.emit('alert', payload);
    console.log(`🔔 Alert emitted: ${message}`);
  }

  /**
   * Emite um alerta tipado, permitindo categorizar
   * @param type Tipo do alerta (ex: 'lap', 'overheat', etc.)
   * @param data Payload customizado do alerta
   */
  notifyTyped(type: string, data: { [key: string]: any }): void {
    const payload = { type, data, timestamp: Date.now() };
    this.alertsGateway.server.emit(type, payload);
    console.log(`🔔 Alert [${type}] emitted:`, data);
  }
}
