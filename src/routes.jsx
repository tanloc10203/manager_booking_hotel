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
const ChangePwd = Loadable(
  lazy(() => import("./features/authentication/pages/ChangePwd"))
);
const User = Loadable(lazy(() => import("./pages/User")));
const Home = Loadable(lazy(() => import("./pages/Home")));

// Hotels
const HotelManagePage = Loadable(
  lazy(() => import("./features/@dashboard/pages/hotels/Hotel"))
);
const HotelAddEdit = Loadable(
  lazy(() => import("./features/@dashboard/pages/hotels/HotelAddEdit"))
);

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
        {
          path: "hotel",
          element: <HotelManagePage />,
        },
        {
          path: "hotel/add",
          element: <HotelAddEdit />,
        },
        {
          path: "hotel/update/:hotelId",
          element: <HotelAddEdit />,
        },
      ],
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        { path: "change-password", element: <ChangePwd /> },
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
