import { type Stripe, loadStripe } from "@stripe/stripe-js";
import { env } from "~/env.mjs";

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  stripePromise = loadStripe(env.STRIPE_CLIENT_ID);

  return stripePromise;
};

export default getStripe;
