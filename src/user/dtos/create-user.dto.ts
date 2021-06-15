import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  lastname: string

  @Min(0)
  @IsNumber()
  age: number
}
