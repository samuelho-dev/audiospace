import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

function SellerSignUp() {
  const router = useRouter();
  const accountLinkMutation = api.stripe.sellerAccountCreate.useMutation();

  const handleSignUp = async () => {
    try {
      const url = await accountLinkMutation.mutateAsync();
      window.location.href = url;
    } catch (err) {
      console.error("Error occured during signup", err);
    }
  };
  return (
    <div>
      <h2>Seller Sign Up</h2>
      <p>
        By clicking sign up, you agree to our terms of service before
        registering as a seller
      </p>
      <button onClick={() => void handleSignUp()}>Sign Up</button>
    </div>
  );
}

export default SellerSignUp;
