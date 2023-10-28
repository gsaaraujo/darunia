import { z } from 'zod';
import { Request, Response } from 'express';

import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { PatientNotFoundError } from '@application/errors/patient-not-found-error';
import { DoesPatientExistByIdService } from '@application/services/does-patient-exist-by-id-service';

export class ExpressDoesPatientExistByIdController {
  constructor(private readonly doesPatientExistByIdService: DoesPatientExistByIdService) {}

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

      const doesPatientExistByIdService: Either<BaseError, boolean> = await this.doesPatientExistByIdService.execute({
        id: request.params.id,
      });

      if (doesPatientExistByIdService.isRight()) {
        return response.status(200).send({ userExists: doesPatientExistByIdService.value });
      }

      const baseError: BaseError = doesPatientExistByIdService.value;

      if (baseError instanceof PatientNotFoundError) {
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
