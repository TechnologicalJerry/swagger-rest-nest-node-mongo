import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const session = new this.sessionModel({
      userId: new Types.ObjectId(createSessionDto.userId),
      loginTimestamp: new Date(),
      status: 'active',
    });
    return session.save();
  }

  async updateSession(
    userId: string | Types.ObjectId,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session | null> {
    return this.sessionModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId), status: 'active' },
        {
          ...updateSessionDto,
          logoutTimestamp: updateSessionDto.logoutTimestamp || new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async logout(userId: string | Types.ObjectId): Promise<Session | null> {
    return this.updateSession(userId, {
      status: 'logged_out',
      logoutTimestamp: new Date(),
    });
  }

  async findActiveSession(
    userId: string | Types.ObjectId,
  ): Promise<Session | null> {
    return this.sessionModel
      .findOne({
        userId: new Types.ObjectId(userId),
        status: 'active',
      })
      .exec();
  }

  async findAll(userId?: string | Types.ObjectId) {
    const query = userId ? { userId: new Types.ObjectId(userId) } : {};
    return this.sessionModel.find(query).populate('userId').exec();
  }
}
