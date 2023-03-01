import { IClientOptions } from 'mqtt';

export interface ConnectionOptions extends IClientOptions {
  brokerUrl: string;
}

export type  PublishPacket = {
  topic: string;
  payload: string | Buffer;
  qos?: 0 | 1 | 2;
  retain?: boolean;
  dup?: boolean;
};
