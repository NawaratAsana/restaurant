import { Button, Card, Col, Layout, Row, Typography, notification } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface IProps {
  user: any;
}
interface FoodOrder {
  _id: string;
  quantity: number;
  order_id: string;
  food_id: string;
  detail:string;
  createdAt: string;
  updatedAt: string;
}

interface DrinkOrder {
  _id: string;
  quantity: number;
  order_id: string;
  drink_id: string;
  detail:string;

  createdAt: string;
  updatedAt: string;
}

interface Order {
  _id: string;
  order_number: string;
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

const orderEmployee = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const userData = Cookies.get("user");
  const user = userData ? JSON.parse(userData) : null;
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
  const [member, setMember] = useState([
    {
      id: "",
      name: "",
      phone:""
    },
  ]);
  const [memberFilter, setMemberFilter] = useState({
    where: {},
    query: "",
  });
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
      const foodData: any[] = [];
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
      const drinkData: any[] = [];
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
      
      const memberData: any[] = [];
      result?.data?.data?.map((value: any) => {
        memberData.push({
          id: value._id,
          name: value?.name,
          phone:value?.phone
        });
      });

      setMember(memberData);
      console.log("Member", member);
    }
  };
  const [filter, setFilter] = useState({});
  const handleConfirmOrder = async (order: any) => {
    const result = await axios({
      method: "post",
      url: `/api/order/update`,
      data: { id: order?._id, status: "confirmed", employee_id: user?.id }, // Pass the updatedOrder object as the data
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

  useEffect(() => {
    queryFood(foodFilter);
    queryDrink(drinkFilter);
    queryByMemberId(memberFilter)
  }, [foodFilter, setFoodFilter, drinkFilter, setDrinkFilter,memberFilter, setMemberFilter]);

  useEffect(() => {
    const initialFilter = {};
    QueryOrder(initialFilter);
  }, []);

  const pendingOrders = Object.values(orders).filter(
    (order) => order.status === "pending"
  );


  return (
    <Layout style={{ width: "100%", padding: 20 }}>
      <TextStyle.Text strong style={{ fontSize: 30, margin: 30 }}>
        รายการสั่งอาหาร
      </TextStyle.Text>
      <Row gutter={[24, 24]} style={{ margin: 20 }}>
        {Object.values(pendingOrders).map((orderItem) => (
          <ResponsiveCol xs={24} sm={12} md={8}>
            <CardStyle
              delivery_type={orderItem.delivery_type}
              key={orderItem.order_id}
              bordered={false}
            >
              {/* Card Header */}
              <div className="ant-card-head-title">
                <TextStyle>Order ID: {orderItem.order_number}</TextStyle>
              </div>

              {/* Card Body */}
              <div className="card-content">
                <TextStyle>
                  Order Time: {moment(orderItem.order_date).format("HH:mm")} น.
                </TextStyle>
                <TextStyle>Delivery Type: {orderItem.delivery_type}</TextStyle>
                
                {member?.map((value: any, index: number) => {
            if (value?.id === orderItem?.member_id) {
              return <TextStyle key={index}>Member: {value?.name}</TextStyle>;
            }})}
               
               {member?.map((value: any, index: number) => {
            if (value?.id === orderItem?.member_id) {
              return <TextStyle key={index}>Phone: {value?.phone}</TextStyle>;
            }})}
                {orderItem.delivery_location && (
                  <TextStyle>
                    Delivery Location: {orderItem.delivery_location}
                  </TextStyle>
                )}

                <TextStyle>Orders:</TextStyle>
                <ul>
                  {orderItem.foodOrders.map((foodOrder) => {
                    const foodItem = food.find(
                      (item) => item.id === foodOrder.food_id
                    );
                    return (
                      <li key={foodOrder._id}>
                        {foodItem?.name} ( {foodOrder.quantity} )<br/>
                        {foodOrder?.detail}
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
                        <br/>
                        {drinkOrder?.detail}
                      </li>
                    );
                  })}
                </ul>
                <TextStyle>Total Amount: {orderItem.total_amount}</TextStyle>
                <ButtonContainer>
                  <CustomPrimaryButton
                    type="primary"
                    style={{}}
                    onClick={() => handleConfirmOrder(orderItem)}
                  >
                    Confirm Order
                  </CustomPrimaryButton>
                </ButtonContainer>
              </div>
            </CardStyle>
          </ResponsiveCol>
        ))}
      </Row>
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
          background-color: #d9f7be; /* Light blue for Dine-in */
        `;
      case "Takeaway":
        return `
          background-color: #fff1b8; /* Light orange for Takeaway */
        `;
      case "delivery":
        return `
          background-color: #ffccc7; /* Light green for Delivery */
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

export default orderEmployee;
