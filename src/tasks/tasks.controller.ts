import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Auth } from 'src/auth/decorators/role-protected/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/role-protected/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @Auth(ValidRoles.user)
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('task/:id')
  @Auth(ValidRoles.user)
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Get('for-user')
  @Auth(ValidRoles.user)
  findForUser(@GetUser() user: User) {
    return this.tasksService.findForUser(user);
  }

  @Delete(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
