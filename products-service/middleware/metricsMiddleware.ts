import { Request, Response, NextFunction } from "express";
import {
  httpRequests,
  httpRequestDuration,
  httpRequestsInProgress,
  httpErrorCount
} from "../controllers/metricsController";

const metrics = (req: Request, res: Response, next: NextFunction) => {
  if(req.path != "metrics"){
      const end = httpRequestDuration.startTimer({
        method: req.method,
        route: req.path,
    });
    httpRequestsInProgress.inc({ method: req.method, route: req.path });
    httpRequests.inc({ method: req.method, route: req.path });

    res.on("finish", () => {
        end();
        httpRequestsInProgress.dec({ method: req.method, route: req.path });

        if (res.statusCode >= 500) {
        httpErrorCount.inc({
            method: req.method,
            route: req.path,
            status: res.statusCode,
        });
        }
    });
  }

  next();
};

export { metrics };
