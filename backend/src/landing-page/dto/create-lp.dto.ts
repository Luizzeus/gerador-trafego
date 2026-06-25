import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateLpDto {
  @IsString()
  @IsNotEmpty({ message: 'Título da Landing Page é obrigatório' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Subdomínio é obrigatório' })
  subdomain: string;

  @IsString()
  @IsOptional()
  customDomain?: string;

  @IsString()
  @IsIn(['draft', 'published'], { message: 'Status inválido' })
  status: string;

  @IsString()
  @IsNotEmpty({ message: 'O conteúdo JSON da página é obrigatório' })
  contentJson: string;

  @IsString()
  @IsOptional()
  pixelMetaId?: string;

  @IsString()
  @IsOptional()
  pixelGoogleId?: string;
}
