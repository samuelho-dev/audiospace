import sgMail from "@sendgrid/mail";
import { env } from "~/env.mjs";

sgMail.setApiKey(env.SENDGRID_API_KEY);
export default sgMail;
