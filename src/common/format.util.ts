/**
 * src/common/format.util.ts
 * Utilitários de formatação de dados, como conversão de tempos.
 */
export class FormatUtil {
  /**
   * Converte um tempo em milissegundos para formato de volta de F1: M:SS.mmm
   * @param ms Tempo em milissegundos
   * @returns String formatada, ex: "1:23.456"
   */
  public static lapTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const secondsTotal = ms % 60000;
    const seconds = Math.floor(secondsTotal / 1000);
    const milliseconds = secondsTotal % 1000;

    const secStr = seconds.toString().padStart(2, '0');
    const msStr = milliseconds.toString().padStart(3, '0');

    return `${minutes}:${secStr}.${msStr}`;
  }

  // Outros utilitários de formatação podem ser adicionados aqui
}
