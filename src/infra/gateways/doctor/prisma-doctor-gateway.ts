import { PrismaClient } from '@prisma/client';

import { DoctorGateway } from '@application/gateways/doctor-gateway';

export class PrismaDoctorGateway implements DoctorGateway {
  public constructor(private readonly prismaClient: PrismaClient) {}

  public async exists(id: string): Promise<boolean> {
    const doctor = await this.prismaClient.doctor.findUnique({ where: { id } });
    return !!doctor;
  }
}
