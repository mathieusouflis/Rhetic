import { ROUTES } from "./constants";

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
