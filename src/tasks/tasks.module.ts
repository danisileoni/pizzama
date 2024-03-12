import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ProjectsModule } from 'src/projects/projects.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entities/task.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { Project, ProjectSchema } from 'src/projects/entities/project.entity';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Project.name,
        schema: ProjectSchema,
      },
    ]),
    ProjectsModule,
    AuthModule,
  ],
})
export class TasksModule {}
