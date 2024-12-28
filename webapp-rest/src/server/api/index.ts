import { Express } from "express";
import { createAdapter } from "./http_adapter";
import { ResultWebService } from "./results_api";
import { Validator } from "./validation_adapter";
import { ResultWebServiceValidation } from "./results_api_validation";

import { FeathersWrapper } from "./feathers_adapter";
import { feathers } from "@feathersjs/feathers";
import feathersExpress, { rest } from "@feathersjs/express";
import { ValidationError } from "./validation_types";

export const createApi = (app: Express) => {
  // The ResultWebService class implements the WebService<Result> interface
  // and implements the methods by using the repository features.
  // createAdapter(app, new ResultWebService(), "/api/results");
  /* createAdapter(
    app,
    new Validator(new ResultWebService(), ResultWebServiceValidation),
    "/api/results"
  ); */

  // The custom code throws ValidationError when validation fails, which Feathers
  // handles by sending a 500 response. Hooks receives a context object that provides
  // details of the request and its outcome, and this statement changes the response
  // status code if ValidationError has occurred.

  const feathersApp = feathersExpress(feathers(), app).configure(rest());
  const service = new Validator(
    new ResultWebService(),
    ResultWebServiceValidation
  );
  feathersApp.use("/api/results", new FeathersWrapper(service));
  feathersApp.hooks({
    error: {
      all: [
        (ctx) => {
          if (ctx.error instanceof ValidationError) {
            ctx.http = { status: 400 };
            ctx.error = undefined;
          }
        },
      ],
    },
  });
};
