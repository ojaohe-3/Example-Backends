import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import MonitorHandler from './handlers/MonitorHandler';
import dotenv from "dotenv";
dotenv.config();

declare interface ResponseError extends Error {
  status?: number;
}

const app: Application = express();

const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
  ],
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: process.env.API_URL || "localhost",
  preflightContinue: false,
};

app.use(cors(options));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);


const logger = (req: Request, res: Response, next) => {
  console.log(
    `at ${new Date().toString()}: ${req.protocol}://${req.get("host")}${
      req.originalUrl
    }: ${req.method} request`
    );
    MonitorHandler.instance.monitor.requests += 1;
    next();
  };
  app.use(logger);
  // response timer Metric
  app.use((req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {            
      const elapsed = process.hrtime(start);
      const elapsed_ms = elapsed[0] * 1000 + elapsed[1] / 1e6;
      MonitorHandler.instance.monitor.response_times.push(elapsed_ms)
    })
  
  
    next()
  })

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*"); //TODO
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.set("Content-Type", "application/json");
  next();
});

app.use(
  (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(err.status || 500);
    res.send("Error Occured!\nPlease try again later");
  }
);

import api_user from "./api/members/users.api";
import api_monitor from "./api/monitors/monitor.api";

app.use("/api/v1/members/users", api_user);
app.use("/api/v1/monitor", api_monitor);
// const port = process.env.PORT || 5000;
// app.set("port", port);
export default app;
