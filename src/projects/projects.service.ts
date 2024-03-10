import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './entities/project.entity';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      const project = await this.projectModel.create(createProjectDto);
      console.log(project);
      return project;
    } catch (error) {
      console.log(error);
      this.handelErrorExeption(error);
    }
  }

  async findAll() {
    return await this.projectModel.find();
  }

  async findOne(term: string) {
    console.log(term);
    let project: Project;

    if (isValidObjectId(term)) {
      project = await this.projectModel.findById(term);
    }
    if (!project) {
      project = await this.projectModel.findOne({
        project: term,
      });
    }

    return project;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  private handelErrorExeption(error) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Project exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
  }
}
