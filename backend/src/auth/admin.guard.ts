import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Acesso negado. Usuário não autenticado.');
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException('Acesso restrito para administradores.');
    }

    return true;
  }
}
