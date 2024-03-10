import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entity';
import { generateSlug } from 'src/middlewares/generate-slug.middleware';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Project.name,
        useFactory: () => {
          const schema = ProjectSchema;
          generateSlug(schema);
          return schema;
        },
      },
    ]),
  ],
})
export class ProjectsModule {}
