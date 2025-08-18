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
    try {
      console.log("Pub/Sub service initialized for project:", projectId);
      this.client = new PubSub({
        projectId: this.projectId,
      });
    } catch (error) {
      console.error("Error initializing Pub/Sub client:", error);
      throw error;
    }
  }

  async publish(
    topicId: string,
    payload: Record<string, unknown>
  ): Promise<string> {
    try {
      const topicName = `projects/${this.projectId}/topics/${topicId}-${NODE_ENV}`;
      console.log("Publishing to topic:", topicName);

      // get the topic (or create it if it doesn't exist)
      const topic = this.client.topic(topicName);

      // publish the message
      const result = await topic.publishMessage({
        data: GooglePubSubService.preparePublishPayload(payload),
      });

      console.log(
        "Message published successfully to GCP Pub/Sub, message ID:",
        result
      );
      return result;
    } catch (error) {
      console.error("Error in publish:", error);
      throw error;
    }
  }

  static preparePublishPayload(payload: Record<string, unknown>): Buffer {
    const jsonPayload = JSON.stringify(payload);
    return Buffer.from(jsonPayload);
  }

  validatePayload(payload: Record<string, unknown>): boolean {
    return isPubSubPayload(payload);
  }
}
