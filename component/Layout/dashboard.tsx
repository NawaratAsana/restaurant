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

const items: MenuProps["items"] = [
  {
    label: <Link href="../static">Dashboard</Link>,
    key: "dashboard",
    icon: <PieChartOutlined />,
  },
  {
    label: <Link href="../#">Revenue</Link>,
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
    key: "beverage",
    icon: <CoffeeOutlined />,
  },
  {
    label: <Link href="../employee">Employee</Link>,
    key: "employee",
    icon: <TeamOutlined />,
  },
  {
    label: <Link href="../profile">Profile</Link>,
    key: "profile",
    icon: <UserOutlined />,
  },
];
console.log("items>>>>>>", items);
const Dashboard: React.FC<IProps> = (props) => {
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
          <Col style={{ marginLeft: 15 }}>
            <Typography style={{ fontWeight: "bold" }}> name</Typography>
            <Typography>role</Typography>
          </Col>
        </Row>

        <Menu theme="light" mode="inline" items={items} />
      </Sider>
    </Layout>
  );
};

export default Dashboard;
