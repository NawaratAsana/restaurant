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
  const [paymentMethod, setPaymentMethod] = useState(""); // Default to "cash"
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderPayment, setOrderPayment] = useState([]);
  const handleDeliveryTypeChange = (e: RadioChangeEvent) => {
    setDeliveryType(e.target.value);
  };
  const [totalPriceWithDelivery, setTotalPriceWithDelivery] =
    useState(totalPrice);
  const [selectedFoodType, setSelectedFoodType] = useState<string | null>(null);

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

  // To retrieve data
  const storedOrder = Cookies.get("order");
  const orderData = storedOrder ? JSON.parse(storedOrder) : [];

  // To save data
  Cookies.set("order", JSON.stringify(orderData));

  const handleIncreaseQuantity = (item: IFood | IDrink) => {
    const updatedOrder = order.map((orderItem) =>
      orderItem._id === item._id
        ? { ...orderItem, quantity: (orderItem.quantity || 0) + 1 }
        : orderItem
    );
    setOrder(updatedOrder);
  };
  const handleDecreaseQuantity = (item: IFood | IDrink) => {
    const updatedOrder = order.map((orderItem) =>
      orderItem._id === item._id
        ? {
            ...orderItem,
            quantity: Math.max((orderItem.quantity || 0) - 1, 0),
          }
        : orderItem
    );

    setOrder(updatedOrder);

    if ("typeFood_id" in item) {
      setFoodOrder((prevFoodOrder) =>
        prevFoodOrder.map((foodItem) =>
          foodItem._id === item._id
            ? {
                ...foodItem,
                quantity: Math.max((foodItem.quantity || 0) - 1, 0),
              }
            : foodItem
        )
      );
    } else if ("typeDrink_id" in item) {
      setDrinkOrder((prevDrinkOrder) =>
        prevDrinkOrder.map((drinkItem) =>
          drinkItem._id === item._id
            ? {
                ...drinkItem,
                quantity: Math.max((drinkItem.quantity || 0) - 1, 0),
              }
            : drinkItem
        )
      );
    }
  };

  const handleDeleteItem = (item: IFood | IDrink) => {
    const updatedOrder = order.filter(
      (orderItem) => orderItem._id !== item._id
    );
    setOrder(updatedOrder);

    if ("typeFood_id" in item) {
      setFoodOrder((prevFoodOrder) =>
        prevFoodOrder.filter((foodItem) => foodItem._id !== item._id)
      );
    } else if ("typeDrink_id" in item) {
      setDrinkOrder((prevDrinkOrder) =>
        prevDrinkOrder.filter((drinkItem) => drinkItem._id !== item._id)
      );
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
      employee_id:
        user.position_id === "63c90d725b5a03c61bd01190" ? user.id : null,
      member_id: user.role === "63f512a60e947c18f97769a0" ? user.id : null,
      delivery_type: deliveryType,
      status:
        user.position_id === "63c90d725b5a03c61bd01190"
          ? "confirmed"
          : "pending",
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
      setOrderPayment(result.data.data);
      setPaymentMethod("");
      setOrder([]);
      setOpen(false);
      setFoodOrder([]);
      setDrinkOrder([]);
      setDeliveryLocation("");
      setDeliveryType("");
      setTotalPrice(0);
      setTotalPriceWithDelivery(0);
      notification["success"]({
        message: "สั่งอาหารเรียบร้อยแล้ว",
      });
    }
  };
  const handleConfirmOrder = () => {
    const filteredOrder = order.filter((item) => (item.quantity || 0) > 0);

    if (deliveryType === "Delivery") {
      setTotalPriceWithDelivery(totalPrice + 20);
    }
    if (deliveryType === "Takeaway") {
      setTotalPriceWithDelivery(totalPrice);
    }
    if (paymentMethod === "payNow") {
      setOpenPay(true);
    }

    const updatedFoodOrder = foodOrder.map((food) => {
      const orderItem = filteredOrder.find((item) => item._id === food._id);
      return { ...food, quantity: orderItem ? orderItem.quantity : 0 };
    });

    const updatedDrinkOrder = drinkOrder.map((drink) => {
      const orderItem = filteredOrder.find((item) => item._id === drink._id);
      return { ...drink, quantity: orderItem ? orderItem.quantity : 0 };
    });

    onAddOrder({
      total_amount: totalPriceWithDelivery,
      member_id: user?.id,
      employee_id: null,
      delivery_type: deliveryType,
      status: "pending",
      foods: updatedFoodOrder,
      drinks: updatedDrinkOrder,
    });

    setOrder([]);
    setFoodOrder([]);
    setDrinkOrder([]);
    setDeliveryLocation("");
    setDeliveryType("");
    setTotalPrice(0);
    setTotalPriceWithDelivery(0);
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
  const handleFoodTypeFilter = (foodType: string) => {
    setSelectedFoodType(foodType);
    // สามารถเขียนโค้ดเพิ่มเติมเพื่อกรองอาหารตามประเภท foodType ได้
    // ในกรณีนี้คุณอาจต้องอัปเดต state ที่ใช้ในการแสดงรายการอาหารด้วย
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
      const itemQuantity = item.quantity || 0;
      totalPrice += itemPrice * itemQuantity;
    });

    if (deliveryType === "Delivery") {
      totalPrice += 20;
    }

    setTotalPrice(totalPrice);
  }, [order, deliveryType]);

  return (
    <Layout>
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
          <Row gutter={[24, 0]} justify={"center"}>
            {" "}
            <CardStyle
              bordered={false}
              style={{ marginTop: -20, marginBottom: "15px", width: "89%" }}
            >
              <Row gutter={[22, 0]}>
                <Col>
                  <ButtonStyled
                    onClick={() =>
                      handleFoodTypeFilter("63c913b133d18478d6fb87ef")
                    } // เปลี่ยนเป็น _id ของ "อาหารคาว"
                    style={{
                      backgroundColor:
                        selectedFoodType === "63c913b133d18478d6fb87ef"
                          ? "#faad14"
                          : "#a0d911",
                      width: 170,
                    }}
                  >
                    อาหารคาว
                  </ButtonStyled>
                </Col>
                <Col>
                  <ButtonStyled
                    onClick={() =>
                      handleFoodTypeFilter("63c913d433d18478d6fb87f0")
                    } // เปลี่ยนเป็น _id ของ "อาหารหวาน"
                    style={{
                      backgroundColor:
                        selectedFoodType === "63c913d433d18478d6fb87f0"
                          ? "#faad14"
                          : "#a0d911",
                      width: 170,
                    }}
                  >
                    อาหารหวาน
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
                        style={{
                          width: "100%",
                          margin: "50px 0px",
                          marginTop: 30,
                        }}
                      >
                       {Array.isArray(FoodList) &&
  FoodList.slice(startIndex, endIndex).map((value: any) => {
    // เพิ่มเงื่อนไขเช็คประเภทอาหารก่อนแสดง
    if (!selectedFoodType || value.typeFood_id === selectedFoodType) {
      return (
                              <Col xs={12} sm={8} md={6} lg={6} key={value?.id}>
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
                                  actions={[
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <ResponsiveButton
                                        onClick={() => handleAddToOrder(value)}
                                        icon={<FormOutlined />}
                                      >
                                        Add Order
                                      </ResponsiveButton>
                                    </div>,
                                  ]}
                                >
                                  <Meta
                                    title={value?.name}
                                    description={"ราคา: " + value?.price}
                                  />
                                </FoodMenuCard>
                              </Col>
                            );
                          }
                          return null; 
                        })}
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
                        style={{
                          width: "100%",
                          margin: "50px 0px",
                          marginTop: 30,
                        }}
                      >
                        {Array.isArray(DrinkList) &&
                          DrinkList.slice(startIndex, endIndex).map(
                            (value: any) => (
                              <Col xs={12} sm={8} md={6} lg={6} key={value?.id}>
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
                                  actions={[
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <ResponsiveButton
                                        onClick={() => handleAddToOrder(value)}
                                        icon={<FormOutlined />}
                                      >
                                        Add Order
                                      </ResponsiveButton>
                                    </div>,
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
                      <Radio value="Delivery">บริการจัดส่ง</Radio>
                    </Radio.Group>

                    {deliveryType === "Delivery" && (
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
                          onChange={(e: any) =>
                            setDeliveryLocation(e.target.value)
                          }
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
                  {deliveryType === "Delivery" ||
                  deliveryType === "Takeaway" ? (
                    <Row justify="start" gutter={16}>
                      <Col span={24}>
                        <Typography.Text strong>
                          วิธีการชำระเงิน
                        </Typography.Text>
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

                  <Row justify={"space-between"} style={{ margin: 10 }}>
                    <Col span={22}>
                      {deliveryType === "Delivery" && (
                        <Typography.Text>ค่าจัดส่ง</Typography.Text>
                      )}
                    </Col>
                    <Col span={2}>
                      <Typography.Text>
                        {deliveryType === "Delivery" ? "20" : ""}
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
        </div>
      </Row>
      {Payment(openpay, setOpenPay, orderPayment)}
    </Layout>
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
`;

export default Menu;
