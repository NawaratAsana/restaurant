import { Badge, Button, Col, Input, Row, notification } from "antd";
import { Header } from "antd/lib/layout/layout";

import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import loginModal from "./Login/loginModal";

interface IProps {
  user: any;
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
      router.push("/login");
    }
  };
  const [count, setCount] = useState(5);
  const { Search } = Input;
  const onSearch = (value: string) => console.log(value);
  const increase = () => {
    setCount(count + 1);
  };

  const decline = () => {
    let newCount = count - 1;
    if (newCount < 0) {
      newCount = 0;
    }
    setCount(newCount);
  };
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <HeaderStyled>
        <Row justify="space-evenly" align="middle" style={{ width: "100%" }}>
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

          <Search
            placeholder="search your item"
            onSearch={onSearch}
            style={{ width: 200, borderRadius: "20px" }}
          />
          <Badge count={count}>
            <ShoppingCartOutlined style={{ fontSize: "32px", color: "#fff" }} />
          </Badge>

          <Link href="../login">
            <ButtonStyled type="primary">Sign In</ButtonStyled>{" "}
          </Link>
        </Row>
      </HeaderStyled>
    </>
  );
};
const HeaderStyled = styled(Header)`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1;
  height: 13%;
  background: #135200;
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
