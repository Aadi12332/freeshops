/** @format */

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import allRoutes from "./Routes/Routes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CartPage from "./pages/Cart/Cart";
import WhatsAppButton from "./components/CommonComponent/WhatsAppButton";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <WhatsAppButton/>

    <Router>
      <ReactNotifications />
      <MainLayout>
        <Routes>
          {allRoutes.map((routeGroup, index) => {
            const Layout = routeGroup.layout;
            if (Layout) {
              return (
                <Route element={<Layout />} key={`layoutRoute${index}`}>
                  {routeGroup.routes.map((route) => (
                    <Route
                      path={route.path}
                      element={route.element}
                      key={`route${route.path}`}
                    />
                  ))}
                </Route>
              );
            } else {
              return routeGroup.routes.map((route) => (
                <Route
                  path={route.path}
                  element={route.element}
                  key={`route-without-layout${route.path}`}
                />
              ));
            }
          })}
          
        </Routes>
      </MainLayout>
      <Routes>
      <Route  path='/cart' element={CartPage} />

      </Routes>

      </Router>
    </GoogleOAuthProvider>

  );
};

export default App;
