import { PrismaClient } from '@prisma/client';
import express, { Router, Request, Response } from 'express';

import { DoesDoctorExistByIdService } from '@application/services/does-doctor-exist-by-id-service';

import { PrismaDoctorGateway } from '@infra/gateways/doctor/prisma-doctor-gateway';
import { ExpressDoesDoctorExistByIdController } from '@infra/controllers/rest/express-does-doctor-exist-by-id-controller';

const start = async () => {
  const app = express();
  const router = Router();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const prismaClient = new PrismaClient();
  // const connection = await amqplib.connect('amqp://localhost:5672');
  // const channel = await connection.createChannel();

  const prismaDoctorGateway = new PrismaDoctorGateway(prismaClient);

  const doesDoctorExistByIdService = new DoesDoctorExistByIdService(prismaDoctorGateway);

  const expressDoesDoctorExistByIdController = new ExpressDoesDoctorExistByIdController(doesDoctorExistByIdService);

  app.use(router);

  router.get('/doctors/:id/exists', (request: Request, response: Response) => {
    return expressDoesDoctorExistByIdController.handle(request, response);
  });

  app.listen(3000, () => {
    console.log(`Listening on port ${3000}`);
  });
};

start();
