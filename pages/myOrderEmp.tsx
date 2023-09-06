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
import {
  AuditOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import Payment from "../component/Layout/Pay/Payment";
import { ObjectId } from "mongoose";
import ReceiptModal from "../component/Layout/Pay/receipt";
import checkProof from "../component/Layout/Pay/checkProof";
interface IProps {
  user: any;
}
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
  foodOrders: FoodOrder[]; // Add this property
  drinkOrders: DrinkOrder[]; // Add this property
  payment: PaymentStatus;
}

const myOrderEmp = () => {
  const router = useRouter();
  const [openpay, setOpenPay] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [CancelOrder, setCancelOrder] = useState({});
  const [open, setOpen] = useState(false);
  const [orderPayment, setOrderPayment] = useState({});
  const [orderReceipt, setOrderReceipt] = useState({});
  const [openReceipt, setOpenReceipt] = useState(false);
  const [orderCheckProof, setOrderCheckProof] = useState({});
  const [openCheckProof, setOpenCheckProof] = useState(false);
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
  const [member, setMember] = useState([
    {
      id: "",
      name: "",
      phone: "",
    },
  ]);
  const [memberFilter, setMemberFilter] = useState({
    where: {},
    query: "",
  });
  const [filter, setFilter] = useState({});

  const handlePayment = async (order: Order) => {
    setOrderPayment({ order });

    setOpenPay(true);
  };
  const handleCancelOrder = async (order: Order) => {
    setCancelOrder({ order });
    setOpen(true);
  };
  const handleReceipt = async (order: Order) => {
    setOrderReceipt({ order });
    setOpenReceipt(true);
  };
  const handleCompltedOrder = async (order: any) => {
    const result = await axios({
      method: "post",
      url: `/api/order/update`,
      data:  { id: order?._id, status: "completed" },
    }).catch((err) => {
      if (err) {
        console.log(err);
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
      notification["success"]({
        message: "ยืนยันรายการอาหารสำเร็จ",
      });
      queryMyOrder(filter);
    }
  };
  const handleCheckProofOrder = async (order: any) => {
    setOrderCheckProof({ order });
    setOpenCheckProof(true);
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

    // {
    //   title: "Order Date",
    //   dataIndex: "order_date",
    //   key: "order_date",
    //   render: (order_date: string) => (
    //     <Typography>{format(new Date(order_date), "dd/MM/yyyy")}</Typography>
    //   ),
    // },
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
      title: "Phone",
      dataIndex: "member_id",
      render: (_: any, record: any) => (
        <>
          {member?.map((value: any, index: number) => {
            if (value?.id === record?.member_id) {
              return <Typography key={index}>{value?.phone}</Typography>;
            }
          })}
        </>
      ),
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
      dataIndex: "status", // ชื่อแฟ้มข้อมูลสำหรับเข้าถึงสถานะการชำระเงินของคำสั่งซื้อ
      key: "action", // คีย์ที่ไม่ซ้ำกันสำหรับคอลัมน์นี้
      width: "15%",
      render: (status: string, order: Order, record: any) => (
        <Row justify="center" gutter={8} style={{ width: "100%" }}>
          <Col
            span={8}
            style={{ cursor: status !== "completed" ? "pointer" : "default" }}
            onClick={() => status !== "completed" && handlePayment(order)}
          >
            {status === "canceled" ? (
              <CloseCircleOutlined style={{ fontSize: 18, color: "#FFA500" }} />
            ) : status !== "completed" ? (
              <DollarOutlined style={{ fontSize: 18, color: "#FF4D4F" }} />
            ) : (
              <DollarOutlined style={{ fontSize: 18, color: "#52C41A" }} />
            )}
          </Col>
          <Col span={8} onClick={() => handleReceipt(order)}>
            <ProfileOutlined style={{ fontSize: 18, color: "#10239e" }} />
          </Col>
          <Col span={8}>
            {order?.payment.payment_status === "รอการชำระเงิน" ? (
              <CheckOutlined
                style={{ color: "#a0d911" }}
                onClick={() => handleCompltedOrder(order)}
              />
            ) : (
              <AuditOutlined onClick={() => handleCheckProofOrder(order)} />
            )}
          </Col>
        </Row>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "payment",
      render: (payment: PaymentStatus) => (
        <Typography>{payment.payment_status}</Typography>
      ),
    },
  ];
  const queryMyOrder = async (filter: any) => {
    try {
      const result = await axios({
        method: "post",
        url: `/api/order/queryByEmployeeId`,
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
    }
  };
  const queryByMemberId = async (filter: any) => {
    
    const result = await axios({
      method: "post",
      url: `/api/member/query`,
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
      let memberData: any[] = [];
      result?.data?.data?.map((value: any) => {
        memberData.push({
          id: value._id,
          name: value?.name,
          phone: value?.phone,
        });
      });

      setMember(memberData);
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

  useEffect(() => {
    queryMyOrder(filter);
    queryByMemberId(filter)
  }, [filter, setFilter]);
  
  useEffect(() => {
    queryFood(foodFilter);
    queryDrink(drinkFilter);
    queryByMemberId(memberFilter);
  }, [
    foodFilter,
    setFoodFilter,
    drinkFilter,
    setDrinkFilter,
    memberFilter,
    setMemberFilter,
  ]);

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
                            order.status === "pending" ||
                            order.status === "preparing") && (
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
          
              <Table
                style={{ fontSize: 14, width: "100%", overflow: "auto" }}
                dataSource={Object.values(orders)}
                columns={columns}
                rowKey={(record: any) => record.order_id}
              />
   
          </CardStyle>
        </div>{" "}
      </Row>
      {canceledOrder(open, setOpen, CancelOrder)}
      {Payment(openpay, setOpenPay, orderPayment)}
      {ReceiptModal(openReceipt, setOpenReceipt, orderReceipt)}
      {checkProof(openCheckProof, setOpenCheckProof, orderCheckProof)}
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
  margin: 20px;
  box-shadow: 0px 20px 27px #0000000d;
  border-radius: 12px;
`;

export default myOrderEmp;
