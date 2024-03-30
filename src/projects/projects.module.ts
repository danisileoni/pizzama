import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Report, ReportSchema } from 'src/reports/entities/report.entity';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Project.name,
        schema: ProjectSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Report.name,
        schema: ReportSchema,
      },
    ]),
    AuthModule,
  ],
  exports: [ProjectsModule],
})
export class ProjectsModule {}
