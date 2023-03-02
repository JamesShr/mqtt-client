import mqtt, { MqttClient } from 'mqtt';
import { Injectable, Logger } from '@nestjs/common';
import { Observable, fromEvent } from 'rxjs';
import {
  ConnectionOptions,
  PublishPacket,
  MessageEvent,
  Event,
} from './dto/client.dto';

export interface ClientService {
  publish(packet: PublishPacket): Promise<void>;
  subscribe(topic: string): Promise<void>;
  unsubscribe(topic: string): Promise<void>;
  disconnect(): Promise<void>;
  connect(): Promise<void>;
  getClient(): MqttClient;

  createOnConnectObservable(): Observable<Event>;
  createOnOfflineObservable(): Observable<Event>;
  createOnCloseObservable(): Observable<Event>;
  createOnErrorObservable(): Observable<Event>;
  createOnMessageObservable(): Observable<MessageEvent>;
}

@Injectable()
export class ClientServiceImpl implements ClientService {
  private client: MqttClient;
  private connectOption: ConnectionOptions;
  constructor(options: Partial<ConnectionOptions>) {
    this.connectOption = Object.assign(
      {},
      {
        brokerUrl: 'mqtt://localhost:1883',
        initConnect: true,
        clientId: `client:${Date.now()}`,
      },
      options,
    );
    if (this.connectOption.initConnect) {
      this.connect();
    }
  }

  public async publish(packet: PublishPacket): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        this.client.publish(
          packet.topic,
          packet.payload,
          {
            ...(typeof packet.dup === 'undefined'
              ? { dup: false }
              : { dup: packet.dup }),
            ...(typeof packet.retain === 'undefined'
              ? { retain: false }
              : { retain: packet.retain }),
            ...(typeof packet.qos === 'undefined'
              ? { qos: 0 }
              : { qos: packet.qos }),
          },
          (err) => {
            if (err) return reject(err);
            return resolve();
          },
        );
      });
    } catch (error) {
      Logger.verbose(error);
    }
  }

  public async subscribe(topic: string): Promise<void> {
    this.client.subscribe(topic);
  }

  public async unsubscribe(topic: string): Promise<void> {
    this.client.unsubscribe(topic);
  }

  public async disconnect(): Promise<void> {
    this.client.end();
  }

  public async connect(): Promise<void> {
    this.client = mqtt.connect(
      this.connectOption.brokerUrl,
      this.connectOption,
    );
  }

  public getClient(): MqttClient {
    return this.client;
  }

  public createOnConnectObservable(): Observable<Event> {
    try {
      return fromEvent(this.client, 'connect', () => {
        return { clientId: this.connectOption.clientId, timestamp: Date.now() };
      });
    } catch (error) {
      console.log(error);
    }
  }

  public createOnOfflineObservable(): Observable<Event> {
    try {
      return fromEvent(this.client, 'offline', () => {
        return { clientId: this.connectOption.clientId, timestamp: Date.now() };
      });
    } catch (error) {
      console.log(error);
    }
  }

  public createOnCloseObservable(): Observable<Event> {
    try {
      return fromEvent(this.client, 'close', () => {
        return { clientId: this.connectOption.clientId, timestamp: Date.now() };
      });
    } catch (error) {
      console.log(error);
    }
  }

  public createOnErrorObservable(): Observable<Event> {
    try {
      return fromEvent(this.client, 'error', (error) => {
        return {
          clientId: this.connectOption.clientId,
          error: error.stack,
          timestamp: Date.now(),
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  public createOnMessageObservable(): Observable<MessageEvent> {
    try {
      return fromEvent(
        this.client,
        'message',
        (topic: string, payload: Buffer) => {
          return { topic, payload };
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
}
