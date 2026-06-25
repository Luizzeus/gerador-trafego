import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): { status: string; message: string; timestamp: string } {
    return {
      status: 'healthy',
      message: 'API da Plataforma de Tráfego de Saúde está operacional!',
      timestamp: new Date().toISOString(),
    };
  }
}
