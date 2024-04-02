import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignedUserToProjectDto } from './dto/assigned-user-to-project.dto';
import { Auth } from 'src/auth/decorators/role-protected/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { GetUser } from 'src/auth/decorators/role-protected/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

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
  findAll(@Query() paginationDto: PaginationDto) {
    return this.projectsService.findAll(paginationDto);
  }

  @Get(':term')
  @Auth(ValidRoles.user)
  findOne(@Param('term') term: string) {
    return this.projectsService.findOne(term);
  }

  @Get('user/for-user')
  @Auth(ValidRoles.user)
  findForUser(@GetUser() user: User) {
    return this.projectsService.findForUser(user);
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
