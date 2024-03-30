import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const { userId, projectId } = createTaskDto;

    const [user, project] = await Promise.all([
      this.userModel.findById(userId).populate('assignedTasks', '_id'),
      this.projectModel.findById(projectId).populate('assignedTasks', '_id'),
    ]);

    if (!(user && project)) {
      throw new NotFoundException(
        `userId: ${createTaskDto.userId} or ProjectId: ${createTaskDto.projectId} not found`,
      );
    }

    const task = await this.taskModel.create(createTaskDto);

    user.assignedTasks.push(task._id);
    project.assignedTasks.push(task._id);
    await user.save();
    await project.save();

    return task;
  }

  async findAll() {
    const tasks = await this.taskModel.find();

    if (!tasks) {
      throw new NotFoundException('Not founds tasks');
    }

    return tasks;
  }

  async findOne(id: string) {
    try {
      const task = await this.taskModel.findById(id);
      return task;
    } catch (error) {
      throw new BadRequestException(`Id: ${id} invalid`);
    }
  }

  async findForUser(user: User) {
    try {
      const tasks = await this.taskModel
        .find({ userId: user.id })
        .sort({ startDate: -1 });

      if (!tasks) {
        throw new Error();
      }

      return tasks;
    } catch (error) {
      throw new NotFoundException('Not found userTask');
    }
  }

  async remove(id: string) {
    try {
      const task = await this.taskModel.findByIdAndDelete(id);

      return task;
    } catch (error) {
      throw new BadRequestException(`Id: ${id} invalid`);
    }
  }
}
