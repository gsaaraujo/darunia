import { beforeEach, describe, expect, it } from 'vitest';

import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { DoctorNotFoundError } from '@application/errors/doctor-not-found-error';
import { DoesDoctorExistByIdService } from '@application/services/does-doctor-exist-by-id-service';

import { FakeDoctorGateway } from '@infra/gateways/doctor/fake-doctor-gateway';

describe('does-doctor-exist-by-id-service', () => {
  let doesDoctorExistByIdService: DoesDoctorExistByIdService;
  let fakeDoctorGateway: FakeDoctorGateway;

  beforeEach(() => {
    fakeDoctorGateway = new FakeDoctorGateway();
    doesDoctorExistByIdService = new DoesDoctorExistByIdService(fakeDoctorGateway);
  });

  it('should return an true if doctor exists', async () => {
    fakeDoctorGateway.doctors = [{ id: 'db59e895-d203-47ff-a3b7-26cebcc8e3a2' }];
    const input = { id: 'db59e895-d203-47ff-a3b7-26cebcc8e3a2' };
    const output = true;

    const sut: Either<BaseError, boolean> = await doesDoctorExistByIdService.execute(input);

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBe(output);
  });

  it('should return an error if doctor does not exist', async () => {
    const input = { id: 'any' };
    const output = new DoctorNotFoundError('Doctor not found.');

    const sut: Either<BaseError, boolean> = await doesDoctorExistByIdService.execute(input);

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(output);
  });
});
