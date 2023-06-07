import { useState } from "react";
import LoginRoute from "./LoginRoute";

interface AuthModalProps {
  handleDropdown: (dropdownName: string | null) => void;
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
        <h1>audiospace</h1>
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
