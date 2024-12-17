import type { Client, Context } from '../';

export async function rtt(message: Context, parent: Client): Promise<void> {
  const { client } = parent;
  const rttReadings: number[] = [];

  async function calculateRTT(): Promise<number> {
    const start = Date.now();
    await message.reply({ content: 'Pinging...' });
    return Date.now() - start;
  }

  for (let i = 1; i <= 5; i++) {
    const rtt = await calculateRTT();
    rttReadings.push(rtt);
  }

  const averageRTT =
    rttReadings.reduce((sum, value) => sum + value, 0) / rttReadings.length;
  const stdDevRTT = Math.sqrt(
    rttReadings.reduce((sum, value) => sum + Math.pow(value - averageRTT, 2), 0) /
      rttReadings.length
  );

  const websocketLatency = client.ws.ping;

  const response = `**Calculating round-trip time...**\n\n` +
    rttReadings
      .map((value, index) => `Reading ${index + 1}: ${value.toFixed(2)}ms`)
      .join('\n') +
    `\n\nAverage: ${averageRTT.toFixed(2)} ± ${stdDevRTT.toFixed(2)}ms` +
    `\nWebSocket latency: ${websocketLatency.toFixed(2)}ms`;

  await message.reply({ content: response });
}
