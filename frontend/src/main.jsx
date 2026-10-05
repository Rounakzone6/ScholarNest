import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ShopContextProvider from "./context/ShopContext.jsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HelmetProvider>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </HelmetProvider>
  </BrowserRouter>
);
