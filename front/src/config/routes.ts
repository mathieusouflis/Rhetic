import { ROUTES } from "./constants";

type RouteConfig = {
  path: string;
  isPublic?: boolean;
};

type Routes = {
  [K in keyof typeof ROUTES]: RouteConfig & {
    path: (typeof ROUTES)[K] extends { [key: string]: string }
      ? (typeof ROUTES)[K][keyof (typeof ROUTES)[K]]
      : (typeof ROUTES)[K];
  };
};

export const isPublicRoute = (pathname: string) => {
  return Object.values(ROUTES).some((routeGroup) => {
    if ("path" in routeGroup) {
      return routeGroup.path === pathname && routeGroup.isPublic;
    } else {
      return Object.values(routeGroup).some(
        (route) => route.path === pathname && route.isPublic
      );
    }
  });
};
