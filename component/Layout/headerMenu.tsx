import {
  Avatar,
  Badge,
  Button,
  Col,
  Input,
  Layout,
  Menu,
  MenuProps,
  Row,
  Space,
  Typography,
  notification,
} from "antd";

import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { url } from "inspector";

const { Header, Content, Footer } = Layout;
interface IProps {
  user: any;
}

const HeaderMenu: React.FC<IProps> = (props) => {
  const url =
    "https://scontent.fbkk31-1.fna.fbcdn.net/v/t39.30808-6/324118416_861270558464645_6961181744644976122_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeGm4me1WHoZ7uU9G4EEdD7PC_N1ytAdvhcL83XK0B2-F6wMhPukpeW7-Xrwi1uvl1H8SLoWIBvcfm7eUudQUUIF&_nc_ohc=7FSW4a51Mg0AX9wl9gq&_nc_ht=scontent.fbkk31-1.fna&oh=00_AfBYe5dsOS9QNZg9XxiqTAOyt8PEeYm9b7W31GBiS8M6sg&oe=643406AF";
  const Logout = async () => {
    const result = await axios({
      method: "post",
      url: `/api/auth/logout`,
      data: { _id: props?.user?.id },
    }).catch((err) => {
      if (err) {
        console.log(err);
      }
    });
    if (result?.status === 200) {
      Cookies.remove("user");
      notification["success"]({
        message: "success",
      });
      router.push("/");
    }
  };
  const [count, setCount] = useState(5);

  const decline = () => {
    let newCount = count - 1;
    if (newCount < 0) {
      newCount = 0;
    }
    setCount(newCount);
  };
  const items: MenuProps["items"] = [
  
    {
      label: <Link href="../">หน้าหลัก</Link>,
      key: "",
    },
    {
      label: <Link href="../food">อาหาร</Link>,
      key: "food",
    },
    {
      label: <Link href="../drink">เครื่องดื่ม</Link>,
      key: "drink",
    },
    {
      label: (
        <Badge count={count}>
          <ShoppingCartOutlined style={{ fontSize: "32px", color: "#fff" }} />
        </Badge>
      ),
      key: "employee",
    },
    {
      label: (
        <Link href={"../"} style={{ float: "right" }}>
          {props?.user !== undefined ? (
            <Row>
              <Space align="center">
                <Avatar
                  // size={{ xs: 24, sm: 32, md: 40, lg: 48, xl: 60, xxl: 70 }}
                  size="large"
                  src={<img src={url} alt="avatar" />}
                />
              </Space>
              <Typography
                style={{
                  color: "#fff",
                  marginLeft: 10,
                }}
              >
                {props?.user?.name}
              </Typography>
            </Row>
            
          ) : (
            <Link href="../login">
              <Button type="primary">Sign In</Button>{" "}
            </Link>
          )}
        </Link>
      ),
      key: "profile",
      children:[
        {
          label:"ประวัติส่วนตัว",
          key:"profile"
        },
        {
          label:<Typography onClick={Logout} style={{color:'#fff'}}>ออกจากระบบ</Typography>,
          key:"logout"
        }

      ]
    },
  ];
  const router = useRouter();

  return (
    <Layout>
      <HeaderStyled className="header">
        {/* <Row justify="space-evenly" align="middle" style={{ width: "100%" }}>
          <Link href="../">
            <img
              style={{ width: "100%", height: "120px", marginTop: "-10px" }}
              src="../images/logo2.png"
              alt="logo"
            />
          </Link>

          <LinkStyled href="../">Home</LinkStyled>
          <LinkStyled href="../food">Food</LinkStyled>
          <LinkStyled href="../drink">Beverage</LinkStyled>

          
          <Badge count={count}>
            <ShoppingCartOutlined style={{ fontSize: "32px", color: "#fff" }} />
          </Badge>
          {props?.user !== undefined ? (
            <Row>
                <Space align="center">
              <Avatar
                // size={{ xs: 24, sm: 32, md: 40, lg: 48, xl: 60, xxl: 70 }}
                size="large"
                src={<img src={url} alt="avatar" />}
              /></Space>
              <TextStyled>{props?.user?.name}</TextStyled>
            </Row>
          ) : (
            // Render a Typography component with the user's name if user prop is defined

            // Render a Link component that navigates to "../login" path and a ButtonStyled component if user prop is undefined
            <Link href="../login">
              <ButtonStyled type="primary">Sign In</ButtonStyled>{" "}
            </Link>
          )}
        </Row> */}
        <div className="logo" />

        <Menu
          theme="dark"
          mode="horizontal"
          items={items}
          style={{
            fontSize: 16,
            justifyContent: "space-evenly",
            alignmentBaseline: "middle",
          }}
        />
      </HeaderStyled>
    </Layout>
  );
};

const HeaderStyled = styled(Header)`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1;
  // height: 100px;
`;
const ButtonStyled = styled(Button)`
  border-radius: 10px;
  background: #faad14;
  border-color: #faad14;
  font-size: 16px;
  height: auto;
  width: 120px;
`;
const LinkStyled = styled(Link)`
  font-size: 16px;
  color: #fff;
`;

export default HeaderMenu;
