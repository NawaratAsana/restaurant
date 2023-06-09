import React from "react";
import {
  CoffeeOutlined,
  DollarOutlined,
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
} from "antd";
import { Layout, Menu, theme } from "antd";
// import employee from "../../pages/employee";
import Link from "next/link";
import Static from "../../pages/static";
import MenuItem from "antd/lib/menu/MenuItem";

const { Header, Content, Footer, Sider } = Layout;

interface IProps {
  user: any;
}


const OrderTaker: React.FC<IProps> = (props) => {
  
  const items: MenuProps["items"] = [
    {
      label: <Link href="../static">order</Link>,
      key: "order",
      icon: <PieChartOutlined />,
    },
    {
      label: <Link href="../#">Pay</Link>,
      key: "pay",
      icon: <DollarOutlined />,
    },
  
   
    {
      label: <Link href="../profile">Profile</Link>,
      key: "profile",
      icon: <UserOutlined />,
    },
  ];
  console.log("items>>>>>>", items);
  return (
    <Layout>
      <Sider
        theme="light"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
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
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
           <Space align="center">
          <Col style={{ marginLeft: 15 }}>
         
            <Typography style={{ fontWeight: "bold" }}> {props?.user?.name}</Typography>
  
          </Col>
          </Space>
        </Row>

        <Menu theme="light" mode="inline" items={items} />
      </Sider>
    </Layout>
  );
};

export default OrderTaker;
