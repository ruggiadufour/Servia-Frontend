import { useEffect } from "react";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import nProgress from "nprogress";

export default function Layout({ children }) {
  const router = useRouter();
  useEffect(() => {
    //nprogress
    const handleRouteChange = (url) => {
      NProgress.start();
    };

    router.events.on("routeChangeStart", handleRouteChange);

    router.events.on("routeChangeComplete", () => NProgress.done());

    router.events.on("routeChangeError", () => nProgress.done());

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return <>{children}</>;
}
