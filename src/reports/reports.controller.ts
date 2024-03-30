import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Auth } from 'src/auth/decorators/role-protected/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/role-protected/get-user.decorator';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('create-report/:id')
  @Auth(ValidRoles.user)
  create(
    @Body() createReportDto: CreateReportDto,
    @Param('id') projectId: Project,
    @GetUser() user: User,
  ) {
    return this.reportsService.create(createReportDto, user, projectId);
  }

  @Get()
  @Auth(ValidRoles.user)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.reportsService.findAll(paginationDto);
  }

  @Get('report/:id')
  @Auth(ValidRoles.user)
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Get('latest')
  @Auth(ValidRoles.user)
  findLatest() {
    return this.reportsService.findLatest();
  }

  @Delete('remove/:id')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }
}
