import {
  ConflictException,
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
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtServices: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto, res: Response) {
    createUserDto.user = createUserDto.user.toLocaleLowerCase();
    try {
      const { password, ...userData } = createUserDto;

      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      const token = this.getJwtToken({ id: user.id });

      res.cookie('token', token, {
        httpOnly: false,
        sameSite: 'lax',
        secure: true,
      });
      return res.send({ user });
    } catch (error) {
      console.log(error);
      this.handelErrorExeption(error);
    }
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    const { password, user } = loginUserDto;

    const userLogin = await this.userModel
      .findOne({ user })
      .select('user email password _id')
      .exec();

    if (!userLogin || !bcrypt.compareSync(password, userLogin.password)) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    const token = this.getJwtToken({ id: userLogin.id });

    res.cookie('token', token, {
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
    });
    return res.send({
      user: userLogin.user,
      id: userLogin.id,
    });
  }

  async logout(res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged succes - Clear cookie complete' });
  }

  async refreshToken(req: Request, res: Response) {
    const { token } = req.cookies;
    if (!token) throw new UnauthorizedException('Unauthorized');

    try {
      const decodedToken = this.jwtServices.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userModel.findById(decodedToken.id);

      if (!user) {
        throw new Error();
      }

      const newToken = this.getJwtToken({ id: user.id });

      res.cookie('token', newToken, {
        httpOnly: false,
        sameSite: 'lax',
        secure: true,
      });
      return res.send({
        user: user.user,
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid Token signature');
    }
  }

  async verify(req: Request) {
    const { token } = req.cookies;

    if (!token) throw new UnauthorizedException('Unauthorized');

    try {
      const decodedToken = this.jwtServices.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userModel.findById(decodedToken.id);

      if (!user) {
        throw new Error();
      }

      return {
        id: user.id,
        user: user.user,
        email: user.email,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Token signature');
    }
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
      throw new ConflictException(
        `User exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create User - Chaeck server logs`,
    );
  }
}
