import { AppProvider } from "../src/data/context/AppContext";
import { AuthProvider } from "../src/data/context/AuthContext";
import { DataProvider } from "../src/data/context/DataContext";
import "../src/styles/globals.css";
import React from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppProvider>
        <DataProvider>
          <div className={poppins.className}>
            <Component {...pageProps} />
          </div>
        </DataProvider>
      </AppProvider>
    </AuthProvider>
  );
}
