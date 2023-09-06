import React, { useEffect, useState } from "react";

import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import styled from "styled-components";
import dayjs, { Dayjs } from "dayjs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button, Card, Col, DatePicker, Row, Table, Typography, notification } from "antd";

interface PaymentStatus {
  _id: string;
  order_id: string;
  payment_status: string;
  createdAt: string;
  updatedAt: string;
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
  payment: PaymentStatus;
  foodOrders: FoodOrder[]; // Add this property
  drinkOrders: DrinkOrder[]; // Add this property
}

const ReportMonth = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState({ startDate: "", status: "" });
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    dayjs().toDate()
  );
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<
    { month: string; revenue: number }[]
  >([]);
  const [topSellingFood, setTopSellingFood] = useState<FoodOrder[]>([]);
  const [topSellingDrinks, setTopSellingDrinks] = useState<DrinkOrder[]>([]);
  const [dailyRevenueData, setDailyRevenueData] = useState<
  { date: string; orderCount: number; revenue: number }[]
>([]);
const [completedOrders, setCompletedOrders] = useState<number>(0);
const [canceledOrders, setCanceledOrders] = useState<number>(0);
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
      console.log("Food", result?.data?.data);
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
      console.log("Drink", result?.data?.data);
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
 
  const handleMonthChange = (value: Dayjs | null, dateString: string) => {
    if (value) {
      setSelectedMonth(value.toDate());
    } else {
      setSelectedMonth(null);
    }
  };

  const handleFilterData = () => {
    if (selectedMonth) {
      const selectedYear = selectedMonth.getFullYear();
      const selectedMonthNumber = selectedMonth.getMonth() + 1;
      const formattedMonth =
        selectedMonthNumber < 10
          ? `0${selectedMonthNumber}`
          : `${selectedMonthNumber}`;
      const startDate = `${selectedYear}-${formattedMonth}-01`;
      const endDate = `${selectedYear}-${formattedMonth}-31`;

      const updatedFilter = {
        ...filter,
        startDate,
        endDate,
      };

      QueryOrder(updatedFilter);
    }
  };

  const ordersArray = Object.values(orders);

  const filteredOrders = selectedMonth
    ? ordersArray.filter((order) => {
        const orderDate = new Date(order.order_date);
        const orderMonth = orderDate.getMonth();
        const orderYear = orderDate.getFullYear();

        return (
          orderMonth === selectedMonth.getMonth() &&
          orderYear === selectedMonth.getFullYear()
        );
      })
    : [];

    const calculateDailyRevenue = () => {
      const orderArray = Object.values(orders); // Convert orders object to an array
    
      // Use the nullish coalescing operator to provide a default value if selectedMonth is null
      const selectedYear = selectedMonth?.getFullYear() ?? new Date().getFullYear();
    
      // Initialize an array to store daily revenue data
      const dailyRevenueArray: {
        date: string;
        orderCount: number;
        revenue: number;
      }[] = [];
    
      orderArray.forEach((order) => {
        const orderDate = new Date(order.order_date);
        
        // Use optional chaining to access properties of selectedMonth safely
        const orderYear = orderDate.getFullYear();
        const selectedMonthNumber = selectedMonth?.getMonth();
    
        // Check if the order belongs to the selected year and month (if selectedMonth is defined)
        if (orderYear === selectedYear && selectedMonthNumber !== undefined && orderDate.getMonth() === selectedMonthNumber) {
          const formattedDate = format(orderDate, "dd/MM/yyyy");
          const totalAmount = order.total_amount;
    
          // Check if the date already exists in the dailyRevenueArray
          const existingData = dailyRevenueArray.find((data) => data.date === formattedDate);
          if (!existingData) {
            dailyRevenueArray.push({
              date: formattedDate,
              orderCount: 1,
              revenue: totalAmount,
            });
          } else {
            existingData.orderCount += 1;
            existingData.revenue += totalAmount;
          }
        }
      });
    
      setDailyRevenueData(dailyRevenueArray);
    };
    
  const calculateMonthlyRevenue = () => {
    const orderArray = Object.values(orders); // Convert orders object to an array
    const selectedYear = selectedMonth
      ? selectedMonth.getFullYear()
      : new Date().getFullYear();

    // Initialize a Map to store monthly revenue
    const monthlyRevenueMap = new Map();

    orderArray.forEach((order) => {
      const orderDate = new Date(order.order_date);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();

      // Check if the order belongs to the selected year
      if (orderYear === selectedYear) {
        const formattedMonth = format(orderDate, "MMMM yyyy");
        const totalAmount = order.total_amount;

        if (!monthlyRevenueMap.has(formattedMonth)) {
          monthlyRevenueMap.set(formattedMonth, totalAmount);
        } else {
          monthlyRevenueMap.set(
            formattedMonth,
            monthlyRevenueMap.get(formattedMonth) + totalAmount
          );
        }
      }
    });

    const monthlyRevenueArray = Array.from(monthlyRevenueMap).map(
      ([month, revenue]) => ({
        month,
        revenue,
      })
    );

    setMonthlyRevenueData(monthlyRevenueArray);
  };

  const calculateTopSellingFood = () => {
    const foodMap = new Map<string, number>(); // Use string as the key type

    // Iterate through the keys (order IDs) in the orders object
    for (const orderId in orders) {
      if (orders.hasOwnProperty(orderId)) {
        const order = orders[orderId];

        // Access foodOrders within each order
        order.foodOrders.forEach((foodOrder) => {
          const { food_id, quantity } = foodOrder;

          // Check if the food item already exists in the foodMap
          if (!foodMap.has(food_id)) {
            foodMap.set(food_id, quantity);
          } else {
            const existingQuantity = foodMap.get(food_id) || 0; // Default to 0 if not found
            foodMap.set(food_id, existingQuantity + quantity);
          }
        });
      }
    }

    // Inside the calculateTopSellingFood function
    const topSellingFoodArray = Array.from(foodMap).map(
      ([food_id, quantity]) => ({
        _id: "", // Provide a suitable value for _id
        order_id: "", // Provide a suitable value for order_id
        createdAt: "", // Provide a suitable value for createdAt
        updatedAt: "", // Provide a suitable value for updatedAt
        food_id,
        quantity,
      })
    );

    // Sort the topSellingFoodArray by quantity sold in descending order
    topSellingFoodArray.sort((a, b) => b.quantity - a.quantity);

    // Set the topSellingFood state using setTopSellingFood
    setTopSellingFood(topSellingFoodArray);
  };
  const calculateTopSellingDrinks = () => {
    const drinkSalesMap = new Map<string, number>(); // Use the same map for accumulation

    // Filter orders for the selected month
    const filteredDrinkOrders = ordersArray.filter((order) => {
      const orderDate = new Date(order.order_date);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();

      return (
        selectedMonth &&
        orderMonth === selectedMonth.getMonth() &&
        orderYear === selectedMonth.getFullYear()
      );
    });

    // Iterate through filtered drink orders and accumulate quantities
    filteredDrinkOrders.forEach((order) => {
      order.drinkOrders.forEach((drinkOrder) => {
        const { drink_id, quantity } = drinkOrder;

        // Check if the drink item already exists in the drinkSalesMap
        if (!drinkSalesMap.has(drink_id)) {
          drinkSalesMap.set(drink_id, quantity);
        } else {
          const existingQuantity = drinkSalesMap.get(drink_id) || 0;
          drinkSalesMap.set(drink_id, existingQuantity + quantity);
        }
      });
    });

    // Convert the drinkSalesMap to an array of objects
    const topSellingDrinksArray = Array.from(drinkSalesMap).map(
      ([drink_id, quantity]) => ({
        _id: "", // Provide a suitable value for _id
        order_id: "", // Provide a suitable value for order_id
        createdAt: "", // Provide a suitable value for createdAt
        updatedAt: "", // Provide a suitable value for updatedAt
        drink_id,
        quantity,
      })
    );

    // Sort the topSellingDrinksArray by quantity sold in descending order
    topSellingDrinksArray.sort((a, b) => b.quantity - a.quantity);

    // Set the topSellingDrinks state using setTopSellingDrinks
    setTopSellingDrinks(topSellingDrinksArray);
  };
  const columns = [
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
    }, 
    {
      title: "ออร์เดอร์ที่เสร็จสมบูรณ์",
      dataIndex: "completedOrders",
      key: "completedOrders",
      render: () => completedOrders,
    },
    {
      title: "ออร์เดอร์ที่ยกเลิก",
      dataIndex: "canceledOrders",
      key: "canceledOrders",
      render: () => canceledOrders,
    },
    {
      title: "จำนวนออร์เดอร์รวม",
      dataIndex: "orderCount",
      key: "orderCount",
    },
    {
      title: "จำนวนเงินรายรับ",
      dataIndex: "revenue",
      key: "revenue",
    }, 
   
  ];
  const foodColumns = [
    {
      title: "Food",
      dataIndex: "food_id", // Assuming "food_id" is the ID field in your table data
      render: (food_id: any) => {
        const foodItem = food.find((item) => item.id === food_id); // Assuming you have the food data in the "food" state
        return foodItem ? foodItem.name : "N/A"; // Display the food name or "N/A" if not found
      },
    },
    {
      title: "Quantity Sold",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  const drinkColumns = [
    {
      title: "Drink",
      dataIndex: "drink_id", 
      render: (drink_id: any) => {
        const drinkItem = drink.find((item) => item.id === drink_id); 
        return drinkItem ? drinkItem.name : "N/A"; 
      },
    },
    {
      title: "Quantity Sold",
      dataIndex: "quantity",
      key: "quantity",
    },
    // Add additional columns as needed
  ];
  useEffect(() => {
    const orderArray = Object.values(orders);

    // Calculate the number of completed and canceled orders
    const completedOrdersCount = orderArray.filter((order) => order.status === 'completed').length;
    const canceledOrdersCount = orderArray.filter((order) => order.status === 'canceled').length;

    // Update the state with the counts
    setCompletedOrders(completedOrdersCount);
    setCanceledOrders(canceledOrdersCount);

   

  }, [orders]);
  useEffect(() => {
    calculateTopSellingFood();
    calculateTopSellingDrinks();
  }, [orders]);

  useEffect(() => {
    queryFood(foodFilter);
    queryDrink(drinkFilter);
  }, [foodFilter, setFoodFilter, drinkFilter, setDrinkFilter]);
  
  useEffect(() => {
    const initialFilter = {};
    QueryOrder(initialFilter);
    handleFilterData();
    calculateMonthlyRevenue();
  }, []);

  useEffect(() => {
    handleFilterData();
  }, [selectedMonth]);
  useEffect(() => {
    calculateMonthlyRevenue();
  }, [monthlyRevenueData]);
  useEffect(() => {
    calculateDailyRevenue();
  }, [selectedMonth, orders]);
  
  return (
    <CardStyle
      bordered={false}
      title={
        <Row justify={"space-between"}>
          <Col>
            <Typography>รายงานรายรับรายเดือน</Typography>
          </Col>
          <Col>
            <DatePicker.MonthPicker
              onChange={handleMonthChange}
              style={{ marginRight: 10 }}
            />
            <Button type="primary" onClick={handleFilterData}>
              กรองข้อมูล
            </Button>
          </Col>
        </Row>
      }
      style={{ marginTop: 20 }}
    >
      <Row justify={"center"} style={{ marginTop: 20 }}>
        <BarChart
          width={1000}
          height={400}
          data={monthlyRevenueData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#8884d8" />
        </BarChart>
      </Row>

      <Row style={{ marginTop: 20 }}>
  <Typography.Text strong style={{ fontSize: 20, marginBottom: 10 }}>
    รายงานรายรับรายวัน
  </Typography.Text>
  <Table
    style={{ fontSize: 14, width: "100%", overflow: "auto" }}
    dataSource={dailyRevenueData}
    columns={columns}
    rowKey={(record: any) => record.date}
  />
</Row>

      <Row style={{ marginTop: 20 }} gutter={[24,0]} justify={"center"} >
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
 
          <Typography.Text strong>Top-Selling Food</Typography.Text>
          <Table
            style={{ fontSize: 14, width: "100%", overflow: "auto" }}
            dataSource={topSellingFood}
            columns={foodColumns}
            rowKey={(record: { food_id: any; }) => record.food_id}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
 
          <Typography.Text strong>Top-Selling Drink</Typography.Text>
          <Table
            style={{ fontSize: 14, width: "100%", overflow: "auto" }}
            dataSource={topSellingDrinks}
            columns={drinkColumns}
            rowKey={(record:any) => record.drink_id}
          />
        </Col>
      </Row>
    </CardStyle>
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

export default ReportMonth;
