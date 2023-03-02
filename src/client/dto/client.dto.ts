import { IClientOptions } from 'mqtt';

export interface ConnectionOptions extends IClientOptions {
  initConnect: boolean;
  brokerUrl: string;
}

export type PublishPacket = {
  topic: string;
  payload: string | Buffer;
  qos?: 0 | 1 | 2;
  retain?: boolean;
  dup?: boolean;
};

export type MessageEvent = {
  topic: string;
  payload: Buffer;
};

export type Event = {
  clientId: string;
  timestamp: number;
  error?: any;
};
