import say from 'say';

export function speak(message: string) {
  say.speak(message);
  console.log(`🔊 Voz: ${message}`);
}
