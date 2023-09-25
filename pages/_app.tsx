

// import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";
import HeaderMenu from "../component/Layout/headerMenu";
import App from "next/app";
import Dashboard from "../component/Layout/dashboard";
import Cookies from "next-cookies";
import OrderTaker from "../component/Layout/waiter";
import KitchenStaff from "../component/Layout/chef";
import '../styles/globals.css';
import "antd/dist/reset.css";
import { ConfigProvider, Layout } from "antd";

function MyApp({ Component, pageProps, user }: any) {
  const router = useRouter();

  return (
    <ConfigProvider
    theme={{
      token: {
        fontFamily: "Sarabun"
      }
    }}
  >
      <Layout style={{ height: "100vh" }}>
     <div><Head>
          <title>BuaKhao Restaurant</title>
          <link rel="icon" type="image/x-icon" href="/logo.ico"></link>
        </Head> 
  
 
    </div>
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
                ) : user?.position_id === "63c90d2f5b5a03c61bd0118e" ? (
                  <Dashboard user={user} />
                ) : user?.position_id === "63c90d7a5b5a03c61bd01192" ? (
                  <KitchenStaff user={user} />
                ) : user?.position_id === "63c90d725b5a03c61bd01190" ? (
                  <OrderTaker user={user} />
                ) : null}

              
              </>
            )}
          </>
        )} 

        <Component {...pageProps} />
      </Layout>    </ConfigProvider>
    
  );
}
MyApp.getInitialProps = async (context: any) => {
  const appProps: any = await App.getInitialProps(context);
  const { user } = Cookies(context.ctx);
  // console.log("user>>>>>>>>>", user);
  return { ...appProps, user: user };
};
export default MyApp;
