import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ProjectsModule } from 'src/projects/projects.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './entities/report.entity';
import { Project, ProjectSchema } from 'src/projects/entities/project.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Report.name,
        schema: ReportSchema,
      },
      {
        name: Project.name,
        schema: ProjectSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ProjectsModule,
    AuthModule,
  ],
})
export class ReportsModule {}
