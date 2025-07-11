/**
 * Contrato genérico de “adapter” para telemetria de simulador.
 * suporta() filtra buffers UDP válidos;
 * parse() converte Buffer → dados tipados.
 */
export interface SimulatorAdapter<T> {
  supports(buffer: Buffer): boolean;
  parse(buffer: Buffer): T;
}
