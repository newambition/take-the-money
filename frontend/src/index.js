// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./styles/index.css"; // Keep default index.css if you have global styles there
import App from "./App";

import reportWebVitals from "./reportWebVitals";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

if (!domain || !clientId) {
  throw new Error(
    "Auth0 domain and client ID must be set in your .env file. " +
      "Please ensure the file is in the project root and you have restarted the development server."
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
