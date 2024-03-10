import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Post(':id/:userid')
  assignUserProject(
    @Param('id') projectId: string,
    @Param('userid') userId: string,
  ) {
    return this.projectsService.assignUserToProject(projectId, userId);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.projectsService.findOne(term);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
