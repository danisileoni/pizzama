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
import { AssignedUserToProjectDto } from './dto/assigned-user-to-project.dto';
import { Auth } from 'src/auth/decorators/role-protected/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Post('assign-user-project')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  assignUserProject(
    @Body() assignedUserToProjectDto: AssignedUserToProjectDto,
  ) {
    return this.projectsService.assignUserToProject(assignedUserToProjectDto);
  }

  @Get()
  @Auth(ValidRoles.user)
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':term')
  @Auth(ValidRoles.user)
  findOne(@Param('term') term: string) {
    return this.projectsService.findOne(term);
  }

  @Patch('update/:id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
