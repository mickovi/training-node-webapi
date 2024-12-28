import { Server, ServerResponse } from "http";
import { promisify } from "util";

/* The as keyword overrides the type inferred by the TypeScript compiler 
with a description of the method parameters and result. */
export const endPromise = 
promisify(ServerResponse.prototype.end) as (data: any) => Promise<void>;

export const writePromise = 
promisify(ServerResponse.prototype.write) as (data: any) => Promise<void>;