import { Usecase } from '@shared/helpers/usecase';
import { BaseError } from '@shared/helpers/base-error';
import { Either, left, right } from '@shared/helpers/either';

import { DoctorGateway } from '@application/gateways/doctor-gateway';
import { DoctorNotFoundError } from '@application/errors/doctor-not-found-error';

export type DoesDoctorExistByIdServiceInput = {
  id: string;
};

export type DoesDoctorExistByIdServiceOuput = boolean;

export class DoesDoctorExistByIdService extends Usecase<
  DoesDoctorExistByIdServiceInput,
  DoesDoctorExistByIdServiceOuput
> {
  public constructor(private readonly doctorGateway: DoctorGateway) {
    super();
  }

  public async execute(input: DoesDoctorExistByIdServiceInput): Promise<Either<BaseError, boolean>> {
    const exists = await this.doctorGateway.exists(input.id);

    if (!exists) {
      const error = new DoctorNotFoundError('Doctor not found.');
      return left(error);
    }

    return right(exists);
  }
}
