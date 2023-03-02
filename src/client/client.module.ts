import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions } from './dto/client.dto';
import { ClientService, ClientServiceImpl } from './client.service';
import { SubjectServiceImpl } from './subject.service';

const subjectServiceFactory = () => {
  return {
    provide: SubjectServiceImpl,
    useFactory: (clientService: ClientService) => {
      return new SubjectServiceImpl(clientService);
    },
    inject: [ClientServiceImpl],
  };
};

@Module({})
export class ClientModule {
  static forRoot(options: Partial<ConnectionOptions>): DynamicModule {
    const providers = [
      {
        provide: ClientServiceImpl,
        useValue: new ClientServiceImpl(options),
      },
      subjectServiceFactory(),
    ];
    return {
      providers: providers,
      exports: providers,
      module: ClientModule,
    };
  }
}
