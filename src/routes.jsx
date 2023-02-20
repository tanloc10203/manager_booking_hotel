import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Loadable from "./components/Loadable";
import PrivateRoutes from "./components/private-routes";
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
import SignInLayout from "./layouts/signInLayout";
import PassLogin from "./components/private-routes/PassLogin";

// ----------------------------------------------------------------------

const Blog = Loadable(lazy(() => import("./pages/Blog")));
const DashboardApp = Loadable(lazy(() => import("./pages/DashboardApp")));
const Login = Loadable(
  lazy(() => import("./features/authentication/pages/Login"))
);
const NotFound = Loadable(lazy(() => import("./pages/Page404")));
const Products = Loadable(lazy(() => import("./pages/Products")));
const Register = Loadable(
  lazy(() => import("./features/authentication/pages/Register"))
);
const User = Loadable(lazy(() => import("./pages/User")));

export default function Router() {
  return useRoutes([
    {
      path: "/manager",
      element: (
        <PrivateRoutes>
          <DashboardLayout />
        </PrivateRoutes>
      ),
      children: [
        { path: "app", element: <DashboardApp /> },
        { path: "user", element: <User /> },
        { path: "products", element: <Products /> },
        { path: "blog", element: <Blog /> },
      ],
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "/", element: <Navigate to="/manager/app" /> },

        { path: "sign-up", element: <Register /> },
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "/",
      element: <SignInLayout />,
      children: [
        {
          path: "sign-in",
          element: (
            <PassLogin>
              <Login />
            </PassLogin>
          ),
        },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
