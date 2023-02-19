// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: "dashboard",
    path: "/manager/app",
    icon: getIcon("eva:pie-chart-2-fill"),
  },
  {
    title: "user",
    path: "/manager/user",
    icon: getIcon("eva:people-fill"),
  },
  {
    title: "product",
    path: "/manager/products",
    icon: getIcon("eva:shopping-bag-fill"),
  },
  {
    title: "blog",
    path: "/manager/blog",
    icon: getIcon("eva:file-text-fill"),
  },
];

export default navConfig;
