import React, { useEffect, useState } from "react";
import {

  BarsOutlined,
  BookOutlined,
  CarryOutOutlined,
  DollarOutlined,
  LogoutOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Col,
  MenuProps,
  Row,
  Space,
  Typography,
  notification,
} from "antd";
import { Layout, Menu, theme } from "antd";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const { Sider } = Layout;

interface IProps {
  user: any;
}
interface Order {
  status: string;
}
const OrderTaker: React.FC<IProps> = (props) => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  const QueryOrder = async (filter: any) => {
    const result = await axios({
      method: "post",
      url: `/api/order/query`,
      data: filter,
    }).catch((err) => {
      if (err) {
        if (err?.response?.data?.message?.status === 401) {
          notification["error"]({
            message: "Query ข้อมูลไม่สำเร็จ",
            description: "กรุณาเข้าสู่ระบบ",
          });
          Cookies.remove("user");
          router.push("/login");
        }
      }
    });

    if (result?.status === 200) {
      // setOrders(result?.data?.data);
      setOrders(result?.data?.data?.combinedOrders);
    } else {
      setOrders([]);
    }
  };
  useEffect(() => {
    const initialFilter = {};
    QueryOrder(initialFilter);
  }, []);
  const confirmedOrders = Object.values(orders).filter(
    (order) => order.status === "pending"
  );
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
      label: <Link href="../menu">Menu</Link>,
      key: "menu",
      icon: <BookOutlined />,
    },
    {
      label:  <Badge
      count={confirmedOrders.length}
      size="small"
      offset={[5, 0]}
      style={{ fontSize: 10 }}
    > <Link href="../orderEmployee">Orders</Link></Badge>,
      key: "orderEmployee",
      icon: <BarsOutlined />,
    },
    {
      label: <Link href="../myOrderEmp">Responsibilities</Link>,
      key: "myOrderEmp",
      icon: <CarryOutOutlined />,
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
