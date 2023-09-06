import React, { useEffect, useState } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import styled from "styled-components";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th"; // นำเข้า locale ของไทย
import { Button, Card, Col, DatePicker, Row, Table, Typography, notification } from "antd";
dayjs.locale("th"); // กำหนด locale ให้เป็นไทย


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
const ReportYear = () => {


  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState({ startDate: "", status: "" });
  const [selectedYear, setSelectedYear] = useState<number | null>(
    new Date().getFullYear() // เริ่มต้นให้เป็นปีปัจจุบัน
  );
  const [completedOrders, setCompletedOrders] = useState<number>(0);
const [canceledOrders, setCanceledOrders] = useState<number>(0);
  const [monthlyFilteredRevenueData, setMonthlyFilteredRevenueData] = useState<
    { month: string; orderCount: number; revenue: number }[]
  >([]);

  const [yearlyRevenueData, setYearlyRevenueData] = useState<
    { year: number; revenue: number }[]
  >([]);
console.log("Orders",orders)
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

  const handleYearChange = (value: Dayjs | null) => {
    if (value) {
      setSelectedYear(value.year());
    } else {
      setSelectedYear(null);
    }
  };

  const handleFilterData = () => {
    if (selectedYear) {
      const updatedFilter = {
        ...filter,
        startDate: `${selectedYear}-01-01`,
        endDate: `${selectedYear}-12-31`,
      };
      QueryOrder(updatedFilter);
      calculateMonthlyRevenue(updatedFilter);
      calculateYearlyRevenue();
    }
  };

 
  const filteredOrders = Object.values(orders).filter((order) => {
    const orderYear = new Date(order.order_date).getFullYear();
    return orderYear === selectedYear;
  });

  console.log("filteredOrders",filteredOrders)
  
 
  const calculateYearlyRevenue = () => {
    const orderArray = Object.values(orders);
    const yearlyRevenueMap = new Map();
  
    orderArray.forEach((order) => {
      const orderYear = new Date(order.order_date).getFullYear();
  
      if (orderYear === selectedYear) {
        const month = new Date(order.order_date).getMonth() + 1;
        const formattedDate = `${selectedYear}-${month}`;
  
        if (!yearlyRevenueMap.has(formattedDate)) {
          yearlyRevenueMap.set(formattedDate, order.total_amount);
        } else {
          yearlyRevenueMap.set(
            formattedDate,
            yearlyRevenueMap.get(formattedDate) + order.total_amount
          );
        }
      }
    });
  
    const yearlyRevenueArray = Array.from(yearlyRevenueMap).map(
      ([date, revenue]) => ({
        year: date,
        revenue,
      })
    );
  
    setYearlyRevenueData(yearlyRevenueArray); // อัปเดตข้อมูล
  };
  
  const calculateMonthlyRevenue = (filter: any) => {
    if (selectedYear) {
      const monthlyRevenueMap = new Map();
  
      filteredOrders.forEach((order) => {
        const orderYear = new Date(order.order_date).getFullYear();
        const orderMonth = new Date(order.order_date).getMonth();
        const monthNameThai = new Intl.DateTimeFormat("th-TH", {
          month: "long",
        }).format(new Date(order.order_date));
  
        if (orderYear === selectedYear) {
          const formattedDate = `${monthNameThai}`;
  
          if (!monthlyRevenueMap.has(formattedDate)) {
            monthlyRevenueMap.set(formattedDate, {
              month: formattedDate,
              orderCount: 1,
              revenue: order.total_amount,
              completedOrders: order.status === 'completed' ? 1 : 0,
              canceledOrders: order.status === 'canceled' ? 1 : 0,
            });
          } else {
            const existingData = monthlyRevenueMap.get(formattedDate);
            monthlyRevenueMap.set(formattedDate, {
              month: formattedDate,
              orderCount: existingData.orderCount + 1,
              revenue: existingData.revenue + order.total_amount,
              completedOrders: existingData.completedOrders + (order.status === 'completed' ? 1 : 0),
              canceledOrders: existingData.canceledOrders + (order.status === 'canceled' ? 1 : 0),
            });
          }
        }
      });
  
      const monthlyRevenueArray = Array.from(monthlyRevenueMap).map(
        ([month, data]) => data
      );
  
      setMonthlyFilteredRevenueData(monthlyRevenueArray);
    }
  };
  const monthlyColumns = [
    {
      title: "ลำดับ",
      dataIndex: "order",
      key: "order",
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: "เดือน",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "จำนวนออร์เดอร์",
      dataIndex: "orderCount",
      key: "orderCount",
    },
    {
      title: "จำนวนเงินรายรับ",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue: number) => (
        <span>
          {revenue.toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
          })}
        </span>
      ),
    },
    {
      title: "ออร์เดอร์ที่เสร็จสมบูรณ์",
      dataIndex: "completedOrders",
      key: "completedOrders",
    },
    {
      title: "ออร์เดอร์ที่ยกเลิก",
      dataIndex: "canceledOrders",
      key: "canceledOrders",
    },
  ];
  

  useEffect(() => {
    if (selectedYear === null) {
      setSelectedYear(new Date().getFullYear());
    }
    handleFilterData(); 
  }, []);
  
  useEffect(() => {
    if (selectedYear === null) {
      setSelectedYear(new Date().getFullYear());
    }
  
    const initialFilter = {
      startDate: `${selectedYear}-01-01`,
      endDate: `${selectedYear}-12-31`,
    };
    QueryOrder(initialFilter);
    calculateYearlyRevenue();
    calculateMonthlyRevenue(initialFilter);
  }, []);

  return (
    <CardStyle
      bordered={false}
      title={
        <Row justify={"space-between"}>
          <Col>
            <Typography>รายงานรายรับรายปี</Typography>
          </Col>
          <Col>
            <DatePicker.YearPicker
              // ให้ค่า selectedYear เป็นปีปัจจุบัน
              value={selectedYear ? dayjs(`${selectedYear}-01-01`) : null}
              onChange={handleYearChange}
              style={{ marginRight: 10 }}
            />
            <Button type="primary" onClick={handleFilterData}>
              กรองข้อมูล
            </Button>
          </Col>
        </Row>
      }
    >
      <Row justify={"center"} style={{ marginTop: 20 }}>
        {/* Modify the LineChart to display yearly revenue */}
        <LineChart width={800} height={400} data={yearlyRevenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            name="Yearly Revenue"
          />
        </LineChart>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Table
          style={{ fontSize: 14, width: "100%", overflow: "auto" }}
          dataSource={monthlyFilteredRevenueData}
          columns={monthlyColumns}
          rowKey="month" // Set a unique key for each row
          pagination={false} // Disable pagination if needed
        />
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

export default ReportYear;
