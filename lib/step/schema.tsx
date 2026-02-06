import z from "zod";

export const createStepSchema = z.object({
  name: z.string().min(1, "Name is required"),
  body: z.record(z.string(), z.string()),
  query: z.record(z.string(), z.string()),
  header: z.record(z.string(), z.string()),
  response: z.record(z.string(), z.unknown()),
});
