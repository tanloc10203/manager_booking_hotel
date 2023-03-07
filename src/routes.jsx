import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Loadable from "./components/Loadable";
import PrivateRoutes from "./components/private-routes";
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
import SignInLayout from "./layouts/signInLayout";
import PassLogin from "./components/private-routes/PassLogin";

// ----------------------------------------------------------------------

const DashboardApp = Loadable(lazy(() => import("./pages/DashboardApp")));
const Login = Loadable(
  lazy(() => import("./features/authentication/pages/Login"))
);
const NotFound = Loadable(lazy(() => import("./pages/Page404")));
const Register = Loadable(
  lazy(() => import("./features/authentication/pages/Register"))
);
const ChangePwd = Loadable(
  lazy(() => import("./features/authentication/pages/ChangePwd"))
);
const User = Loadable(lazy(() => import("./pages/User")));
const Home = Loadable(lazy(() => import("./pages/Home")));
const List = Loadable(lazy(() => import("./pages/List")));
const Hotel = Loadable(lazy(() => import("./pages/Hotel")));
const Booking = Loadable(lazy(() => import("./pages/Booking")));

// Manager hotel
const HotelManagePage = Loadable(
  lazy(() => import("./features/@dashboard/pages/hotels/Hotel"))
);
const HotelAddEdit = Loadable(
  lazy(() => import("./features/@dashboard/pages/hotels/HotelAddEdit"))
);

// Manager floor
const FloorManagePage = Loadable(
  lazy(() => import("./features/@dashboard/pages/floors/Floor"))
);

const FloorAddEdit = Loadable(
  lazy(() => import("./features/@dashboard/pages/floors/FloorAddEdit"))
);

// Manager device
const DeviceManagePage = Loadable(
  lazy(() => import("./features/@dashboard/pages/devices/Device"))
);

const DeviceAddEdit = Loadable(
  lazy(() => import("./features/@dashboard/pages/devices/DeviceAddEdit"))
);

// Manager room
const RoomManagePage = Loadable(
  lazy(() => import("./features/@dashboard/pages/rooms/Room"))
);

const RoomTypeManagePage = Loadable(
  lazy(() => import("./features/@dashboard/pages/rooms/RoomType"))
);

const RoomTypeAddEdit = Loadable(
  lazy(() => import("./features/@dashboard/pages/rooms/RoomTypeAddEdit"))
);

const RoomAddEdit = Loadable(
  lazy(() => import("./features/@dashboard/pages/rooms/RoomAddEdit"))
);

// Manager concern
const ConcernManagePage = Loadable(
  lazy(() => import("./features/@dashboard/pages/concerns/Concern"))
);

// Manage booking
const BookingManagePage = Loadable(
  lazy(() => import("./features/@dashboard/pages/booking/Booking"))
);

// Manage Status
const StatusManagePage = Loadable(
  lazy(() => import("./features/@dashboard/pages/status/Status"))
);

const StatusAddEdit = Loadable(
  lazy(() => import("./features/@dashboard/pages/status/StatusAddEdit"))
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
        {
          path: "floor",
          element: <FloorManagePage />,
        },
        {
          path: "floor/add",
          element: <FloorAddEdit />,
        },
        {
          path: "floor/update/:floorId",
          element: <FloorAddEdit />,
        },
        {
          path: "device",
          element: <DeviceManagePage />,
        },
        {
          path: "device/add",
          element: <DeviceAddEdit />,
        },
        {
          path: "device/update/:deviceId",
          element: <DeviceAddEdit />,
        },
        {
          path: "room",
          element: <RoomManagePage />,
        },
        {
          path: "room/add",
          element: <RoomAddEdit />,
        },
        {
          path: "room/update/:roomId",
          element: <RoomAddEdit />,
        },
        {
          path: "room-type",
          element: <RoomTypeManagePage />,
        },
        {
          path: "room-type/add",
          element: <RoomTypeAddEdit />,
        },
        {
          path: "room-type/update/:roomTypeId",
          element: <RoomTypeAddEdit />,
        },
        {
          path: "status",
          element: <StatusManagePage />,
        },
        {
          path: "status/add",
          element: <StatusAddEdit />,
        },
        {
          path: "status/update/:statusId",
          element: <StatusAddEdit />,
        },
        {
          path: "concern",
          element: <ConcernManagePage />,
        },
        {
          path: "booking",
          element: <BookingManagePage />,
        },
      ],
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "hotels",
          element: <List />,
        },
        {
          path: "hotels/:hotelSlug",
          element: <Hotel />,
        },
        {
          path: "booking",
          element: <Booking />,
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
