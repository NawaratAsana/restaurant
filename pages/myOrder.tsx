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
interface IProps {
  user: any;
}
interface Order {
  _id: string;
  quantity: number;
  order_id: string;
  food_id?: string;
  drink_id?: string;
  updatedAt: string;
  status: string;
  order_date: string;
}

const myOrder = () => {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState({ open: false, value: {} });
  const [cancellationReason, setCancellationReason] = useState("");

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
  const [filter, setFilter] = useState({});
  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",

      key: "order_id",
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
        <Typography>{format(new Date(order_date), "dd/MM/yyyy")}</Typography>
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

  const getStatusStep = (status: string) => {
    const steps = [
      { title: "Pending", status: "wait" },
      { title: "Confirmed", status: "process" },
      { title: "Preparing", status: "process" },
      { title: "Ready", status: "process" },
      { title: "Delivered", status: "finish" },
      { title: "Cancelled", status: "error" },
      { title: "Completed", status: "finish" },
    ];

    const index = steps.findIndex(
      (step) => step.title.toLowerCase() === status.toLowerCase()
    );

    return index >= 0 ? index : 0;
  };

  const handleCancelOrder = async (order: any) => {
    const result = await axios({
      method: "post",
      url: `/api/order/update`,
      data: { order },
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
        message: "ยกเลิกรายการอาหารสำเร็จ",
      });
      queryMyOrder(filter)
     
    }
  };

  useEffect(() => {
    queryMyOrder(filter);
  }, [filter, setFilter]);
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
                <div key={order.order_id}>
                  {order.status !== "completed" &&
                    order.status !== "cancelled" && (
                      <><CardStyle>
                        {" "}
                        <Typography >Order ID: {order.order_id}</Typography>
                        <Steps
                          current={getStatusStep(order.status)}
                          items={[
                            { title: "Pending" },
                            { title: "Confirmed" },
                            { title: "Preparing" },
                            { title: "Ready" },
                            { title: "Delivered" },
                          ]}
                        /> </CardStyle> 
                      </>
                    )}
                  {(order.status === "confirmed" ||
                    order.status === "pending" ||
                    order.status === "preparing") && (
                    <Button
                      onClick={() =>
                        setOpen({ open: true, value: order.order_id })
                      }
                    >
                      Cancel Order
                    </Button>
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
                style={{ fontSize: 14, width: "100%" }}
                dataSource={Object.values(orders)}
                columns={columns}
                rowKey={(record: any) => record.order_id}
              />
            </Row>
          </CardStyle>
        </div>{" "}
      </Row>
      {canceledOrder(
        open,
        setOpen,
        cancellationReason,
        setCancellationReason,
        orders,
        setOrders,
        handleCancelOrder
      )}
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
