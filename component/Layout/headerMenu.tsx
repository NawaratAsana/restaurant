import {
  Avatar,
  Badge,
  Button,
  Col,
  Dropdown,
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
import React, { Children, useState } from "react";
import styled from "styled-components";
import {
  LogoutOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { url } from "inspector";
import SubMenu from "antd/lib/menu/SubMenu";

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
  const itemsMenu: MenuProps["items"] = [
    {
      label: <Link href="../">หน้าหลัก</Link>,
      key: "home",
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
          <ShoppingCartOutlined style={{ fontSize: "30px", color: "#fff" }} />
        </Badge>
      ),
      key: "employee",
    },
    {
      label: (
        <Link href={"../"} style={{ float: "right" }}>
          {props?.user !== undefined ? (
            <> <Link href="../profileMember">
            <Button type="primary">ประวัติ</Button>
          </Link>
         
            <Button type="primary" onClick={Logout}> ออกจากระบบ</Button>
          </>
          
          ) : (
            <Link href="../login">
              <Button type="primary">Sign In</Button>
            </Link>
          )}
        </Link>
      ),
      key: "signin",

    },
  ];
  const router = useRouter();

  return (
    <Layout>
      <HeaderStyled className="header">
        <div className="logo" />

         <Menu
          theme="dark"
          mode="horizontal"
          items={itemsMenu}
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
