import mqtt, { MqttClient } from 'mqtt';
import { Injectable } from '@nestjs/common';
import { Observable, fromEvent } from 'rxjs';
import { ConnectionOptions, PublishPacket } from './dto/client.dto';

export interface ClientService {}

@Injectable()
export class ClientServiceImpl implements ClientService {
  private client: MqttClient;
  private connectOption: ConnectionOptions;
  constructor(options: Partial<ConnectionOptions>) {
    this.connectOption = Object.assign(
      {},
      { brokerUrl: 'mqtt://localhost:1883' },
      options,
    );
    this.connect();
  }

  public async publish(packet: PublishPacket): Promise<void> {
    this.client.publish(packet.topic, packet.payload);
  }

  public async subscribe(topic: string): Promise<void> {
    this.client.subscribe(topic);
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

  public createOnConnectObservable(): Observable<{ timestamp: number }> {
    try {
      return fromEvent(this.client, 'connect', () => {
        return { timestamp: Date.now() };
      });
    } catch (error) {
      console.log(error);
    }
  }

  public createOnOfflineObservable(): Observable<{ timestamp: number }> {
    try {
      return fromEvent(this.client, 'offline', () => {
        return { timestamp: Date.now() };
      });
    } catch (error) {
      console.log(error);
    }
  }

  public createOnCloseObservable(): Observable<{ timestamp: number }> {
    try {
      return fromEvent(this.client, 'close', () => {
        return { timestamp: Date.now() };
      });
    } catch (error) {
      console.log(error);
    }
  }

  public createOnErrorObservable(): Observable<{ timestamp: number }> {
    try {
      return fromEvent(this.client, 'error', () => {
        return { timestamp: Date.now() };
      });
    } catch (error) {
      console.log(error);
    }
  }
}
