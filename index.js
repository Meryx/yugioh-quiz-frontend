import React from "react";
import ReactDOM from "react-dom/client"; // Updated import
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

import App from "./src/App";
import "./index.css";

// Use createRoot to manage the root of your app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <FluentProvider theme={teamsLightTheme}>
    <App />
  </FluentProvider>
);
