import { beforeEach, describe, expect, it } from 'vitest';

import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { PatientNotFoundError } from '@application/errors/patient-not-found-error';
import { DoesPatientExistByIdService } from '@application/services/does-patient-exist-by-id-service';

import { FakePatientGateway } from '@infra/gateways/patient/fake-patient-gateway';

describe('does-patient-exist-by-id-service', () => {
  let doesPatientExistByIdService: DoesPatientExistByIdService;
  let fakePatientGateway: FakePatientGateway;

  beforeEach(() => {
    fakePatientGateway = new FakePatientGateway();
    doesPatientExistByIdService = new DoesPatientExistByIdService(fakePatientGateway);
  });

  it('should return an true if patient exists', async () => {
    fakePatientGateway.patients = [{ id: 'db59e895-d203-47ff-a3b7-26cebcc8e3a2' }];
    const input = { id: 'db59e895-d203-47ff-a3b7-26cebcc8e3a2' };
    const output = true;

    const sut: Either<BaseError, boolean> = await doesPatientExistByIdService.execute(input);

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBe(output);
  });

  it('should return an error if patient does not exist', async () => {
    const input = { id: 'any' };
    const output = new PatientNotFoundError('Patient not found.');

    const sut: Either<BaseError, boolean> = await doesPatientExistByIdService.execute(input);

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });
});
