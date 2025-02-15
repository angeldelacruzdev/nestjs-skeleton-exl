import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error inesperado en la base de datos';

    switch (exception.code) {
      case 'P2002': // Unique constraint failed
        status = HttpStatus.CONFLICT;
        message = `El valor del campo único ya existe: ${exception.meta?.target}`;
        break;
      case 'P2025': // Record not found
        status = HttpStatus.NOT_FOUND;
        message = 'El registro solicitado no existe';
        break;
      case 'P2003': // Foreign key constraint failed
        status = HttpStatus.BAD_REQUEST;
        message = 'Violación de clave foránea';
        break;
      default:
        this.logger.error(`Error desconocido de Prisma: ${exception.code}`, exception.stack);
    }

    // 📌 Log del error detallado (pero no lo mostramos al frontend)
    this.logger.warn(`Error Prisma: ${message}`);

    response.status(status).json({
      statusCode: status,
      message, // Solo mostramos un mensaje seguro
      error: 'PrismaException',
    });
  }
}
