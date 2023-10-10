import React, { useEffect, useState } from "react";
import {
  BarsOutlined,
  DollarOutlined,
  LogoutOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  Avatar,
  Badge,
  Col,
  Layout,
  Menu,
  MenuProps,
  Row,
  Space,
  Typography,
  notification,
  theme,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

const { Sider } = Layout;

interface IProps {
  user: any;
}
interface Order {
  status: string;
}

const KitchenStaff: React.FC<IProps> = (props) => {
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
    (order) => order.status === "confirmed"
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
      label: (
        <Badge
          count={confirmedOrders.length}
          size="small"
          offset={[5, 0]}
          style={{ fontSize: 10 }}
        >
          <Link href="../kitchen">Order</Link>
        </Badge>
      ),
      key: "kitchen",
      icon: <BarsOutlined />,
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
          <Avatar size="large" src={props?.user?.image} />
          <Space align="center">
            <Col style={{ marginLeft: 15 }}>
              <Typography style={{ fontWeight: "bold" }}>
                {" "}
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

export default KitchenStaff;
