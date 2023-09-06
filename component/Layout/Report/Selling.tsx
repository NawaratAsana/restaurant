import { Table, notification } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
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
  foodOrders: FoodOrder[];
  drinkOrders: DrinkOrder[];
}
const Selling = () => {
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
      setOrders(result?.data?.data?.combinedOrders);
      console.log("Ordes", orders);
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

  const [filter, setFilter] = useState({});

  useEffect(() => {
    queryFood(foodFilter);
    queryDrink(drinkFilter);
    QueryOrder(filter); // Move this here if it should be called when filters change
  }, [foodFilter, drinkFilter, filter]);
// สร้างข้อมูลเริ่มต้นของรายการขายรายเดือน
const monthlySalesData: Record<string, Record<string, number>> = {}; // Key: Year-Month, Value: Sales Data

// Function เพื่ออัปเดตรายการขายรายเดือนเมื่อมีคำสั่งใหม่เข้ามา
const updateMonthlySalesData = (order: any) => {
  const orderDate = new Date(order.order_date);
  const year = orderDate.getFullYear();
  const month = orderDate.getMonth() + 1; // เดือนจะเริ่มต้นที่ 0, เพิ่ม 1 เพื่อให้ตรงกับเดือนจริง

  const yearMonthKey = `${year}-${month}`;

  if (!monthlySalesData[yearMonthKey]) {
    monthlySalesData[yearMonthKey] = {};
  }

  if (order.foodOrders && order.foodOrders.length > 0) {
    order.foodOrders.forEach((foodOrder: any) => {
      // อัปเดตข้อมูลการขายสินค้าในคำสั่ง
      const foodId = foodOrder.food_id;
      const quantity = foodOrder.quantity;
  
      if (!monthlySalesData[yearMonthKey][foodId]) {
        monthlySalesData[yearMonthKey][foodId] = 0;
      }
  
      monthlySalesData[yearMonthKey][foodId] += quantity;
    });
  }
  if (order.drinkOrders && order.drinkOrders.length > 0) {
    order.drinkOrders.forEach((drinkOrder: any) => {
      // อัปเดตข้อมูลการขายสินค้าในคำสั่ง
      const drinkId = drinkOrder.food_id;
      const quantity = drinkOrder.quantity;
  
      if (!monthlySalesData[yearMonthKey][drinkId]) {
        monthlySalesData[yearMonthKey][drinkId] = 0;
      }
  
      monthlySalesData[yearMonthKey][drinkId] += quantity;
    });
  }
    

  
};

// ตัวอย่าง: อัปเดตข้อมูลรายการขายรายเดือนเมื่อมีคำสั่งใหม่
const newOrder = { /* ข้อมูลคำสั่งใหม่ของคุณ */ };
updateMonthlySalesData(newOrder);

// Function เพื่อดึงข้อมูลรายการขายรายเดือนสำหรับปีและเดือนที่ระบุ
const getMonthlySalesData = (year: number, month: number) => {
  const yearMonthKey = `${year}-${month}`;
  return monthlySalesData[yearMonthKey] || {};
};

// ตัวอย่าง: ดึงและแสดงข้อมูลรายการขายรายเดือนสำหรับเดือนที่ระบุ
const selectedYear = 2023;
const selectedMonth = 8; // เดือนสิงหาคม
const monthlyData = getMonthlySalesData(selectedYear, selectedMonth);
console.log(`ข้อมูลการขายสำหรับ ${selectedYear}-${selectedMonth}:`, monthlyData);

const foodSalesData = {}; // สร้างออบเจ็กต์เก็บข้อมูลการขายอาหาร
const drinkSalesData = {}; // สร้างออบเจ็กต์เก็บข้อมูลการขายเครื่องดื่ม

orders.forEach((order) => {
  order.foodOrders.forEach((foodOrder) => {
    const foodId = foodOrder.food_id;
    const quantity = foodOrder.quantity;

    if (!foodSalesData[foodId]) {
      foodSalesData[foodId] = 0;
    }

    foodSalesData[foodId] += quantity;
  });

  order.drinkOrders.forEach((drinkOrder) => {
    const drinkId = drinkOrder.drink_id;
    const quantity = drinkOrder.quantity;

    if (!drinkSalesData[drinkId]) {
      drinkSalesData[drinkId] = 0;
    }

    drinkSalesData[drinkId] += quantity;
  });
});

  const calculateTop10Items = () => {
    const itemQuantity: Record<string, number> = {};

    Object.values(orders).forEach((order) => {
      // Loop through foodOrders
      order.foodOrders.forEach((foodOrder) => {
        const foodId = foodOrder.food_id;
        const quantity = foodOrder.quantity;

        // Update itemQuantity or initialize it with quantity if not exists
        if (itemQuantity[foodId]) {
          itemQuantity[foodId] += quantity;
        } else {
          itemQuantity[foodId] = quantity;
        }
      });

      // Loop through drinkOrders
      order.drinkOrders.forEach((drinkOrder) => {
        const drinkId = drinkOrder.drink_id;
        const quantity = drinkOrder.quantity;

        // Update itemQuantity or initialize it with quantity if not exists
        if (itemQuantity[drinkId]) {
          itemQuantity[drinkId] += quantity;
        } else {
          itemQuantity[drinkId] = quantity;
        }
      });
    });

    const sortedItems = Object.entries(itemQuantity).sort(
      (a, b) => b[1] - a[1]
    );

    const top10Items = sortedItems.slice(0, 10);

    return top10Items;
  };

  const top10Items = calculateTop10Items(); // Calculate top 10 items

  const foodColumns = [
    {
      title: "อาหาร",
      dataIndex: "foodName",
      key: "foodName",
    },
    {
      title: "ปริมาณขาย",
      dataIndex: "foodQuantity",
      key: "foodQuantity",
    },
  ];
  
  const drinkColumns = [
    {
      title: "เครื่องดื่ม",
      dataIndex: "drinkName",
      key: "drinkName",
    },
    {
      title: "ปริมาณขาย",
      dataIndex: "drinkQuantity",
      key: "drinkQuantity",
    },
  ];
  
  const foodData = Object.keys(foodSalesData).map((foodId) => ({
    key: foodId,
    foodName: food.find((item) => item.id === foodId)?.name,
    foodQuantity: foodSalesData[foodId],
  }));
  
  const drinkData = Object.keys(drinkSalesData).map((drinkId) => ({
    key: drinkId,
    drinkName: drink.find((item) => item.id === drinkId)?.name,
    drinkQuantity: drinkSalesData[drinkId],
  }));
  
  // แสดงข้อมูลการขายอาหารและเครื่องดื่มในตาราง
  return (
    <div>
      <h2>ข้อมูลการขายอาหาร</h2>
      <Table columns={foodColumns} dataSource={foodData} pagination={false} />
      
      <h2>ข้อมูลการขายเครื่องดื่ม</h2>
      <Table columns={drinkColumns} dataSource={drinkData} pagination={false} />
    </div>
  );
  
  
};

export default Selling;
