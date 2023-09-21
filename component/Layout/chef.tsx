import React from "react";
import {
  DollarOutlined,
  LogoutOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Avatar, Col, Layout, Menu, MenuProps, Row, Space, Typography, notification, theme } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";


const { Header, Content, Footer, Sider } = Layout;

interface IProps {
  user: any;
}


const KitchenStaff: React.FC<IProps> = (props) => {
  const router = useRouter();
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
      router.push("/loginEmployee");
    }
  };
  const items: MenuProps["items"] = [
    {
      label: <Link href="../kitchen">Order</Link>,
      key: "kitchen",
      icon: <PieChartOutlined />,
    }, 
    {
      label: <Link href="../profile">Profile</Link>,
      key: "profile",
      icon: <UserOutlined />,
    },
    {
      label: <Typography onClick={Logout}>Logout</Typography>,
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <>
      <Sider
        theme="light"
        style={{
          overflow: "auto",
          width: "100%", 
          maxWidth: "300px",
        }}
      >
        <Row
          style={{
            height: 32,
            margin: 16,
          }}
        >
          <Avatar
            size="large"
            src={props?.user?.image} 
          />
           <Space align="center">
          <Col style={{ marginLeft: 15 }}>
         
            <Typography style={{ fontWeight: "bold" }}> {props?.user?.name}</Typography>
  
          </Col>
          </Space>
        </Row>

        <Menu theme="light" mode="inline" items={items} />
      </Sider>
    </>
  );
};

export default KitchenStaff;
