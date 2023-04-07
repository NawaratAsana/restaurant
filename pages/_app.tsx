import { Layout, Typography } from "antd";
import "../styles/globals.css";
import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";
import HeaderMenu from "../component/Layout/headerMenu";
import App from "next/app";
import Dashboard from "../component/Layout/dashboard";
import Cookies from "next-cookies";

function MyApp({ Component, pageProps, user }: any) {
  const router = useRouter();
  // console.log("user>>>>>>>>>", user);
  return (
    <>
      <Layout style={{ height: "100vh" }}>
        <Head>
          <title>BuaKhao Restaurant</title>
          <link rel="icon" type="image/x-icon" href="/logo.ico"></link>
        </Head>
        {router.pathname === "/login" ||
        router.pathname === "/register" ||
        router.pathname === "/loginEmployee" ? null : (
          <>
            {user === undefined ? (
              <HeaderMenu user={undefined} />
            ) : (
              <>
                {user?.role === "63f512a60e947c18f97769a0" ? (
                  <HeaderMenu user={user} />
                ) : user?.role === "63f5124b0e947c18f977699d" ? (
                  <Dashboard user={user} />
                ) : user?.role === "63f512730e947c18f977699e" ? (
                  <Dashboard user={user} />
                ) : user?.role === "63f512930e947c18f977699f" ? (
                  <Dashboard user={user} />
                ) : null}

              
              </>
            )}
          </>
        )}

        <Component {...pageProps} />
      </Layout>
    </>
  );
}
MyApp.getInitialProps = async (context: any) => {
  const appProps: any = await App.getInitialProps(context);
  const { user } = Cookies(context.ctx);
  console.log("user>>>>>>>>>", user);
  return { ...appProps, user: user };
};
export default MyApp;
