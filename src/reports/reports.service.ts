import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './entities/report.entity';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<Report>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    user: User,
    projectId: Project,
  ) {
    try {
      const reportData = {
        ...createReportDto,
        user,
        projectId,
      };
      const project = await this.projectModel.findById(projectId);
      if (!project) {
        throw new Error();
      }

      const report = await this.reportModel.create(reportData);

      project.assignedReports.push(report._id);
      await this.projectModel.findByIdAndUpdate(project._id, project);

      return report;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Not Found Project');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;

    const reports = await this.reportModel.find().skip(offset).limit(limit);

    if (reports.length === 0) {
      throw new NotFoundException('Not founds reports');
    }

    return reports;
  }

  async findLatest() {
    const reports = await this.reportModel
      .find()
      .sort({ createAt: -1 })
      .limit(5);

    return reports;
  }

  async findOne(id: string) {
    try {
      const report = await this.reportModel.findById(id);
      return report;
    } catch (error) {
      throw new BadRequestException(`Id: ${id} invalid`);
    }
  }

  async remove(id: string) {
    try {
      const report = await this.reportModel.findByIdAndDelete(id);

      return report;
    } catch (error) {
      throw new BadRequestException(`Id: ${id} invalid`);
    }
  }
}
