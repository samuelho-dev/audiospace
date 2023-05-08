import { useState } from "react";
import SignInOAuth from "./SignInOAuth";
import CredentialLogin from "./CredentialSignIn";
import CredentialSignUp from "./CredentialSignUp";

interface AuthModalProps {
  handleDropdown: (dropdownName: string | null) => void;
}

interface LoginRouteProps {
  route: string | null;
  setRoute: (dropdownName: string | null) => void;
  setErrorState: (error: string | null) => void;
}

function LoginRoute({ route, setRoute, setErrorState }: LoginRouteProps) {
  switch (route) {
    case "sign-in-credential":
      return <CredentialLogin loginToggle={true} />;
    case "sign-up-credential":
      return <CredentialSignUp setErrorState={setErrorState} />;
    case "sign-in-oauth":
      return <SignInOAuth setRoute={setRoute} loginToggle={true} />;
    case "sign-up-oauth":
      return <SignInOAuth setRoute={setRoute} loginToggle={false} />;

    default:
      return <SignInOAuth setRoute={setRoute} loginToggle={true} />;
  }
}

export default function AuthModal({ handleDropdown }: AuthModalProps) {
  const [errorState, setErrorState] = useState<string | null>(null);
  const [route, setRoute] = useState<string | null>(null);

  return (
    <>
      <div
        className="absolute left-0 top-0 z-40 h-full w-full bg-zinc-950 bg-opacity-50"
        onClick={() => handleDropdown(null)}
      />
      <div className="absolute left-1/2 top-1/2 z-50 w-fit -translate-x-1/2 -translate-y-1/2 transform flex-col items-center rounded-lg bg-zinc-900 p-8 outline outline-1 outline-zinc-700">
        <h1>audio.space</h1>
        {errorState && <h5>{errorState}</h5>}
        <LoginRoute
          route={route}
          setRoute={setRoute}
          setErrorState={setErrorState}
        />
      </div>
    </>
  );
}
