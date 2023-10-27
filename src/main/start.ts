import amqplib from 'amqplib';
import { PrismaClient } from '@prisma/client';
import express, { Router, Request, Response } from 'express';

const start = async () => {
  const app = express();
  const router = Router();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const prismaClient = new PrismaClient();
  const connection = await amqplib.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();

  app.use(router);

  app.listen(3000, () => {
    console.log(`Listening on port ${3000}`);
  });
};

start();
