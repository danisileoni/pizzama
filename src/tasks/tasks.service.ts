import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './entities/task.entity';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const projectId = await this.projectModel.findById(createTaskDto.projectId);
    const userId = await this.userModel.findById(createTaskDto.userId);

    if (!(userId && projectId)) {
      throw new NotFoundException(
        `userId: ${createTaskDto.userId} or ProjectId: ${createTaskDto.projectId} not found`,
      );
    }

    const task = this.taskModel.create(createTaskDto);

    return task;
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
