import { PrismaClient } from '@prisma/client';
import express, { Router, Request, Response } from 'express';

import { DoesDoctorExistByIdService } from '@application/services/does-doctor-exist-by-id-service';

import { PrismaDoctorGateway } from '@infra/gateways/doctor/prisma-doctor-gateway';
import { ExpressDoesDoctorExistByIdController } from '@infra/controllers/rest/express-does-doctor-exist-by-id-controller';
import { ExpressDoesPatientExistByIdController } from '@infra/controllers/rest/express-does-patient-exist-by-id-controller';
import { DoesPatientExistByIdService } from '@application/services/does-patient-exist-by-id-service';
import { PrismaPatientGateway } from '@infra/gateways/patient/prisma-patient-gateway';

const start = async () => {
  const app = express();
  const router = Router();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const prismaClient = new PrismaClient();
  // const connection = await amqplib.connect('amqp://localhost:5672');
  // const channel = await connection.createChannel();

  const prismaDoctorGateway = new PrismaDoctorGateway(prismaClient);
  const prismaPatientGateway = new PrismaPatientGateway(prismaClient);

  const doesDoctorExistByIdService = new DoesDoctorExistByIdService(prismaDoctorGateway);
  const doesPatientExistByIdService = new DoesPatientExistByIdService(prismaPatientGateway);

  const expressDoesDoctorExistByIdController = new ExpressDoesDoctorExistByIdController(doesDoctorExistByIdService);
  const expressDoesPatientExistByIdController = new ExpressDoesPatientExistByIdController(doesPatientExistByIdService);

  app.use(router);

  router.get('/doctors/:id/exists', (request: Request, response: Response) => {
    return expressDoesDoctorExistByIdController.handle(request, response);
  });

  router.get('/patients/:id/exists', (request: Request, response: Response) => {
    return expressDoesPatientExistByIdController.handle(request, response);
  });

  app.listen(process.env.API_BASE_PORT, () => {
    console.log(`Listening on port ${process.env.API_BASE_PORT}`);
  });
};

start();
