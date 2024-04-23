import { AppProvider } from "../src/data/context/AppContext";
import { AuthProvider } from "../src/data/context/AuthContext";
import "../src/styles/globals.css";
import React from "react";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </AuthProvider>
  )
}
