import React from "react";
import {
  CoffeeOutlined,
  DollarOutlined,
  LogoutOutlined,
  PieChartOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Col,
  MenuProps,
  Row,
  Space,
  Typography,
  notification,
} from "antd";
import { Layout, Menu, theme } from "antd";
import Link from "next/link";
import Static from "../../pages/static";
import MenuItem from "antd/lib/menu/MenuItem";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const { Header, Content, Footer, Sider } = Layout;

interface IProps {
  user: any;
}

const OrderTaker: React.FC<IProps> = (props) => {
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
      router.push("/");
    }
  };
  const items: MenuProps["items"] = [
    {
      label: <Link href="../menu">Menu</Link>,
      key: "menu",
      icon: <DollarOutlined />,
    },
    {
      label: <Link href="../orderEmployee">Order</Link>,
      key: "orderEmployee",
      icon: <PieChartOutlined />,
    },
    {
      label: <Link href="../myOrderEmp">My Order</Link>,
      key: "myOrderEmp",
      icon: <PieChartOutlined />,
    },
    {
      label: <Link href="../profileEmp">Profile</Link>,
      key: "profileEmp",
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
          width: "100%", // Added width to occupy full screen on small devices
          maxWidth: "300px", // Added max-width to limit width on larger screens
        }}
      >
        <Row
          style={{
            height: 32,
            margin: 16,
          }}
        >
          <Avatar size="large" src={props?.user?.image} />
          <Space align="center">
            <Col style={{ marginLeft: 15 }}>
              <Typography style={{ fontWeight: "bold" }}>
                {props?.user?.name}
              </Typography>
            </Col>
          </Space>
        </Row>

        <Menu theme="light" mode="inline" items={items} />
      </Sider>
    </>
  );
};

export default OrderTaker;
