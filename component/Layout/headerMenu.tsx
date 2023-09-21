import { Avatar, Button, Dropdown, Layout, Menu, notification } from "antd";

import Link from "next/link";
import React, { Children, useEffect, useState } from "react";
import styled from "styled-components";
import {

  MenuOutlined,

} from "@ant-design/icons";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

const { Header, Content, Footer } = Layout;
interface IProps {
  user: any;
}
interface MenuItem {
  label: JSX.Element;
  key: string;
  position?: string;
}
const HeaderMenu: React.FC<IProps> = (props) => {

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
  const itemsMenu = [
    {
      label: <Link href="../">Home</Link>,
      key: "home",
    },
    {
      label: <Link href="../menu">Menu</Link>,
      key: "menu",
    },
    
  ];
  if (props.user !== undefined) {
    itemsMenu.push(
      {
        label: (
          <Link href="../myOrder"  >My Order</Link>
        ),
        key: "order",
      },
      {
        label: (
          <LogoutLink onClick={Logout} style={{ justifyContent: "right" }}>
            Log out
          </LogoutLink>
        ),
        key: "logout",
      },
      {
    
        label: (
          <Link href="../profileMember">
            {" "}
            <Avatar
              size={36}
              src={<img src={props?.user?.image} alt="avatar" />}
            />
          </Link>
        ),
        key: "profile",
      }
    );
  } else {
    itemsMenu.push({
      label: (
        <Link href="../login" style={{ justifyContent: "right" }}>
          Log In
        </Link>
      ),
      key: "signin",
    });
  }

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const router = useRouter();

  const mobileMenu = (
    <Menu >
      {itemsMenu.map((item) => (
        <Menu.Item key={item.key}>{item.label}</Menu.Item>
      ))}
    </Menu>
  );
  return (

      <HeaderStyled>
        <img src="../images/logo.png" width={"100px"} height={"100px"} />
        {isMobile ? (
          // Mobile Menu
          <Dropdown overlay={mobileMenu}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              style={{ display: "flex", alignItems: "center" }}
            />
          </Dropdown>
        ) : (
          // Desktop Menu
          <StyledMenu
            items={itemsMenu}
            mode="horizontal"
            style={{
              fontSize: 16,
              // alignmentBaseline: "middle",
            }}
          />
        )}
      </HeaderStyled>
  
  );
};
const LogoutLink = styled.span`
  cursor: pointer;
`;
const HeaderStyled = styled(Header)`
  // width: 100%;
  // z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;

`;
const StyledMenu = styled(Menu)`
  display: flex;
  background: #fff;
  justify-content: center;
`;
export default HeaderMenu;
