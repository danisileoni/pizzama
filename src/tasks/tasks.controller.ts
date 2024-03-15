import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Auth } from 'src/auth/decorators/role-protected/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

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

  @Get(':id')
  @Auth(ValidRoles.user)
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Delete(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
