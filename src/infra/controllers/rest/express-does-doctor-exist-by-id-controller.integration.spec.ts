import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('express-does-doctor-exist-by-id-controller', () => {
  let prismaClient: PrismaClient;

  beforeAll(() => {
    prismaClient = new PrismaClient();
  });

  beforeEach(async () => {
    await prismaClient.doctor.deleteMany();
  });

  it('should succeed and return true', async () => {
    await prismaClient.doctor.create({
      data: {
        id: '84e75ed0-4f21-4319-956a-5a5dae3e90c0',
      },
    });

    const sut = await request('http://localhost:3002').get('/doctors/84e75ed0-4f21-4319-956a-5a5dae3e90c0/exists');

    expect(sut.status).toBe(200);
    expect(sut.body).toStrictEqual({ userExists: true });
  });

  it('should fail if id is not uuid', async () => {
    const sut = await request('http://localhost:3002').get('/doctors/5a5dae3e084e75ed0/exists');

    expect(sut.status).toBe(400);
    expect(sut.body).toStrictEqual({ errors: ['id must be uuid'] });
  });

  it('should fail if doctor it not found', async () => {
    const sut = await request('http://localhost:3002').get('/doctors/84e75ed0-4f21-4319-956a-5a5dae3e90c0/exists');

    expect(sut.status).toBe(404);
    expect(sut.body).toStrictEqual({ error: 'Doctor not found.' });
  });
});
