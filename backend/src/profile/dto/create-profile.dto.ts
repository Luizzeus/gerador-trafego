import { IsString, IsNotEmpty, IsIn, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsIn(['caregiver', 'psychologist'], { message: 'Nicho deve ser caregiver ou psychologist' })
  niche: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Número de registro é obrigatório' })
  registerNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Estado do conselho profissional é obrigatório' })
  registerState: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @IsString()
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  addressCity: string;

  @IsString()
  @IsNotEmpty({ message: 'Estado (UF) é obrigatório' })
  addressState: string;

  @IsString()
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  addressZipcode: string;

  @IsString()
  @IsNotEmpty({ message: 'Número de WhatsApp é obrigatório' })
  whatsappNumber: string;
}
