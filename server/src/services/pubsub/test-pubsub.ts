import { PubSubService } from "./types";

export class TestPubSub implements PubSubService {
  async publish(
    topicId: string,
    payload: Record<string, unknown>
  ): Promise<string> {
    console.log(payload);
    return Promise.resolve(`Message published to topic ${topicId}`);
  }

  validatePayload(payload: Record<string, unknown>): boolean {
    return !!payload;
  }
}
