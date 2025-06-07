import { Request, Response } from "express";
import asyncHandler from "..//middleware/asyncHanlder";
import client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
});
register.registerMetric(httpRequests);


const metricsHandler = asyncHandler(async (_: Request, res: Response) => {
  res.set('Content-Type', register.contentType); 
  res.end(await register.metrics());
});


export { metricsHandler }