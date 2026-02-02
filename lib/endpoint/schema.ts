import { HTTP_METHODS } from "next/dist/server/web/http";
import * as z from "zod";

export const createEndpointSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be at most 50 characters"),
  baseUri: z.string().min(1, "Base URI is required").url("Must be a valid URL"),
  path: z.string().min(1, "Path is required").startsWith("/", "Path must start with /"),
  method: z.enum(HTTP_METHODS),
  timeoutSeconds: z.number().int().min(1, "Timeout must be at least 1 second").max(300, "Timeout must be at most 300 seconds"),
  body: z.string().refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Body must be valid JSON" }
  ),
});
