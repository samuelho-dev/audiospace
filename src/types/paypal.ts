import { z } from "zod";

export const PaypalAuthResponseSchema = z.object({
  scope: z.string(),
  access_token: z.string(),
  token_type: z.string(),
  app_id: z.string(),
  expires_in: z.number(),
  nonce: z.string(),
});
export type PaypalAuthResponseSchema = z.infer<typeof PaypalAuthResponseSchema>;
