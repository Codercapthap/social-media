import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/index.js";
import Loading from "./pages/loading/Loading";

import "./i18next.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <Suspense fallback={<Loading></Loading>}>
        <App />
      </Suspense>
    </React.StrictMode>
  </Provider>
);
