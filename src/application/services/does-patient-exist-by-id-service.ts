import { Usecase } from '@shared/helpers/usecase';
import { BaseError } from '@shared/helpers/base-error';
import { Either, left, right } from '@shared/helpers/either';

import { PatientGateway } from '@application/gateways/patient-gateway';
import { PatientNotFoundError } from '@application/errors/patient-not-found-error';

export type DoesPatientExistByIdServiceInput = {
  id: string;
};

export type DoesPatientExistByIdServiceOuput = boolean;

export class DoesPatientExistByIdService extends Usecase<
  DoesPatientExistByIdServiceInput,
  DoesPatientExistByIdServiceOuput
> {
  public constructor(private readonly patientGateway: PatientGateway) {
    super();
  }

  public async execute(input: DoesPatientExistByIdServiceInput): Promise<Either<BaseError, boolean>> {
    const exists = await this.patientGateway.exists(input.id);

    if (!exists) {
      const error = new PatientNotFoundError('Patient not found.');
      return left(error);
    }

    return right(exists);
  }
}
