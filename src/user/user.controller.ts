import { Controller , Post ,Body,Get,Param} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() body: any) {
    return this.userService.signUp(body);
  }
@Get(':id/dashboard')
getDashboard(@Param('id') id: string) {
  return this.userService.getDashboardData(Number(id));
}
}