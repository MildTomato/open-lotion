import React from "react";
import { UserContextProvider } from "./../lib/UserContext";
import { supabase } from "../utils/supabaseClient";
import "./../styles/globals.scss";

interface Props {
  Component: any;
  pageProps: any;
}

export default function MyApp({ Component, pageProps }: Props) {
  return (
    <main>
      <UserContextProvider supabaseClient={supabase}>
        <Component {...pageProps} />
      </UserContextProvider>
    </main>
  );
}
