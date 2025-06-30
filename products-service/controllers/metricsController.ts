import { Request, Response } from "express";
import asyncHandler from "..//middleware/asyncHanlder";
import client from "prom-client";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route"],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route"],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5],
});

const httpRequestsInProgress = new client.Gauge({
  name: "http_requests_in_progress",
  help: "Number of HTTP requests in progress",
  labelNames: ["method", "route"],
});

const httpErrorCount = new client.Counter({
  name: "http_error_total",
  help: "Total number of error responses",
  labelNames: ["method", "route", "status"],
});

register.registerMetric(httpErrorCount);
register.registerMetric(httpRequestsInProgress);
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequests);

const metricsHandler = asyncHandler(async (_: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export {
  metricsHandler,
  httpRequests,
  httpRequestDuration,
  httpRequestsInProgress,
  httpErrorCount,
};
