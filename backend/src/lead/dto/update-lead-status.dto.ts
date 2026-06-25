import { IsString, IsIn } from 'class-validator';

export class UpdateLeadStatusDto {
  @IsString()
  @IsIn(['new', 'in_contact', 'scheduled', 'converted', 'lost'], { message: 'Status inválido' })
  status: string;
}
