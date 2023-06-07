import React, { useState } from "react";
import LoginRoute from "~/components/auth/LoginRoute";

function Index() {
  const [errorState, setErrorState] = useState<string | null>(null);
  const [route, setRoute] = useState<string | null>("sign-up-oauth");

  return (
    <div className="flex flex-grow-0 flex-col">
      <h1>audiospace</h1>
      {errorState && <h5>{errorState}</h5>}
      <LoginRoute
        route={route}
        setRoute={setRoute}
        setErrorState={setErrorState}
      />
    </div>
  );
}

export default Index;
