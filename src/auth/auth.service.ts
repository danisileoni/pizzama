import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { LoginUserDto, CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtServices: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.user = createUserDto.user.toLocaleLowerCase();
    try {
      const { password, ...userData } = createUserDto;

      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      const userObject = user.toObject();
      delete userObject.password;
      userObject.token = this.getJwtToken({ id: userObject.id });

      return userObject;
    } catch (error) {
      this.handelErrorExeption(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, user } = loginUserDto;

    const userLogin = await this.userModel
      .findOne({ user })
      .select('user password _id')
      .exec();

    if (!userLogin) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    if (!bcrypt.compareSync(password, userLogin.password)) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return {
      user: userLogin.user,
      id: userLogin.id,
      token: this.getJwtToken({ id: userLogin.id }),
    };
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(term: string) {
    let user: User;

    if (isValidObjectId(term)) {
      user = await this.userModel.findById(term);
    }
    if (!user) {
      user = await this.userModel.findOne({
        user: term.toLocaleLowerCase().trim(),
      });
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userId = await this.userModel.findById(id);

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const { password, user, email } = updateUserDto;

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: { password, user, email } },
      { new: true },
    );

    return updatedUser;
  }

  async remove(id: string) {
    const userDelete = await this.userModel.findOneAndDelete({ _id: id });

    if (!userDelete) throw new NotFoundException('Id not found or invalid');

    return { message: 'user deleted successfully' };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtServices.sign(payload);
  }

  private handelErrorExeption(error) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `User exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create User - Chaeck server logs`,
    );
  }
}
