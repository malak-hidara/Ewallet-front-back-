import { Controller, Get , Post, Body} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('Ewallet')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();

  }
  
  
  }

// a chaque fois qu'on veut ajouter un decorateur on doit l'importer
//Parce que les decorateurs se trouve dans Nest/common