import { type NextApiRequest, type NextApiResponse } from "next";
import { stripe } from "./stripe";
import { env } from "~/env.mjs";
import type Stripe from "stripe";

async function buffer(readable: NextApiRequest) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function handleEvent(event: Stripe.Event, res: NextApiResponse) {
  switch (event.type) {
    case "account.update":
      break;
    case "charge.succeeded":
      break;
    case "charge.failed":
      break;
    default:
      return res.status(400).end();
  }
  res.json({ received: true });
}

export default async function webhook(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig || "",
        env.STRIPE_CLIENT_SECRET
      );
    } catch (err) {
      res.status(400);
      return;
    }

    handleEvent(event, res);
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
