import {
  DeleteOutlined,
  FormOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Drawer,
  Image,
  Layout,
  Pagination,
  Radio,
  RadioChangeEvent,
  Row,
  Spin,
  Typography,
  notification,
} from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
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
  _id?: string; // Add the _id property as optional
}
interface IDrink {
  name: any;
  price: string;
  typeFood_id: string;
  image: string;
  quantity?: number;
  type: "drink";
  _id?: string;
}

const Menu: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
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

  // Step 2: Add a state variable to hold the selected delivery type
  const [deliveryType, setDeliveryType] = useState<string>("Dine-in");

  // Step 3: Create a function to handle the radio button change
  const handleDeliveryTypeChange = (e: RadioChangeEvent) => {
    setDeliveryType(e.target.value);
  };

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

  const userData = Cookies.get("user");
  const user = userData ? JSON.parse(userData) : null;

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

    // Check if the item is already in the order based on its id and quantity
    const existingItemIndex = order.findIndex(
      (item) => item._id === value._id && item.quantity !== undefined
    );

    if (existingItemIndex !== -1) {
      // If the item is already in the order, increase its quantity by 1
      setOrder((prevOrder) => {
        const updatedOrder = [...prevOrder];
        if (updatedOrder[existingItemIndex]) {
          updatedOrder[existingItemIndex].quantity =
            (updatedOrder[existingItemIndex].quantity || 0) + 1;
        }
        return updatedOrder;
      });

      // Also update the corresponding foodOrder or drinkOrder
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
      // If the item is not in the order, add a new item with quantity 1
      setOrder((prevOrder) => [...prevOrder, { ...value, quantity: 1 }]);

      // Also add the new item to the corresponding foodOrder or drinkOrder
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
    // Separate arrays for foods and drinks from the items
    const foods: IFood[] = value.foods.filter(
      (item: IFood | IDrink) => item.type === "food"
    );
    const drinks: IDrink[] = value.drinks.filter(
      (item: IFood | IDrink) => item.type === "drink"
    );

    setFoodOrder((prevFoodOrder) => [...prevFoodOrder, ...foods]);
    setDrinkOrder((prevDrinkOrder) => [...prevDrinkOrder, ...drinks]);
    setOrder((prevOrder) => [...prevOrder, ...value.foods, ...value.drinks]);

    // Create the payload with the necessary order details
    const payload = {
      total_amount: totalPrice,
      order_date: new Date(),
      member_id: user?.id,
      delivery_type:deliveryType,
      status: "pending",
      payment_status: "รอการชำระเงิน",
      foods: value.foods.map((food: any) => ({
        food_id: food._id,
        quantity: food.quantity,
      })),
      drinks: value.drinks.map((drink: any) => ({
        drink_id: drink._id,
        quantity: drink.quantity,
      })),
    };

    // Use the existing `items` variable, do not redeclare it
    items.forEach((item) => {
      const { type, _id } = item;
      if (type === "food") {
        payload.foods.push(_id?.toString() ?? ""); // Use the optional chaining operator to access _id and provide a default value
      } else if (type === "drink") {
        payload.drinks.push(_id?.toString() ?? ""); // Use the optional chaining operator to access _id and provide a default value
      }
    });

    console.log("payload", payload);
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
        }
      }
    });
    if (result?.status === 200) {
      setOrder([]);
      setOpen(false);
      notification["success"]({
        message: "Order placed successfully",
      });
    }
  };

  const handleConfirmOrder = () => {
    let totalPriceWithDelivery = totalPrice;

    if (deliveryType === "delivery") {
      // Add the delivery charge (20 units) to the total price if the delivery option is selected
      totalPriceWithDelivery += 20;
    }

    onAddOrder({
      total_amount: totalPriceWithDelivery,
      member_id: user?.id,
      employee_id: null,
      delivery_type:deliveryType,
      status: "pending",
      payment_status: "รอการชำระเงิน",
      foods: foodOrder,
      drinks: drinkOrder,
    });
    setOrder([]);
  };

  // Function to handle click event to show food data
  const showFoodData = () => {
    setIsShowingFood(true);
    setIsShowingDrink(false);
  };
  // Function to handle click event to show drink data
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

  const [totalPrice, setTotalPrice] = useState(0);

  const memoizedOrder = useMemo(() => order, [order]);

  const handleIncreaseQuantity = (item: IFood | IDrink) => {
    const updatedOrder = order.map((orderItem) =>
      orderItem._id === item._id
        ? { ...orderItem, quantity: (orderItem.quantity || 0) + 1 }
        : orderItem
    );
    setOrder(updatedOrder);
  };
  // Function to handle decreasing the quantity of an item in the order
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

  // Function to handle deleting an item from the order
  const handleDeleteItem = (item: IFood | IDrink) => {
    const updatedOrder = order.filter(
      (orderItem) => orderItem._id !== item._id
    );
    setOrder(updatedOrder);
  };

  useEffect(() => {
    // Fetch data based on the state values of isShowingFood and isShowingDrink
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
      const itemQuantity = item.quantity || 1; // Default quantity to 1 if not provided
      totalPrice += itemPrice * itemQuantity;
    });

    // Update the state variable with the calculated total price
    setTotalPrice(totalPrice);

    // If the delivery option is selected, add the delivery charge (20 units) to the total price
    if (deliveryType === "delivery") {
      totalPrice += 20;
    }

    setTotalPrice(totalPrice);
  }, [order, deliveryType]);

  return (
    <MenuLayout className="site-layout">
      <Row style={{ marginLeft: 65, marginBottom: 10 }} gutter={[24, 0]}>
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
        <Col style={{ marginLeft: "auto", paddingRight: 95 }}>
          <Badge count={order.length}>
            <ShoppingCartOutlined
              onClick={showDrawer}
              style={{ color: "#fa8c16", fontSize: 30 }}
            />
          </Badge>
        </Col>
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
                        <Col span={4} key={value?.id}>
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
                              <ButtonStyled
                                onClick={() => handleAddToOrder(value)}
                                icon={<FormOutlined />}
                              >
                                Add to Order
                              </ButtonStyled>,
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
                              actions={[
                                <ButtonStyled
                                  onClick={() => handleAddToOrder(value)}
                                  icon={<FormOutlined />}
                                >
                                  Add to Order
                                </ButtonStyled>,
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
          title="Your Order"
          width={500}
        >
          {order.length > 0 && (
            <CardStyle bordered={false} style={{ marginTop:-20 }}>
              <Row justify={"space-between"} style={{ marginBottom: 10 }}>
                <Col span={24}>
                  <Typography.Text strong>การให้บริการ</Typography.Text>
                </Col>
                <Radio.Group
                  onChange={handleDeliveryTypeChange} // Step 4: Handle the change event
                  value={deliveryType} // Use the state variable to control the selection
                >
                  <Radio value="Dine-in">Dine-in</Radio>
                  <Radio value="Takeaway">Takeaway</Radio>
                  <Radio value="delivery">Delivery</Radio>
                </Radio.Group>
                <Typography.Text
                  style={{ color: "red", marginTop: 5, fontSize: 13 }}
                >
                  * Delivery ค่าบริการจัดส่งครั้งละ 20 บาท
                </Typography.Text>
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
                        {/* Decrease Quantity Button */}
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
                        {/* Increase Quantity Button */}
                        <MinusOutlined
                          onClick={() => handleDecreaseQuantity(item)}
                        />
                      </Col>
                      <Col>
                        {/* Delete Button */}
                        <DeleteOutlined
                          onClick={() => handleDeleteItem(item)}
                          style={{ color: "red" }}
                        />
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
              <Row justify={"space-between"} style={{ marginBottom: 10 }}>
                <Col span={22}>
                  {deliveryType === "delivery" && (
                    <Typography.Text>ค่าบริการจัดส่ง</Typography.Text>
                  )}
                </Col>
                <Col span={2}>
                  <Typography.Text>
                    {deliveryType === "delivery" ? "20" : ""}
                  </Typography.Text>
                </Col>
              </Row>
              <Row justify={"space-between"}>
                <Typography.Text strong>
                  Total Price: {totalPrice.toFixed(2)}{" "}
                </Typography.Text>
                {/* Add the confirmation button here */}
                <ButtonStyled onClick={handleConfirmOrder}>
                  Confirm Order
                </ButtonStyled>
              </Row>
            </CardStyle>
          )}
        </YourOrderSection>
      </Row>
    </MenuLayout>
  );
};

const CardStyle = styled(Card)`
  box-shadow: 0px 20px 27px #0000000d;
  border-radius: 12px;
  width: 100%;
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
