import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve conter no mínimo 6 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsIn(['professional', 'company_member', 'admin'], { message: 'Perfil de usuário inválido' })
  role: string;
}
