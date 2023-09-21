
import React, { useEffect, useState } from "react";


import { useRouter } from "next/router";
import { Card, Col, Layout, Row, Table, Typography, notification } from "antd";
import styled from "styled-components";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { DollarOutlined } from "@ant-design/icons";
import MonthlyRevenueChart from "../component/Layout/Dashboard/MonthlyRevenueChart";

interface FoodOrder {
  _id: string;
  quantity: number;
  order_id: string;
  food_id: string;
  createdAt: string;
  updatedAt: string;
}

interface DrinkOrder {
  _id: string;
  quantity: number;
  order_id: string;
  drink_id: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentStatus {
  _id: string;
  order_id: string;
  payment_status: string;
  createdAt: string;
  updatedAt: string;
}
interface Order {
  _id: string;
  order_number: string;
  quantity: number;
  order_id: string;
  updatedAt: string;
  status: string;
  member_id: string;
  order_date: string;
  total_amount: number;
  delivery_type: string;
  foodOrders: FoodOrder[];
  drinkOrders: DrinkOrder[];
  payment: PaymentStatus;
}
const Static = () => {
  const { Title, Text } = Typography;
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
      setOrders(result?.data?.data?.combinedOrders);
      console.log("Ordes", orders);
    } else {
      setOrders([]);
    }
  };

  const today = new Date(); // วันที่ปัจจุบัน


  // นับจำนวน order ที่สำเร็จและมียอดชำระเงินแล้ว ในวันนี้
  const completedOrdersToday = Object.values(orders).filter(
    (order) =>
      order.status === "completed" &&
      order.payment.payment_status === "ชำระเงินแล้ว" &&
      new Date(order.order_date).toDateString() === today.toDateString()
  );
  
  // นับจำนวน order ที่ยกเลิก ในวันนี้
  const canceledOrdersToday = Object.values(orders).filter(
    (order) =>
      order.status === "cancelled" &&
      order.payment.payment_status === "ยกเลิก" &&
      new Date(order.order_date).toDateString() === today.toDateString()
  );
  // นับจำนวน order ที่สำเร็จและมียอดชำระเงินแล้วในเดือนปัจจุบัน
  const currentMonth = new Date().getMonth(); // เดือนปัจจุบัน (0 = มกราคม, 1 = กุมภาพันธ์, ... , 11 = ธันวาคม)
  const currentYear = new Date().getFullYear(); // ปีปัจจุบัน

  const completedOrdersInCurrentMonth = Object.values(orders).filter(
    (order) =>
      order.status === "completed" &&
      order.payment.payment_status === "ชำระเงินแล้ว" &&
      new Date(order.order_date).getMonth() === currentMonth &&
      new Date(order.order_date).getFullYear() === currentYear
  );



  const OrdersToday = Object.values(orders).filter(
    (order) =>
      new Date(order.order_date).toDateString() === today.toDateString()
  );


  // คำนวณจำนวนเงินรวมจากออเดอร์ที่สำเร็จและมียอดชำระเงินแล้ว ในวันนี้
  const totalRevenueToday = completedOrdersToday.reduce(
    (total, order) => total + order.total_amount,
    0
  );

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_number",
      key: "order_number",
    },
 
    {
      title: "Delivery Type",
      dataIndex: "delivery_type",
      key: "delivery_type",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Payment Status",
      dataIndex: "payment",
      render: (payment: PaymentStatus) => (
        <Typography>{payment.payment_status}</Typography>
      ),
    },
  ];

  const [filter, setFilter] = useState({});


  useEffect(() => {

    QueryOrder(filter);
  }, [filter,setFilter]);

  const count = [
    {
      today: "Today’s Revenue",
      title: totalRevenueToday,

      icon: <DollarOutlined />,
      bnb: "bnb2",
    },
    {
      today: "Today’s Order",
      title: completedOrdersToday.length,
      icon: <DollarOutlined />,
      bnb: "bnb2",
    },

    {
      today: "Today’s Canceled",
      title: canceledOrdersToday.length,
      icon: <DollarOutlined />,
      bnb: "bnb2",
    },
    {
      today: "Total Revenue",
      title: completedOrdersInCurrentMonth.reduce((total, order) => total + order.total_amount, 0),
      icon: <DollarOutlined />,
      bnb: "bnb2",
    }
    
  ];

  
  return (
    <Layout>
      <div
        style={{
          padding: 24,
          textAlign: "center",
        }}
      >
        <Row gutter={[24, 0]} style={{marginLeft:20}}>
          <Typography.Text strong style={{ fontSize: 30, marginLeft: 10 }}>
            Dashboard
          </Typography.Text>
        </Row>
        <Row gutter={[24, 0]}>
          {count.map((c, index) => (
            <Col key={index} xs={24} sm={24} md={12} lg={6} xl={6}>
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>{c.today}</span>
                      <Title level={3}>
                        {c.title} <small className={c.bnb}></small>
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{c.icon}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <Row gutter={[24, 0]} style={{ marginTop: 20 }}>
        <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
           
            <Card bordered={false} className="criclebox h-full" title="Order Today">
              <Table
                style={{ fontSize: 14, width: "100%", overflowX: "auto" }}
                dataSource={OrdersToday}
                columns={columns}
                rowKey={(record: any) => record.order_id} // Add rowKey prop here
                pagination={{ pageSize: 3 }}
              />{" "}
            
            </Card>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card
              bordered={false}
              className="criclebox h-full"
              title="Revenue"
            >
                <MonthlyRevenueChart orders={completedOrdersInCurrentMonth} />
            </Card>
          </Col>
        
        </Row>
      </div>
    </Layout>
  );
};

const TextStyle1 = styled(Typography)`
  font-weight: bolder;
  font-size: 20px;
`;
const TextStyle = styled(Typography)`
  font-weight: bolder;
  font-size: 20px;
  float: left;
`;
const CardStyle = styled(Card)`
  border-radius: 10px;
  // width: 300px;
  // max-width: 400px;
  margin: auto;
`;
const CardStyle1 = styled(Card)`
  border-color: #d9d9d9;
  border-radius: 10px;

  .ant-card-head-title {
    font-weight: bolder;
    font-size: 20px;
    text-align: left;
  }
`;

export default Static;
