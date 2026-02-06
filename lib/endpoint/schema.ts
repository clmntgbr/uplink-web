import { HTTP_METHODS } from "next/dist/server/web/http";
import * as z from "zod";

const httpMethodsTuple = HTTP_METHODS as unknown as [string, string, ...string[]];

export const createEndpointSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be at most 50 characters"),
  baseUri: z.string().min(1, "Base URI is required").url("Must be a valid URL"),
  path: z.string().min(1, "Path is required").startsWith("/", "Path must start with /"),
  method: z.enum(httpMethodsTuple),
  timeoutSeconds: z
    .number()
    .int("Timeout must be an integer")
    .min(1, "Timeout must be at least 1 second")
    .max(300, "Timeout must be at most 300 seconds"),
  body: z.record(z.string(), z.unknown()),
  query: z.record(z.string(), z.unknown()),
  header: z.record(z.string(), z.unknown()),
});
