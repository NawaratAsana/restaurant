import { CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Layout,
  Row,
  Table,
  Typography,
  notification,
} from "antd";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import styled from "styled-components";

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

interface Order {
  _id: string;
  order_number:string;
  quantity: number;
  order_id: string;
  food_id?: string;
  drink_id?: string;
  member_id: string;
  employee_id: string;
  updatedAt: string;
  status: string;
  order_date: string;
  total_amount: number;
  delivery_type: string;
  delivery_location: string;
  foodOrders: FoodOrder[]; // Add this property
  drinkOrders: DrinkOrder[]; // Add this property
}
const kitchen = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
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
  const [filter, setFilter] = useState({});
  const handlePreparingOrder = async (order: any) => {
    const result = await axios({
      method: "post",
      url: `/api/order/update`,
      data: { id: order?._id, status: "preparing" }, // Pass the updatedOrder object as the data
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
      QueryOrder(filter);
    }
  };
  const handleReadyOrder = async (order: any) => {
    const result = await axios({
      method: "post",
      url: `/api/order/update`,
      data: { id: order?._id, status: "ready" }, // Pass the updatedOrder object as the data
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
        message: "จัดเตรียมอาหารสำเร็จ",
      });
      QueryOrder(filter);
    }
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

    {
      title: "Order Date",
      dataIndex: "order_date",
      key: "order_date",
      render: (order_date: string) => (
        <Typography>{format(new Date(order_date), "HH:MM")}</Typography>
      ),
    },
    {
      title: "Delivery Type",
      dataIndex: "delivery_type",
      key: "delivery_type",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      
      render: (_: any, record: any) => (
        <Row justify="center" gutter={8} style={{ width: "100%" }}>
          <Col span={10}>
            <CheckOutlined
              style={{ color: "#a0d911" }}
              onClick={() => handleReadyOrder(record)} 
            />
          </Col>
        </Row>
      ),
    },
  ];

  useEffect(() => {
    queryFood(foodFilter);
    queryDrink(drinkFilter);
  }, [foodFilter, setFoodFilter, drinkFilter, setDrinkFilter]);

  useEffect(() => {
    const initialFilter = {};
    QueryOrder(initialFilter);
  }, []);

  const confirmedOrders = Object.values(orders).filter(
    (order) => order.status === "confirmed"
  );
  const preparingOrders = Object.values(orders).filter(
    (order) => order.status === "preparing"
  );
  return (
    <Layout style={{ width: "100%", padding: 20 }}>
      <TextStyle.Text strong style={{ fontSize: 30, margin: 30 }}>
        รายการสั่งอาหาร
      </TextStyle.Text>
      <Row gutter={[24, 24]} style={{ margin: 20 }}>
        {Object.values(confirmedOrders).map((orderItem) => (
          <ResponsiveCol xs={24} sm={12} md={8}>
            <CardStyle
              delivery_type={orderItem.delivery_type}
              key={orderItem.order_id}
              bordered={false}
            >
              <div className="ant-card-head-title">
                <TextStyle>Order ID: {orderItem.order_number}</TextStyle>
              </div>

              <div className="card-content">
                <TextStyle>
                  Order Time: {moment(orderItem.order_date).format("HH:mm")} น.
                </TextStyle>
                <TextStyle>Delivery Type: {orderItem.delivery_type}</TextStyle>
                <TextStyle>Orders:</TextStyle>
                <ul>
                  {orderItem.foodOrders.map((foodOrder) => {
                    const foodItem = food.find(
                      (item) => item.id === foodOrder.food_id
                    );
                    return (
                      <li key={foodOrder._id}>
                        {foodItem?.name} ( {foodOrder.quantity} )
                      </li>
                    );
                  })}
                  {orderItem.drinkOrders.map((drinkOrder) => {
                    const drinkItem = drink.find(
                      (item) => item.id === drinkOrder.drink_id
                    );
                    return (
                      <li key={drinkOrder._id}>
                        {drinkItem?.name} ( {drinkOrder.quantity} )
                      </li>
                    );
                  })}
                </ul>

                <ButtonContainer>
                  <CustomPrimaryButton
                    type="primary"
                    style={{}}
                    onClick={() => handlePreparingOrder(orderItem)}
                  >
                    Preparing Order
                  </CustomPrimaryButton>
                </ButtonContainer>
              </div>
            </CardStyle>
          </ResponsiveCol>
        ))}
      </Row>
      <CardStyleTable
        bordered={false}
        title="Order Preparing"
        style={{ marginTop: 20 }}
      >
        <Row>
          <Table
            style={{ fontSize: 14, width: "100%", overflowX: "auto" }}
            dataSource={preparingOrders}
            columns={columns}
            rowKey={(record: any) => record.order_id}
          />
        </Row>
      </CardStyleTable>
    </Layout>
  );
};
const CustomPrimaryButton = styled(Button)`
  background-color: #fff !important;
  border-color: #fff !important;
  color: #092b00 !important;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const CardStyle = styled(Card)<{ delivery_type: string }>`
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
  /* Additional styles based on order.status */
  ${(props: any) => {
    switch (props.delivery_type) {
      case "Dine-in":
        return `
          background-color: #fadb14; 
        
        `;
      case "Takeaway":
        return `
          background-color: #fa8c16;
        
        `;
      case "delivery":
        return `
          background-color: #f5222d; 
          
        `;
      default:
        return "";
    }
  }}
`;
const TextStyle = styled(Typography)`
  whit-space: pre-line;
`;
const ResponsiveCol = styled(Col)`
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const CardStyleTable = styled(Card)`
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

export default kitchen;
