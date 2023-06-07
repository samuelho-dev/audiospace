import EmailLogin from "./EmailSignIn";
import EmailSignUp from "./EmailSignUp";
import SignInOAuth from "./SignInOAuth";

interface LoginRouteProps {
  route: string | null;
  setRoute: (dropdownName: string | null) => void;
  setErrorState: (error: string | null) => void;
}

export default function LoginRoute({
  route,
  setRoute,
  setErrorState,
}: LoginRouteProps) {
  switch (route) {
    case "sign-in-email":
      return <EmailLogin loginToggle={true} />;
    case "sign-up-email":
      return <EmailSignUp setErrorState={setErrorState} />;
    case "sign-in-oauth":
      return <SignInOAuth setRoute={setRoute} loginToggle={true} />;
    case "sign-up-oauth":
      return <SignInOAuth setRoute={setRoute} loginToggle={false} />;

    default:
      return <SignInOAuth setRoute={setRoute} loginToggle={true} />;
  }
}
