import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, Equals } from 'class-validator';

export class CaptureLeadDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID da Landing Page é obrigatório' })
  landingPageId: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  phone: string;

  @IsInt()
  @IsNotEmpty({ message: 'ID da categoria de serviço é obrigatório' })
  serviceCategoryId: number;

  @IsString()
  @IsNotEmpty({ message: 'Origem do tráfego é obrigatória' })
  trafficSource: string;

  @IsString()
  @IsNotEmpty({ message: 'O texto do termo de consentimento é obrigatório' })
  consentText: string;

  @IsBoolean()
  @Equals(true, { message: 'Você precisa aceitar os termos de consentimento para prosseguir' })
  acceptedConsent: boolean;
}
