import { PubSub } from "@google-cloud/pubsub/build/src";
import { PubSubService } from "./types";
import { NODE_ENV } from "../../utils/constants";

export interface GCPubSubPayload {
  subscription: string;
  message: {
    data: Buffer | string;
    attributes: string[];
    messageId: string;
  };
}

export function isPubSubPayload(
  body: Record<string, any>
): body is GCPubSubPayload {
  return Boolean(
    body?.subscription && body?.message && typeof body?.message?.data
  );
}

export class GooglePubSubService implements PubSubService {
  private client: PubSub;

  constructor(private projectId: string) {
    this.client = new PubSub({ projectId: this.projectId });
  }
  async publish(
    topicId: string,
    payload: Record<string, unknown>
  ): Promise<string> {
    const topicName = `projects/${this.projectId}/topics/${topicId}-${NODE_ENV}`;
    const exists = await this.checkTopicExists(topicName);

    if (!exists) {
      throw new Error(`Topic ${topicName} does not exist`);
    }

    const topic = this.client.topic(topicName);
    return topic.publishMessage({
      data: GooglePubSubService.preparePublishPayload(payload),
    });
  }

  //helper
  static preparePublishPayload(payload: Record<string, unknown>): Buffer {
    const jsonPayload = JSON.stringify(payload);
    return Buffer.from(jsonPayload);
  }

  //helper
  async checkTopicExists(topicName: string) {
    const [topicList] = await this.client.getTopics();
    return !!topicList.find((it) => it.name === topicName);
  }

  //helper
  validatePayload(payload: Record<string, unknown>): boolean {
    return isPubSubPayload(payload);
  }
}
