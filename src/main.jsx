/** @format */

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import "swiper/css";
import { StripeCheckoutProvider } from "./Context/StripeCheckoutContext.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
       <ThemeProvider>

    <StripeCheckoutProvider>
    <App />
    </StripeCheckoutProvider>
        </ThemeProvider>

  </Provider>
);
