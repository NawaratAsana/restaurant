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

// import employee from "../../pages/employee";
import Link from "next/link";
import Static from "../../pages/static";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Avatar, Col, Divider, Layout, Menu, MenuProps, Row, Space, Typography, notification } from "antd";

const { Header, Content, Footer, Sider } = Layout;

interface IProps {
  user: any;
}

const Dashboard: React.FC<IProps> = (props) => {
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
      label: <Link href="../static">Dashboard</Link>,
      key: "dashboard",
      icon: <PieChartOutlined />,
    },
    {
      label: <Link href="../incomeReport">Report</Link>,
      key: "revenue",
      icon: <DollarOutlined />,
    },
    {
      label: <Link href="../food">Food</Link>,
      key: "food",
      icon: <UnorderedListOutlined />,
    },
    {
      label: <Link href="../drink">Beverage</Link>,
      key: "drink",
      icon: <CoffeeOutlined />,
    },
    {
      label: <Link href="../employee">Employee</Link>,
      key: "employee",
      icon: <TeamOutlined />,
    },
    {
      label: <Link href="../profileEmp">Profile</Link>,
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
          // position: "fixed",
          // left: 0,
          // top: 0,
          // bottom: 0,
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
        <DividerStyled />
        <Menu
          theme="light"
          mode="inline"
          items={items}
          style={{ flex: "auto", minWidth: 0 }}
        />
      </Sider>
    </>
  );
};
const DividerStyled = styled(Divider)`
  display: flex;
  clear: both;
  width: 100%;
  min-width: 100%;
  height: 2px !important;
  // background: #064595 !important;
  margin: 0px !important;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;
export default Dashboard;
