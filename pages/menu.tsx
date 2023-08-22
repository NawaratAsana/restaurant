import {
  DeleteOutlined,
  FormOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Drawer,
  Image,
  Input,
  Layout,
  Pagination,
  Radio,
  RadioChangeEvent,
  Row,
  Spin,
  Typography,
  notification,
  FloatButton,
} from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import Payment from "../component/Layout/Pay/Payment";

interface IProps {
  user: any;
}
interface IFood {
  type: "food";
  name: any;
  price: string;
  typeFood_id: string;
  image: string;
  quantity?: number;
  _id?: string;
  delivery_location?: string;
}
interface IDrink {
  name: any;
  price: string;
  typeDrink_id: string;
  image: string;
  quantity?: number;
  type: "drink";
  _id?: string;
  delivery_location?: string;
}

const Menu: React.FC = () => {
  const router = useRouter();
  const userData = Cookies.get("user");
  const user = userData ? JSON.parse(userData) : null;
  const [open, setOpen] = useState(false);
  const [openpay, setOpenPay] = useState(false);
  const [foodData, setFoodData] = useState<IFood[]>([]);
  const [drinkData, setDrinkData] = useState<IDrink[]>([]);
  const [totalPage, setTotalPage] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * displayCount;
  const endIndex = startIndex + displayCount;
  const [isShowingFood, setIsShowingFood] = useState(true);
  const [isShowingDrink, setIsShowingDrink] = useState(false);
  const [order, setOrder] = useState<(IFood | IDrink)[]>([]);
  const [foodOrder, setFoodOrder] = useState<Array<IFood | IDrink>>([]);
  const [drinkOrder, setDrinkOrder] = useState<Array<IFood | IDrink>>([]);
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [deliveryType, setDeliveryType] = useState<string>("Dine-in");
  const [paymentMethod, setPaymentMethod] = useState<string>(""); // Default to "cash"
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderID, setOrderID] = useState("");
  const handleDeliveryTypeChange = (e: RadioChangeEvent) => {
    setDeliveryType(e.target.value);
  };
  const [totalPriceWithDelivery, setTotalPriceWithDelivery] =
    useState(totalPrice);

  const [filter, setFilter] = useState({});

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
          router.push("/login");
        }
      }
    });

    if (result?.status === 200) {
      setFoodData(result?.data?.data);
      setTotalPage(result?.data?.totalPages);
      setLoading(false);
    } else {
      setTotalPage(0);
      setLoading(false);
      setFoodData([]);
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
          router.push("/login");
        }
      }
    });

    if (result?.status === 200) {
      setDrinkData(result?.data?.data);
      setTotalPage(result?.data?.totalPages);
      setLoading(false);
    } else {
      setTotalPage(0);
      setLoading(false);
      setDrinkData([]);
    }
  };
  const FoodList: any = foodData;
  const DrinkList: any = drinkData;

  const handleAddToOrder = (value: IFood | IDrink) => {
    const user = Cookies.get("user");
    if (!user) {
      notification["error"]({
        message: "กรุณาเข้าสู่ระบบ",
        description: "กรุณาเข้าสู่ระบบเพื่อทำการสั่งอาหาร",
      });
      router.push("/login");
      return;
    }

    const existingItemIndex = order.findIndex(
      (item) => item._id === value._id && item.quantity !== undefined
    );

    if (existingItemIndex !== -1) {
      setOrder((prevOrder) => {
        const updatedOrder = [...prevOrder];
        if (updatedOrder[existingItemIndex]) {
          updatedOrder[existingItemIndex].quantity =
            (updatedOrder[existingItemIndex].quantity || 0) + 1;
        }
        return updatedOrder;
      });

      if ("typeFood_id" in value) {
        setFoodOrder((prevFoodOrder) => {
          const updatedFoodOrder = [...prevFoodOrder];
          if (updatedFoodOrder[existingItemIndex]) {
            updatedFoodOrder[existingItemIndex].quantity =
              (updatedFoodOrder[existingItemIndex].quantity || 0) + 1;
          }
          return updatedFoodOrder;
        });
      } else if ("typeDrink_id" in value) {
        setDrinkOrder((prevDrinkOrder) => {
          const updatedDrinkOrder = [...prevDrinkOrder];
          if (updatedDrinkOrder[existingItemIndex]) {
            updatedDrinkOrder[existingItemIndex].quantity =
              (updatedDrinkOrder[existingItemIndex].quantity || 0) + 1;
          }
          return updatedDrinkOrder;
        });
      }
    } else {
      setOrder((prevOrder) => [...prevOrder, { ...value, quantity: 1 }]);

      if ("typeFood_id" in value) {
        setFoodOrder((prevFoodOrder) => [
          ...prevFoodOrder,
          { ...value, quantity: 1 },
        ]);
      } else if ("typeDrink_id" in value) {
        setDrinkOrder((prevDrinkOrder) => [
          ...prevDrinkOrder,
          { ...value, quantity: 1 },
        ]);
      }
    }
  };

  const onAddOrder = async (value: any) => {
    const items: (IFood | IDrink)[] = [...value.foods, ...value.drinks];

    const foods: IFood[] = value.foods.filter(
      (item: IFood | IDrink) => item.type === "food"
    );
    const drinks: IDrink[] = value.drinks.filter(
      (item: IFood | IDrink) => item.type === "drink"
    );

    setFoodOrder((prevFoodOrder) => [...prevFoodOrder, ...foods]);
    setDrinkOrder((prevDrinkOrder) => [...prevDrinkOrder, ...drinks]);
    setOrder((prevOrder) => [...prevOrder, ...value.foods, ...value.drinks]);

    const payload = {
      total_amount: totalPrice,
      order_date: new Date(),
      member_id: user?.id,
      delivery_type: deliveryType,
      status: "pending",
      delivery_location: deliveryLocation,
      foods: value.foods.map((food: any) => ({
        food_id: food._id,
        quantity: food.quantity,
      })),
      drinks: value.drinks.map((drink: any) => ({
        drink_id: drink._id,
        quantity: drink.quantity,
      })),
    };

    items.forEach((item) => {
      const { type, _id } = item;
      if (type === "food") {
        payload.foods.push(_id?.toString() ?? "");
      } else if (type === "drink") {
        payload.drinks.push(_id?.toString() ?? "");
      }
    });


    const result = await axios({
      method: "post",
      url: `/api/order/create`,
      data: payload,
    }).catch((err) => {
      if (err) {
        if (err?.response?.data?.message?.status === 401) {
          notification["error"]({
            message: "Query ข้อมูลไม่สำเร็จ",
            description: "กรุณาเข้าสู่ระบบ",
          });
          Cookies.remove("user");
          router.push("/login");
        } else {
          notification.error({
            message: "เกิดข้อผิดพลาดในการสั่งอาหาร",
            description: "กรุณาลองใหม่อีกครั้ง",
          });
        }
      }
    });
 
  
    if (result?.status === 200) {

      setOrderID(result.data.data.order_id);  
      setPaymentMethod("")
      setOrder([]);
      setOpen(false);
      notification["success"]({
        message: "สั่งอาหารเรียบร้อยแล้ว",
      });
    }
  };

  const handleConfirmOrder = () => {
    if (deliveryType === "delivery") {
      setTotalPriceWithDelivery(totalPrice + 20);
    }
    if (deliveryType === "Takeaway") {
      setTotalPriceWithDelivery(totalPrice);
    }
    if (paymentMethod === "payNow") {
      setOpenPay(true);
    }
    onAddOrder({
      total_amount: totalPriceWithDelivery,
      member_id: user?.id,
      employee_id: null,
      delivery_type: deliveryType,
      status: "pending",
      foods: foodOrder,
      drinks: drinkOrder,
    });

    setOrder([]);
    setPaymentMethod("")
    setDeliveryLocation("");
    setDeliveryType("");
    setTotalPrice(0);
  };

  const showFoodData = () => {
    setIsShowingFood(true);
    setIsShowingDrink(false);
  };

  const showDrinkData = () => {
    setIsShowingFood(false);
    setIsShowingDrink(true);
  };

  const { Meta } = Card;
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const memoizedOrder = useMemo(() => order, [order]);

  const handleIncreaseQuantity = (item: IFood | IDrink) => {
    const updatedOrder = order.map((orderItem) =>
      orderItem._id === item._id
        ? { ...orderItem, quantity: (orderItem.quantity || 0) + 1 }
        : orderItem
    );
    setOrder(updatedOrder);
  };

  const handleDecreaseQuantity = (item: IFood | IDrink) => {
    const updatedOrder = order
      .map((orderItem) =>
        orderItem._id === item._id
          ? {
              ...orderItem,
              quantity: Math.max((orderItem.quantity || 0) - 1, 0),
            }
          : orderItem
      )
      .filter((orderItem) =>
        orderItem.quantity !== undefined ? orderItem.quantity > 0 : true
      ); // Remove items with quantity 0 from the order

    setOrder(updatedOrder);
  };

  const handleDeleteItem = (item: IFood | IDrink) => {
    const updatedOrder = order.filter(
      (orderItem) => orderItem._id !== item._id
    );
    setOrder(updatedOrder);
  };

  useEffect(() => {
    if (isShowingFood) {
      queryFood(filter);
    } else if (isShowingDrink) {
      queryDrink(filter);
    }
  }, [isShowingFood, isShowingDrink, filter, setFilter]);

  useEffect(() => {
    let totalPrice = 0;
    order.forEach((item) => {
      const itemPrice = parseFloat(item.price);
      const itemQuantity = item.quantity || 1;
      totalPrice += itemPrice * itemQuantity;
    });
    setTotalPrice(totalPrice);
    if (deliveryType === "delivery") {
      totalPrice += 20;
    }
    setTotalPrice(totalPrice);
  }, [order, deliveryType]);

  useEffect(() => {


    let totalPrice = 0;
    order.forEach((item) => {
      const itemPrice = parseFloat(item.price);
      const itemQuantity = item.quantity || 1;
      totalPrice += itemPrice * itemQuantity;
    });

   

    if (deliveryType === "delivery") {
      totalPrice += 20;
    }



    setTotalPrice(totalPrice);
  }, [order, deliveryType]);

  return (
    <MenuLayout className="site-layout">
      <Row justify="center" gutter={[24, 0]}>
        <CardStyle
          bordered={false}
          style={{ marginTop: -20, marginBottom: "15px", width: "89%" }}
        >
          <Row>
            <Col>
              <ButtonStyled
                onClick={showFoodData}
                style={{ backgroundColor: "#a0d911", width: 170 }}
              >
                Food
              </ButtonStyled>
            </Col>
            <Col>
              <ButtonStyled
                onClick={showDrinkData}
                style={{ backgroundColor: "#fa8c16", width: 170 }}
              >
                Drink
              </ButtonStyled>
            </Col>
          </Row>
        </CardStyle>
      </Row>
      <Row gutter={[24, 0]} justify={"center"}>
        <FoodMenuSection span={22}>
          {isShowingFood && (
            <Col span={24}>
              <FoodMenuCard bordered={false}>
                {loading ? (
                  <Spin />
                ) : (
                  <Row
                    justify="start"
                    gutter={30}
                    style={{ width: "100%", margin: "50px 0px", marginTop: 30 }}
                  >
                    {Array.isArray(FoodList) &&
                      FoodList.slice(startIndex, endIndex).map((value: any) => (
                        <Col xs={12} sm={8} md={6} lg={4}  key={value?.id}>
                          <FoodMenuCard
                            cover={
                              <Image
                                style={{
                                  width: "100%",
                                  borderTopLeftRadius: "30px",
                                  borderTopRightRadius: "30px",
                                }}
                                height={150}
                                src={value?.image}
                              />
                            }
                            actions={[ <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                <ResponsiveButton
                                  onClick={() => handleAddToOrder(value)}
                                  icon={<FormOutlined />}
                                >
                                  Add Order
                                </ResponsiveButton></div>
                              ]}
                          >
                            <Meta
                              title={value?.name}
                              description={"ราคา: " + value?.price}
                            />
                          </FoodMenuCard>
                        </Col>
                      ))}
                  </Row>
                )}
                <Row justify="center" style={{ width: "100%" }}>
                  {totalPage === 0 ? (
                    <Typography
                      style={{ textAlign: "center", fontSize: "18px" }}
                    >
                      common-not-found-data
                    </Typography>
                  ) : (
                    <Pagination
                      current={currentPage}
                      defaultPageSize={displayCount}
                      total={FoodList.length}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                    />
                  )}
                </Row>
              </FoodMenuCard>
            </Col>
          )}
          {/* Drink data display */}
          {isShowingDrink && (
            <Col span={24}>
              <FoodMenuCard bordered={false}>
                {loading ? (
                  <Spin />
                ) : (
                  <Row
                    justify="start"
                    gutter={30}
                    style={{ width: "100%", margin: "50px 0px", marginTop: 30 }}
                  >
                    {Array.isArray(DrinkList) &&
                      DrinkList.slice(startIndex, endIndex).map(
                        (value: any) => (
                          <Col span={6} key={value?.id}>
                            <FoodMenuCard
                              cover={
                                <Image
                                  style={{
                                    width: "100%",
                                    borderTopLeftRadius: "30px",
                                    borderTopRightRadius: "30px",
                                  }}
                                  height={150}
                                  src={value?.image}
                                />
                              }
                              actions={[ <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                <ResponsiveButton
                                  onClick={() => handleAddToOrder(value)}
                                  icon={<FormOutlined />}
                                >
                                  Add Order
                                </ResponsiveButton></div>
                              ]}
                            >
                              <Meta
                                title={value?.name}
                                description={"ราคา: " + value?.price}
                              />
                            </FoodMenuCard>
                          </Col>
                        )
                      )}
                  </Row>
                )}
                <Row justify="center" style={{ width: "100%" }}>
                  {totalPage === 0 ? (
                    <Typography
                      style={{ textAlign: "center", fontSize: "18px" }}
                    >
                      common-not-found-data
                    </Typography>
                  ) : (
                    <Pagination
                      current={currentPage}
                      defaultPageSize={displayCount}
                      total={DrinkList.length}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                    />
                  )}
                </Row>
              </FoodMenuCard>
            </Col>
          )}
        </FoodMenuSection>
        <YourOrderSection
          onClose={onClose}
          open={open}
          title="รายการอาหาร"
          width={500}
        >
          {order.length > 0 && (
            <CardStyle bordered={false} style={{ marginTop: -20 }}>
              <Row justify={"space-between"} style={{ marginBottom: 20 }}>
                <Col span={24}>
                  <Typography.Text strong>การให้บริการ</Typography.Text>
                </Col>
                <Radio.Group
                  style={{ marginTop: 5 }}
                  onChange={handleDeliveryTypeChange} // Step 4: Handle the change event
                  value={deliveryType} // Use the state variable to control the selection
                >
                  <Radio value="Dine-in"> ทานอาหารในร้าน</Radio>
                  <Radio value="Takeaway">รับกลับบ้าน</Radio>
                  <Radio value="delivery">บริการจัดส่ง</Radio>
                </Radio.Group>

                {deliveryType === "delivery" && (
                  <Col span={24} style={{ marginTop: 5 }}>
                    <Row>
                      <Typography.Text strong>
                        รายละเอียดที่อยู่จัดส่ง
                      </Typography.Text>

                      <Typography
                        style={{
                          color: "red",
                          marginTop: 5,
                          fontSize: 12,
                          marginLeft: 5,
                        }}
                      >
                        * ค่าบริการจัดส่งครั้งละ 20 บาท
                      </Typography>
                    </Row>
                    <Input
                      style={{
                        borderTop: "none",
                        borderRight: "none",
                        borderLeft: "none",
                        borderBottom: "1px solid ",
                      }}
                      onChange={(e: any) => setDeliveryLocation(e.target.value)}
                      value={deliveryLocation}
                    />
                  </Col>
                )}
              </Row>
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                {order.map((item) => (
                  <Card key={item.name} style={{ marginBottom: "16px" }}>
                    <Row align="middle" justify="space-between">
                      <Col>
                        <Typography.Text>{item.name}</Typography.Text>
                      </Col>
                      <Col>
                        <Typography.Text type="secondary">
                          Price: {item.price}
                        </Typography.Text>
                      </Col>
                      <Col>
                       
                        <PlusOutlined
                          onClick={() => handleIncreaseQuantity(item)}
                        />
                        <Typography.Text
                          type="secondary"
                          style={{ marginLeft: 5, marginRight: 5 }}
                        >
                          {/* Quantity:  */}
                          {item.quantity}
                        </Typography.Text>
                       
                        <MinusOutlined
                          onClick={() => handleDecreaseQuantity(item)}
                        />
                      </Col>
                      <Col>
                      
                        <DeleteOutlined
                          onClick={() => handleDeleteItem(item)}
                          style={{ color: "red" }}
                        />
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
              {deliveryType === "delivery" || deliveryType === "Takeaway" ? (
                <Row justify="start" gutter={16}>
                  <Col span={24}>
                    <Typography.Text strong>วิธีการชำระเงิน</Typography.Text>
                  </Col>
                  <Col>
                    <Radio.Group
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      value={paymentMethod}
                      style={{ marginTop: 5 }}
                    >
                      <Radio value="payNow">ชำระเงินทันที</Radio>
                      <Radio value="payOnDelivery">ชำระเงินปลายทาง</Radio>
                    </Radio.Group>
                  </Col>
                </Row>
              ) : null}

              <Row justify={"space-between"} style={{ marginBottom: 10 }}>
                <Col span={22}>
                  {deliveryType === "delivery" && (
                    <Typography.Text>ค่าจัดส่ง</Typography.Text>
                  )}
                </Col>
                <Col span={2}>
                  <Typography.Text>
                    {deliveryType === "delivery" ? "20" : ""}
                  </Typography.Text>
                </Col>
              </Row>
              <Row justify={"space-between"} style={{ marginTop: 30 }}>
                <Typography.Text strong>
                  Total Price: {totalPrice.toFixed(2)}{" "}
                </Typography.Text>
                {/* Add the confirmation button here */}
                <ButtonStyled onClick={handleConfirmOrder}>
                  ยืนยันการสั่งอาหาร
                </ButtonStyled>
              </Row>
            </CardStyle>
          )}
        </YourOrderSection>

        <FloatButton
          badge={{ count: order.length }}
          icon={<ShoppingCartOutlined style={{ color: "#fa8c16" }} />}
          onClick={showDrawer}
        />
      </Row>
      {Payment(openpay, setOpenPay, totalPriceWithDelivery, orderID)}
    </MenuLayout>
  );
};

const CardStyle = styled(Card)`
  box-shadow: 0px 20px 27px #0000000d;
  border-radius: 12px;
  width: 100%;
`;
const ResponsiveButton = styled(Button)`
  background-color: #faad14;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  // padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  
`;
const ButtonStyled = styled(Button)`
  background-color: #faad14;
  // padding: 0px 50px;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
`;

const MenuLayout = styled(Layout)`
  margin-top: 40px;
`;

const FoodMenuSection = styled(Col)`
  flex: 1;
`;

const FoodMenuCard = styled(CardStyle)`
  margin-bottom: 30px;
`;

const YourOrderSection = styled(Drawer)`
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align the content to the right */

  // /* Set the width of the drawer as a percentage */
  // @media (max-width: 768px) {
  //   width: 90%;
  // }

  // @media (min-width: 769px) {
  //   width: 40%;
  // }
`;

export default Menu;
