import { z } from 'zod';
import { Request, Response } from 'express';

import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { DoctorNotFoundError } from '@application/errors/doctor-not-found-error';
import { DoesDoctorExistByIdService } from '@application/services/does-doctor-exist-by-id-service';

export class ExpressDoesDoctorExistByIdController {
  constructor(private readonly doesDoctorExistByIdService: DoesDoctorExistByIdService) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const schema = z.object({
        id: z
          .string({ required_error: 'id is required', invalid_type_error: 'id must be string' })
          .trim()
          .uuid({ message: 'id must be uuid' }),
      });

      const body = schema.safeParse(request.params);

      if (!body.success) {
        const errors = JSON.parse(body.error.message).map((error: { message: string }) => error.message);
        return response.status(400).send({ errors });
      }

      const doesDoctorExistByIdService: Either<BaseError, boolean> = await this.doesDoctorExistByIdService.execute({
        id: request.params.id,
      });

      if (doesDoctorExistByIdService.isRight()) {
        return response.status(200).send({ userExists: doesDoctorExistByIdService.value });
      }

      const baseError: BaseError = doesDoctorExistByIdService.value;

      if (baseError instanceof DoctorNotFoundError) {
        return response.status(404).send({ error: baseError.message });
      }

      return response.status(500).send({
        errorMessage: 'Something unexpected happened',
      });
    } catch (error) {
      return response.status(500).send({
        errorMessage: 'Something unexpected happened',
      });
    }
  }
}
