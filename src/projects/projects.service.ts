import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './entities/project.entity';
import { Model, isValidObjectId } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  // created project
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      const project = await this.projectModel.create(createProjectDto);
      console.log(project);
      return project;
    } catch (error) {
      this.handelErrorExeption(error);
    }
  }

  async assignUserToProject(
    projectId: string,
    userId: string,
  ): Promise<{ project: Project; user: User }> {
    const project = await this.projectModel.findById(projectId);
    const user = await this.userModel.findById(userId);
    if (!project || !user) {
      throw new NotFoundException('Project not found');
    }

    // checks if the project user already has the user id
    if (project.assignedUsers.includes(user.id)) {
      throw new BadRequestException('User already assigned to project');
    }

    project.assignedUsers.push(user.id);
    user.assignedProjects.push(project.id);
    await project.save();
    await user.save();

    return {
      project,
      user,
    };
  }

  async findAll() {
    return await this.projectModel.find();
  }

  async findOne(term: string) {
    let project: Project;

    if (isValidObjectId(term)) {
      project = await this.projectModel.findById(term);
    }
    if (!project) {
      project = await this.projectModel.findOne({
        slug: term.toLocaleLowerCase().trim(),
      });
    }

    if (!project) {
      throw new NotFoundException(`Not found projecto with term: ${term}`);
    }

    return project;
  }

  // update project
  update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const project = this.projectModel.findByIdAndUpdate(
        id,
        updateProjectDto,
        { new: true },
      );

      return project;
    } catch (error) {
      this.handelErrorExeption(error);
    }
  }

  remove(id: string) {
    const projectDelete = this.projectModel.findByIdAndDelete(id);
    if (!projectDelete) {
      throw new NotFoundException(
        `Not found project with id: ${projectDelete}`,
      );
    }

    return { message: 'Project deleted successfully' };
  }

  private handelErrorExeption(error) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Project exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
  }
}
