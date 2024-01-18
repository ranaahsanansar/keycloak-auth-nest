import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth/guards/auth.guard';

@Controller()
@ApiTags('Default')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBearerAuth('access-token')
  // @UseGuards(AuthGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
