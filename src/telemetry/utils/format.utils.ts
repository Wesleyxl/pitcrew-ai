export class FormatUtil {
  /**
   * Format a time in milliseconds as MM:SS.SSS
   * @param {number} ms - Time in milliseconds
   * @returns {string} Formatted time string  ex: "00:00.000"
   */
  static lapTime(ms: number): string {
    const s = ms / 1000;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, '0');
    const msPart = Math.floor((s % 1) * 1000)
      .toString()
      .padStart(3, '0');
    return `${m}:${sec}.${msPart}`;
  }

  /**
   * Calculate difference between two times in milliseconds
   * @param {number} t1 - First time in milliseconds
   * @param {number} t2 - Second time in milliseconds
   * @returns {number} Difference in milliseconds
   */
  static timeDiff(t1: number, t2: number): number {
    return t2 - t1;
  }
}
