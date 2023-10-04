import {
  Button,
  Card,
  Col,
  Layout,
  Row,
  Steps,
  Table,
  Typography,
  notification,
} from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import canceledOrder from "../component/Layout/Order/canceledOrder";
import { InfoCircleOutlined, ProfileOutlined } from "@ant-design/icons";
import ReceiptModal from "../component/Layout/Pay/receipt";
interface IProps {
  user: any;
}
interface Order {
  _id: string;
  order_number:string;
  quantity: number;
  order_id: string;
  food_id?: string;
  drink_id?: string;
  updatedAt: string;
  status: string;
  order_date: string;
  delivery_type: string;
  total_amount: number;
}

const myOrder = () => {
  const router = useRouter();
  const [CancelOrder, setCancelOrder] = useState({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState({});
  const [openReceipt, setOpenReceipt] = useState(false);
  const [food, setFood] = useState([
    {
      id: "",
      name: "",
    },
  ]);
  const [drink, setDrink] = useState([
    {
      id: "",
      name: "",
    },
  ]);
  const [drinkFilter, setDrinkFilter] = useState({
    where: {},
    query: "",
  });
  const [foodFilter, setFoodFilter] = useState({
    where: {},
    query: "",
  });

  const handleReceipt = async (order: Order) => {
    setOrderReceipt({ order });
    setOpenReceipt(true);
  };
  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_number",
      key: "order_number",
    },
    {
      title: "Food Name",
      dataIndex: "foodOrders",
      width: "15%",
      render: (foodOrders: any[]) => (
        <div>
          {foodOrders.map((foodOrder: any) => {
            const foodItem = food.find((item) => item.id === foodOrder.food_id);
            return (
              <Row key={foodOrder._id}>
                <Col span={20}>
                  <Typography>{foodItem?.name}</Typography>
                </Col>
                <Col span={4}>
                  <Typography> {foodOrder.quantity}</Typography>
                </Col>
              </Row>
            );
          })}
        </div>
      ),
    },
    {
      title: "Drink Name",
      dataIndex: "drinkOrders",
      width: "15%",
      render: (drinkOrders: any[]) => (
        <div>
          {drinkOrders.map((drinkOrder: any) => {
            const drinkItem = drink.find(
              (item) => item.id === drinkOrder.drink_id
            );
            return (
              <Row key={drinkOrder._id}>
                <Col span={20}>
                  <Typography>{drinkItem?.name}</Typography>
                </Col>
                <Col span={4}>
                  {" "}
                  <Typography>{drinkOrder.quantity}</Typography>
                </Col>
              </Row>
            );
          })}
        </div>
      ),
    },

    {
      title: "Order Date",
      dataIndex: "order_date",
      key: "order_date",
      render: (order_date: string) => (
        <Typography>{format(new Date(order_date), "dd-MM-yyyy")}</Typography>
      ),
    },
    {
      title: "Delivery Type",
      dataIndex: "delivery_type",
      key: "delivery_type",
    },
    {
      title: "Delivery Location",
      dataIndex: "delivery_location",
      key: "delivery_location",
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
      title: "Action", // ชื่อคอลัมน์สำหรับแสดงสัญลักษณ์การกระทำ
      dataIndex: "action", // ชื่อแฟ้มข้อมูลสำหรับเข้าถึงสถานะการชำระเงินของคำสั่งซื้อ
      key: "action", // คีย์ที่ไม่ซ้ำกันสำหรับคอลัมน์นี้
      render: (status: string, order: Order) => (
        <Row justify="center" gutter={8} style={{ width: "100%" }}>
          
            <Col span={10} onClick={() => handleReceipt(order)}>
             {status === "completed" && ( <ProfileOutlined style={{ fontSize: 18, color: "#10239e" }} />
            )}  </Col>
        
        </Row>
      ),
    },
  ];

  const queryMyOrder = async (filter: any) => {
    try {
      const result = await axios({
        method: "post",
        url: `/api/order/queryByMemberId`,
        data: filter,
      });

      if (result?.status === 200) {
        const combinedOrders = result?.data?.data?.combinedOrders || [];
        setOrders(combinedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      setOrders([]);
    }
  };

  const queryFood = async (filter: any) => {
    const result = await axios({
      method: "post",
      url: `/api/food/query`,
      data: filter,
    }).catch((err) => {
      if (err) {
        if (err?.response?.data?.message?.status === 401) {
          notification["error"]({
            message: "Query ข้อมูลไม่สำเร็จ",
            description: "กรุณาเข้าสู่ระบบ",
          });
          Cookies.remove("user");
          router.push("/loginEmployee");
        }
      }
    });
    if (result?.status === 200) {
      let foodData: any[] = [];
      result?.data?.data?.map((value: any) => {
        foodData.push({
          id: value._id,
          name: value?.name,
        });
      });

      setFood(foodData);
      console.log("Food", food);
    }
  };
  const queryDrink = async (filter: any) => {
    const result = await axios({
      method: "post",
      url: `/api/drink/query`,
      data: filter,
    }).catch((err) => {
      if (err) {
        if (err?.response?.data?.message?.status === 401) {
          notification["error"]({
            message: "Query ข้อมูลไม่สำเร็จ",
            description: "กรุณาเข้าสู่ระบบ",
          });
          Cookies.remove("user");
          router.push("/loginEmployee");
        }
      }
    });
    if (result?.status === 200) {
      let drinkData: any[] = [];
      result?.data?.data?.map((value: any) => {
        drinkData.push({
          id: value._id,
          name: value?.name,
        });
      });

      setDrink(drinkData);
      console.log("Drink", drink);
    }
  };

  const getStatusStep = (status: string, deliveryType: string) => {
    const stepsWithoutDelivered = [
      { title: "Pending" },
      { title: "Confirmed" },
      { title: "Preparing" },
      { title: "Ready" },
    ];

    const stepsWithDelivered = [
      ...stepsWithoutDelivered,
      { title: "Delivered" },
    ];

    const steps =
      deliveryType.toLowerCase() === "Delivery"
        ? stepsWithDelivered
        : stepsWithoutDelivered;

    const index = steps.findIndex(
      (step) => step.title.toLowerCase() === status.toLowerCase()
    );

    return index >= 0 ? index : 0;
  };

  const handleCancelOrder = async (order: Order) => {
    setCancelOrder({ order });
    setOpen(true);
  };
  useEffect(() => {
    const initialFilter = {};
    queryMyOrder(initialFilter);
  }, []);
  useEffect(() => {
    queryFood(foodFilter);
    queryDrink(drinkFilter);
  }, [foodFilter, setFoodFilter, drinkFilter, setDrinkFilter]);

  return (
    <Layout className="site-layout">
      <Row
        style={{ margin: "24px 16px 0" }}
        gutter={[24, 0]}
        justify={"center"}
      >
        <div
          style={{
            padding: 24,
            textAlign: "center",
            width: "100%",
          }}
        >
          {Object.values(orders).map((order) => {
            return (
              <div key={order.order_id} style={{ margin: 10 }}>
                {order.status !== "completed" &&
                  order.status !== "cancelled" && (
                    <>
                      <CardStyle>
                        <Row
                          style={{
                            alignItems: "start",
                            justifyContent: "space-between",
                          }}
                        >
                          <Col style={{ textAlign: "start", marginBottom: 30 }}>
                            <Typography.Text strong>
                              Order ID: {order.order_number}
                            </Typography.Text>
                          </Col>
                          <Col>
                            <Typography.Text strong>
                              จำนวนเงิน: {order.total_amount}฿
                            </Typography.Text>
                          </Col>
                        </Row>
                        <Row>
                          <Steps
                            current={getStatusStep(
                              order.status,
                              order.delivery_type
                            )}
                            items={
                              order.delivery_type.toLowerCase() === "Delivery"
                                ? [
                                    { title: "Pending" },
                                    { title: "Confirmed" },
                                    { title: "Preparing" },
                                    { title: "Ready" },
                                    { title: "Delivered" },
                                  ]
                                : [
                                    { title: "Pending" },
                                    { title: "Confirmed" },
                                    { title: "Preparing" },
                                    { title: "Ready" },
                                  ]
                            }
                            style={{
                              marginTop: 16,
                              marginBottom: 16,
                            }}
                          />
                        </Row>
                        <Row justify={"center"}>
                          {" "}
                          {(order.status === "confirmed" ||
                            order.status === "pending") && (
                            <Button
                              type="text"
                              style={{
                                color: "grey",
                                fontSize: 14,
                                marginTop: 20,
                              }}
                              onClick={() => handleCancelOrder(order)}
                            >
                              Cancel Order <InfoCircleOutlined />
                            </Button>
                          )}
                        </Row>
                      </CardStyle>
                    </>
                  )}
              </div>
            );
          })}

          <CardStyle
            bordered={false}
            title="Order History"
            style={{ marginTop: 20 }}
          >
            <Row>
              <Table
                style={{ fontSize: 14, width: "100%", overflowX: "auto" }}
                dataSource={Object.values(orders)}
                columns={columns}
                rowKey={(record: any) => record.order_id}
              />
            </Row>
          </CardStyle>
        </div>{" "}
      </Row>
      {canceledOrder(open, setOpen, CancelOrder)}
      {ReceiptModal(openReceipt, setOpenReceipt, orderReceipt)}
    </Layout>
  );
};
const CardStyle = styled(Card)`
  .ant-card-head-title {
    display: inline-block;
    flex: 1 1;
    padding: 16px 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: start;
    font-size: 18px;
    font-weight: bold;
  }
  box-shadow: 0px 20px 27px #0000000d;
  border-radius: 12px;
`;

export default myOrder;
