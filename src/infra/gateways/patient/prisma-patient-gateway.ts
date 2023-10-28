import { PrismaClient } from '@prisma/client';

import { PatientGateway } from '@application/gateways/patient-gateway';

export class PrismaPatientGateway implements PatientGateway {
  public constructor(private readonly prismaClient: PrismaClient) {}

  public async exists(id: string): Promise<boolean> {
    const patient = await this.prismaClient.patient.findUnique({ where: { id } });
    return !!patient;
  }
}
