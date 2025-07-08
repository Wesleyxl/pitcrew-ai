import { Injectable } from '@nestjs/common';
// aqui você pode injetar o tts.util, webhook, push, etc.
@Injectable()
export class AlertService {
  notify(msg: string) {
    console.log(`🔔 ALERTA: ${msg}`);
    // speak(msg); ou enviar pro front, etc.
  }
}
