import { IClientOptions } from 'mqtt';

export interface ConnectionOptions extends IClientOptions {
  brokerUrl: string;
}