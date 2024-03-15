import { IsMongoId, IsString } from 'class-validator';

export class AssignedUserToProjectDto {
  @IsString()
  @IsMongoId()
  projectId: string;
  @IsString()
  @IsMongoId()
  userId: string;
}
