import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsUUID()
  owner: string
}
