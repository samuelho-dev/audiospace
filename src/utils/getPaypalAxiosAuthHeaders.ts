import axios from "axios";
import { env } from "~/env.mjs";
import { type PaypalAuthResponseSchema } from "~/types/paypal";

const PAYPAL_CLIENT_ID = env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = env.PAYPAL_CLIENT_SECRET;
const PAYPAL_OAUTH_API_URL = "https://api-m.sandbox.paypal.com/v1/oauth2/token";

const getAccessToken = async () => {
  const response: PaypalAuthResponseSchema = await axios({
    method: "post",
    url: PAYPAL_OAUTH_API_URL,
    headers: {
      Accept: "application/json",
    },
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_CLIENT_SECRET,
    },
    params: {
      grant_type: "client_credentials",
    },
  });

  return response;
};

export const getPaypalAxiosAuthHeaders = async () => {
  try {
    const paypalAuthToken = await getAccessToken();

    if (!paypalAuthToken) {
      throw new Error("Paypal access token no response");
    }

    return axios.create({
      baseURL: "https://api-m.sandbox.paypal.com",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${paypalAuthToken.access_token}`,
      },
    });
  } catch (err) {
    console.error("Error occured in paypal init", err);
  }
};
