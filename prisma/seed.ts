import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

async function main() {
  await prismaClient.$transaction([prismaClient.doctor.deleteMany(), prismaClient.patient.deleteMany()]);
  await prismaClient.$transaction([
    prismaClient.doctor.create({
      data: {
        id: '6bf34422-622c-4c58-a751-4614980fce03',
      },
    }),
    prismaClient.patient.create({
      data: {
        id: 'b957aa4b-654e-47b0-a935-0923877d57a7',
      },
    }),
  ]);
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
