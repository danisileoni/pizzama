import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

      const report = await this.reportModel.create(reportData);

      return report;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Chaeck server logs');
    }
  }

  findAll() {
    const reports = this.reportModel.find();

    if (!reports) {
      throw new NotFoundException('Not founds reports');
    }

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
