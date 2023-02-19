import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Loadable from "./components/Loadable";
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
import SignInLayout from "./layouts/signInLayout";

// ----------------------------------------------------------------------

const Blog = Loadable(lazy(() => import("./pages/Blog")));
const DashboardApp = Loadable(lazy(() => import("./pages/DashboardApp")));
const Login = Loadable(lazy(() => import("./pages/Login")));
const NotFound = Loadable(lazy(() => import("./pages/Page404")));
const Products = Loadable(lazy(() => import("./pages/Products")));
const Register = Loadable(lazy(() => import("./pages/Register")));
const User = Loadable(lazy(() => import("./pages/User")));
const SignIn = Loadable(
  lazy(() => import("./features/authentication/manager/pages/SignIn"))
);

export default function Router() {
  return useRoutes([
    {
      path: "/manager",
      element: <DashboardLayout />,
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
          element: <Login />,
        },
        {
          path: "manager/sign-in",
          element: <SignIn />,
        },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
