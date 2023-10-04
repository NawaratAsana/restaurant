import {
  Button,
  Card,
  Col,
  DatePicker,
  Progress,
  Row,
  Table,
  Typography,
  notification,
} from "antd";
import axios from "axios";
import { format } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
} from "recharts";
import ReportDayModal from "./ReportDayModal";
import { PrinterOutlined } from "@ant-design/icons";

interface PaymentStatus {
  _id: string;
  order_id: string;
  payment_status: string;
  payment_type: string;
  createdAt: string;
  updatedAt: string;
}

interface FoodOrder {
  quantity: number;
  food_id: string;
}

interface DrinkOrder {
  quantity: number;
  drink_id: string;
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
  foodOrders: FoodOrder[];
  drinkOrders: DrinkOrder[];
}

const ReportDay = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({ startDate: "", status: "" });
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dailyRevenueData, setDailyRevenueData] = useState<
    { date: string; revenue: number }[]
  >([]);
  const [deliveryTypeCounts, setDeliveryTypeCounts] = useState({
    dineIn: { count: 0, total: 0 },
    takeaway: { count: 0, total: 0 },
    delivery: { count: 0, total: 0 },
  });
  const [paymentTypeData, setPaymentTypeData] = useState([]);

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
  const [topSellingFood, setTopSellingFood] = useState<FoodOrder[]>([]);
  const [topSellingDrinks, setTopSellingDrinks] = useState<DrinkOrder[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrdersToday, setTotalOrdersToday] = useState(0);
 
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
  const handleFilterData = () => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const updatedFilter = {
        ...filter,
        startDate: formattedDate,
      };
      QueryOrder(updatedFilter);
    }
  };
  const selectedDateFormatted = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : "";

  const ordersArray = Object.values(orders);
  const filteredOrders = Object.values(orders).filter((order) => {
    const orderDate = new Date(order.order_date).toISOString().split("T")[0];
    return orderDate === selectedDateFormatted;
  });

  // console.log("topSellingFood", topSellingFood);
  const calculateTopSellingFood = () => {
    const foodMap = new Map<string, number>(); // Use string as the key type

    // Iterate through the keys (order IDs) in the orders object
    for (const orderId in orders) {
      if (orders.hasOwnProperty(orderId)) {
        const order = orders[orderId];

        // Check if the order belongs to the selected date
        const orderDate = new Date(order.order_date);
        const orderDateFormatted = orderDate.toISOString().split("T")[0];

        if (orderDateFormatted === selectedDateFormatted) {
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
    }

    // Inside the calculateTopSellingFood function
    const topSellingFoodArray = Array.from(foodMap).map(
      ([food_id, quantity]) => ({
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
    const drinkSalesMap = new Map<string, number>(); // ใช้ Map เพื่อเก็บจำนวนการขาย

    // กรองรายการคำสั่งซื้อที่เกี่ยวข้องกับวันที่เลือก
    const filteredDrinkOrders = ordersArray.filter((order) => {
      const orderDate = new Date(order.order_date);
      const orderDateFormatted = orderDate.toISOString().split("T")[0];

      return orderDateFormatted === selectedDateFormatted;
    });

    // นับจำนวนการขายของเครื่องดื่มแต่ละรายการ
    filteredDrinkOrders.forEach((order) => {
      order.drinkOrders.forEach((drinkOrder) => {
        const { drink_id, quantity } = drinkOrder;

        // ตรวจสอบว่ารายการเครื่องดื่มมีอยู่ใน Map หรือไม่
        if (!drinkSalesMap.has(drink_id)) {
          drinkSalesMap.set(drink_id, quantity);
        } else {
          const existingQuantity = drinkSalesMap.get(drink_id) || 0;
          drinkSalesMap.set(drink_id, existingQuantity + quantity);
        }
      });
    });

    // แปลง Map เป็นอาร์เรย์ของออบเจกต์
    const topSellingDrinksArray = Array.from(drinkSalesMap).map(
      ([drink_id, quantity]) => ({
        drink_id,
        quantity,
      })
    );

    // เรียงลำดับอาร์เรย์ตามจำนวนการขายในลำดับที่ตกลงกัน
    topSellingDrinksArray.sort((a, b) => b.quantity - a.quantity);

    // กำหนดค่า state topSellingDrinks ด้วย setTopSellingDrinks
    setTopSellingDrinks(topSellingDrinksArray);
  };

  const handleDateChange = (value: Dayjs | null, dateString: string) => {
    if (value) {
      setSelectedDate(value.toDate());
      console.log("SelectDate", value.toDate());
    } else {
      setSelectedDate(null);
      console.log("SelectDate", null);
    }
  };
  const calculateDeliveryType = () => {
    let dineInCount = 0;
    let takeawayCount = 0;
    let deliveryCount = 0;
    
    // Reset the totals before recalculating
    deliveryTypeCounts.dineIn.total = 0;
    deliveryTypeCounts.takeaway.total = 0;
    deliveryTypeCounts.delivery.total = 0;
  
    // Iterate through the filteredOrders to calculate totals
    filteredOrders.forEach((order) => {
      if (order.delivery_type === "Dine-in") {
        dineInCount++;
        deliveryTypeCounts.dineIn.total += order.total_amount;
      } else if (order.delivery_type === "Takeaway") {
        takeawayCount++;
        deliveryTypeCounts.takeaway.total += order.total_amount;
      } else if (order.delivery_type === "Delivery") {
        deliveryCount++;
        deliveryTypeCounts.delivery.total += order.total_amount;
      }
    });
  
    // Update the counts in the state
    setDeliveryTypeCounts({
      dineIn: { count: dineInCount, total: deliveryTypeCounts.dineIn.total },
      takeaway: {
        count: takeawayCount,
        total: deliveryTypeCounts.takeaway.total,
      },
      delivery: {
        count: deliveryCount,
        total: deliveryTypeCounts.delivery.total,
      },
    });
  };
  

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_number",
      key: "order_number",
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
      title: "Total Amount",
      dataIndex: "total_amount",
      render: (total_amount: number) => (
        <span>
          {total_amount.toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
          })}
        </span>
      ),
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
  const handleOpen = () => {
    setOpen(true);
    dailyRevenueData;
    filteredOrders;
    selectedDate;
  };
  const calculateDailyRevenue = () => {
    const orderArray = Object.values(orders);
    const selectedYear =
    selectedDate?.getFullYear() ?? new Date().getFullYear();

  const dailyRevenueArray: {
    date: string;
    orderCount: number;
    revenue: number;
  }[] = [];
  orderArray.forEach((order) => {
    const orderDate = new Date(order.order_date);

    // Use optional chaining to access properties of selectedMonth safely
    const orderYear = orderDate.getFullYear();
    const selectedMonthNumber = selectedDate?.getMonth();

    // Check if the order belongs to the selected year and month (if selectedMonth is defined)
    if (
      orderYear === selectedYear &&
      selectedMonthNumber !== undefined &&
      orderDate.getMonth() === selectedMonthNumber
    ) {
      const formattedDate = format(orderDate, "dd/MM/yyyy");
      const totalAmount = order.total_amount;
    

      // Check if the date already exists in the dailyRevenueArray
      const existingData = dailyRevenueArray.find(
        (data) => data.date === formattedDate
      );

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
    const currentDate = new Date(); // Get the current date
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Get the current month (0-11)
    const currentDay = currentDate.getDate(); // Get the current day of the month
  
    // Calculate the total revenue for today
    const totalRevenueToday = filteredOrders.reduce((totalRevenue, order) => {
      const orderDate = new Date(order.order_date);
      const orderYear = orderDate.getFullYear();
      const orderMonth = orderDate.getMonth();
      const orderDay = orderDate.getDate();
  
      // Check if the order date matches the current date
      if (
        orderYear === currentYear &&
        orderMonth === currentMonth &&
        orderDay === currentDay
      ) {
        // Add the total_amount of the order to the total revenue
        totalRevenue += order.total_amount;
      }
  
      return totalRevenue;
    }, 0);
  
    // Calculate the total number of orders for today
    const totalOrdersToday = filteredOrders.reduce((totalOrders, order) => {
      const orderDate = new Date(order.order_date);
      const orderYear = orderDate.getFullYear();
      const orderMonth = orderDate.getMonth();
      const orderDay = orderDate.getDate();
  
      // Check if the order date matches the current date
      if (
        orderYear === currentYear &&
        orderMonth === currentMonth &&
        orderDay === currentDay
      ) {
        // Increment the count for each matching order
        totalOrders++;
      }
  
      return totalOrders;
    }, 0);
  
  

  
    // Set the total revenue and total orders for today in the state
    setTotalRevenue(totalRevenueToday);
    setTotalOrdersToday(totalOrdersToday);
  
    // Set the daily revenue data state
    setDailyRevenueData(dailyRevenueArray);
  };
  
  

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
    const initialFilter = {};
    QueryOrder(initialFilter);
    calculateDailyRevenue();
    handleFilterData();
  }, []);

  useEffect(() => {
    calculateTopSellingFood();
    calculateTopSellingDrinks();
    calculateDailyRevenue();
    calculateDeliveryType();
  }, [selectedDate]);

  useEffect(() => {
    calculateTopSellingFood();
    calculateTopSellingDrinks();
    calculateDailyRevenue();
    calculateDeliveryType();
  }, [orders]);
  useEffect(() => {
    queryFood(foodFilter);
    queryDrink(drinkFilter);
  }, [foodFilter, setFoodFilter, drinkFilter, setDrinkFilter]);

  return (
    <CardStyle
      style={{ marginBottom: 50 }}
      bordered={false}
      title={
        <Row justify={"space-between"}>
          <Col>
            <Typography>รายงานรายรับรายวัน</Typography>
          </Col>
          <Col>
            <DatePicker
              onChange={handleDateChange}
              style={{ marginRight: 10 }}
            />
            <Button
              type="primary"
              onClick={handleFilterData}
              style={{ marginRight: 10 }}
            >
              กรองข้อมูล
            </Button>
            <Button type="primary" onClick={handleOpen}>
              <PrinterOutlined />
              พิมพ์รายงาน
            </Button>
          </Col>
        </Row>
      }
    >
      <div>
        <Row style={{ marginTop: 20 }}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Typography.Text strong style={{ fontSize: 18 }}>
              รายรับรายวันนี้ทั้งหมด: {totalRevenue}
            </Typography.Text>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Typography.Text strong style={{marginBottom:20}}>
            กราฟรายรับรายวัน
            </Typography.Text>
            <BarChart
            width={500}
            height={300}
            data={dailyRevenueData}
           
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                return date.split("/")[0];
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" name="รายรับ" />
          </BarChart>
            </Col>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Typography.Text strong style={{ marginTop: 20, fontSize: 18 }}>
              จำนวนออร์เดอร์ทั้งหมดของวันนี้: {totalOrdersToday} orders
            </Typography.Text>
            <br />

            <Typography.Text strong style={{ marginBottom: 20 }}>
              ประเภทการจัดส่ง
            </Typography.Text>
            <div>
            <span>Dine-in: {deliveryTypeCounts.dineIn.count} orders</span>
              <span style={{marginLeft:10}}>Total: {deliveryTypeCounts.dineIn.total} THB</span>
              <Progress
                percent={parseFloat(
                  (
                    (deliveryTypeCounts.dineIn.count / totalOrdersToday) *
                    100
                  ).toFixed(2)
                )}
                status="active"
                showInfo={true}
              
                className="dine-in-progress"
              />
            </div>
            <div>
              <span>Takeaway: {deliveryTypeCounts.takeaway.count} orders</span>
              <span style={{marginLeft:10}}>Total: {deliveryTypeCounts.takeaway.total} THB </span>
              <Progress
                percent={parseFloat(
                  (
                    (deliveryTypeCounts.takeaway.count / totalOrdersToday) *
                    100
                  ).toFixed(2)
                )}
                status="active"
                showInfo={true}
            

                className="takeaway-progress"
              />
            </div>
            <div>
              <span>Delivery: {deliveryTypeCounts.delivery.count} orders</span>
              <span style={{marginLeft:10}}>Total: {deliveryTypeCounts.delivery.total} THB</span>
              <Progress
                percent={parseFloat(
                  (
                    (deliveryTypeCounts.delivery.count / totalOrdersToday) *
                    100
                  ).toFixed(2)
                )}
                status="active"
                showInfo={true}
               
                className="delivery-progress"
              />
            </div>
          </Col>
        </Row>
      </div>

      <Row style={{ marginTop: 20 }} gutter={[24, 0]} justify={"center"}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Typography.Text strong style={{ marginBottom: 20 }}>
            อาหารขายดีประจำวัน
          </Typography.Text>
          <Table
            style={{
              fontSize: 14,
              width: "100%",
              overflow: "auto",
            }}
            dataSource={topSellingFood.slice(0, 5)} // จำกัดให้แสดงเฉพาะ 10 อันดับแรก
            columns={foodColumns}
            rowKey={(record: any) => record.food_id}
            pagination={false}
          />
        </Col>

        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Typography.Text strong style={{ marginBottom: 20 }}>
            เครื่องดื่มขายดีประจำวัน
          </Typography.Text>
          <Table
            style={{
              fontSize: 14,
              width: "100%",
              overflow: "auto",
            }}
            dataSource={topSellingDrinks.slice(0, 5)}
            columns={drinkColumns}
            rowKey={(record: any) => record.drink_id}
            pagination={false}
          />
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Typography.Text strong style={{ marginBottom: 20 }}>
          รายการสั่งอาหารประจำวัน
        </Typography.Text>
        <Table
          style={{ fontSize: 14, width: "100%", overflow: "auto" }}
          dataSource={Object.values(filteredOrders)}
          columns={columns}
          rowKey={(record: any) => record.order_id}
          pagination={{
            pageSize: 10, // จำนวนรายการต่อหน้า
            showTotal: (total, range) =>
              `แสดง ${range[0]} - ${range[1]} จากทั้งหมด ${total} รายการ`, // แสดงข้อความที่บอกจำนวนรายการที่แสดง
          }}
        />
      </Row>
      {ReportDayModal(
        open,
        setOpen,
        filteredOrders,
        dailyRevenueData,
        selectedDate,
        totalRevenue,
        topSellingFood,
        topSellingDrinks
      )}
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
  };
  `;
export default ReportDay;
