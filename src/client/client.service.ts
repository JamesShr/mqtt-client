import mqtt, { MqttClient } from 'mqtt';
import {
  Injectable,
} from '@nestjs/common';
import { Observable, fromEvent } from 'rxjs';
import { ConnectionOptions } from './dto/client.dto';

export interface ClientService {

}

@Injectable()
export class ClientServiceImpl implements ClientService {
  private client: MqttClient;
  private connectOption: ConnectionOptions;
  constructor(
    options: Partial<ConnectionOptions>,
  ) {
    this.connectOption = Object.assign(
      {},
      { brokerUrl: "mqtt://localhost:1883" },
      options
    );
    this.init()
  }

  init() {
    this.client = mqtt.connect(this.connectOption.brokerUrl, this.connectOption);
  }

  public async publish(): Promise<void> {

  }

  public async subscribe(): Promise<void> {

  }

  public async disconnect(): Promise<void> {

  }

  public async connect(): Promise<void> {

  }

  public createOnConnectObservable(): Observable<{ timestamp: number }> {
    try {
      return fromEvent(
        this.client,
        'connect',
        () => { return { timestamp: Date.now() } },
      );
    } catch (error) {
      console.log(error);
    }
  }

  public createOnOfflineObservable(): Observable<{ timestamp: number }> {
    try {
      return fromEvent(
        this.client,
        'offline',
        () => { return { timestamp: Date.now() } },
      );
    } catch (error) {
      console.log(error);
    }
  }

  public createOnCloseObservable(): Observable<{ timestamp: number }> {
    try {
      return fromEvent(
        this.client,
        'close',
        () => { return { timestamp: Date.now() } },
      );
    } catch (error) {
      console.log(error);
    }
  }

  public createOnErrorObservable(): Observable<{ timestamp: number }> {
    try {
      return fromEvent(
        this.client,
        'error',
        () => { return { timestamp: Date.now() } },
      );
    } catch (error) {
      console.log(error);
    }
  }
}