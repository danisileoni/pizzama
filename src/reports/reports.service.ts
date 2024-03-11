import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './entities/report.entity';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<Report>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    user: User,
    projectId: Project,
  ) {
    const reportData = {
      ...createReportDto,
      user,
      projectId,
    };

    const report = await this.reportModel.create(reportData);

    return report;
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
