import {
  Injectable,
  Inject,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ClientService } from './client.service';
import { MessageEvent, Event } from './dto/client.dto';

export interface SubjectService {
  getConnectSubject(): Subject<Event>;
  getDisconnectSubject(): Subject<Event>;
  getCloseSubject(): Subject<Event>;
  getErrorSubject(): Subject<Event>;
  getMessageSubject(): Subject<{ topic: string; payload: string }>;
}

@Injectable()
export class SubjectServiceImpl
  implements SubjectService, OnApplicationBootstrap
{
  private readonly connectSubject = new Subject<Event>();
  private readonly disconnectSubject = new Subject<Event>();
  private readonly closeSubject = new Subject<Event>();
  private readonly errorSubject = new Subject<Event>();
  private readonly messageSubject = new Subject<{
    topic: string;
    payload: string;
  }>();

  public constructor(private readonly mqttClientService: ClientService) {}

  public onApplicationBootstrap(): void {
    // connect
    this.mqttClientService
      .createOnConnectObservable()
      .pipe(
        catchError((err, caught$) => {
          Logger.error(err.stack);
          return caught$;
        }),
      )
      .subscribe(this.connectSubject);

    // disconnect
    this.mqttClientService
      .createOnOfflineObservable()
      .pipe(
        map((data: Event) => {
          // Logger.log(`subject client ${client.id} disconnect`);
          return data;
        }),
        catchError((err, caught$) => {
          Logger.error(err.stack);
          return caught$;
        }),
      )
      .subscribe(this.disconnectSubject);

    // close
    this.mqttClientService
      .createOnCloseObservable()
      .pipe(
        map((data: Event) => {
          // Logger.log(`subject client ${client.ip} ${client.id} connect`);
          return data;
        }),
        catchError((err, caught$) => {
          Logger.error(err.stack);
          return caught$;
        }),
      )
      .subscribe(this.closeSubject);

    //errorSubject
    this.mqttClientService
      .createOnErrorObservable()
      .pipe(
        map((data: Event) => {
          return data;
        }),
        catchError((err, caught$) => {
          Logger.error(err.stack);
          return caught$;
        }),
      )
      .subscribe(this.errorSubject);

    //message
    this.mqttClientService
      .createOnMessageObservable()
      .pipe(
        map((data: { topic: string; payload: Buffer }) => {
          return {
            topic: data.topic,
            payload: data.payload.toString(),
          };
        }),
        catchError((err, caught$) => {
          Logger.error(err.stack);
          return caught$;
        }),
      )
      .subscribe(this.messageSubject);
  }

  public getConnectSubject(): Subject<Event> {
    return this.connectSubject;
  }

  public getDisconnectSubject(): Subject<Event> {
    return this.disconnectSubject;
  }

  public getCloseSubject(): Subject<Event> {
    return this.closeSubject;
  }

  public getErrorSubject(): Subject<Event> {
    return this.errorSubject;
  }

  public getMessageSubject(): Subject<{ topic: string; payload: string }> {
    return this.messageSubject;
  }
}
