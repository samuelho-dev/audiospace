import { type NextApiRequest, type NextApiResponse } from "next";
import { stripe } from "./stripe/stripe";
import { env } from "~/env.mjs";

export default async function stripeRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const account = await stripe.accounts.create({
      type: "standard",
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://yourwebsite.com/seller/onboarding/reauth",
      return_url: `${env.NEXTAUTH_URL}/seller/onboarding/finish`,
      type: "account_onboarding",
    });

    res.redirect(accountLink.url);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating Stripe account." });
  }
}
