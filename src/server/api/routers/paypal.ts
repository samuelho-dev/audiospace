import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { getPaypalAxiosAuthHeaders } from "~/utils/getPaypalAxiosAuthHeaders";

export const paypalRouter = createTRPCRouter({
  generateSignUpLink: protectedProcedure.query(async ({ ctx, input }) => {
    try {
      const axiosInstance = await getPaypalAxiosAuthHeaders();

      if (!axiosInstance) {
        throw new Error("Err");
      }
      const payload = {
        tracking_id: ctx.session.user.id,
        operations: [
          {
            operation: "API_INTEGRATION",
            api_integration: {
              rest_api_integration: {
                integration_type: "THIRD_PARTY",
                PARTNER_FEE: "TRUE",
              },
            },
          },
        ],
        products: ["EXPRESS_CHECKOUT"],
        legal_consents: [
          {
            type: "SHARE_DATA_CONSENT",
            granted: true,
          },
        ],
      };

      const response = await axiosInstance.post(
        "/v1/customer/partner-referrals",
        payload
      );
      return response;
    } catch (err) {
      console.error(err);
    }
  }),
});
