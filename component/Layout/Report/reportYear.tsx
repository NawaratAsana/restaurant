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
import {
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Table,
  Typography,
  notification,
} from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import ReportYearModal from "./ReportYearModal";
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
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({ startDate: "", status: "" });
  const [selectedYear, setSelectedYear] = useState<number | null>(
    new Date().getFullYear() // เริ่มต้นให้เป็นปีปัจจุบัน
  );

  const [monthlyFilteredRevenueData, setMonthlyFilteredRevenueData] = useState<
    { month: string; orderCount: number; revenue: number }[]
  >([]);

  const [yearlyRevenueData, setYearlyRevenueData] = useState<
    { year: number; revenue: number }[]
  >([]);
 
  const [selectedYearString, setSelectedYearString] = useState<string>("");
 console.log("yearlyRevenueData", yearlyRevenueData);
 console.log("selectedYearString", selectedYearString);
 console.log("monthlyFilteredRevenueData", monthlyFilteredRevenueData);


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

  const handleYearChange = (
    selectedYear: Dayjs | null,
    selectedYearString: string
  ) => {
    if (selectedYear) {
      setSelectedYear(selectedYear.year());
      setSelectedYearString(selectedYearString);
      const startDate = `${selectedYearString}-01-01`;
      const endDate = `${selectedYearString}-12-31`;
      const updatedFilter = {
        ...filter,
        startDate,
        endDate,
      };
      QueryOrder(updatedFilter);
    
      calculateMonthlyRevenue();
      handleFilterData();
    } else {
      setSelectedYear(null);
      setSelectedYearString("");
    }
  };

  const handleFilterData = () => {
    if (selectedYearString !== "") {
      const startDate = `${selectedYearString}-01-01`;
      const endDate = `${selectedYearString}-12-31`;

      const updatedFilter = {
        ...filter,
        startDate,
        endDate,
      };

      QueryOrder(updatedFilter);
    }
  };

  const ordersArray = Object.values(orders);

  const filteredOrders = selectedYear
    ? ordersArray.filter((order) => {
        const orderDate = new Date(order.order_date);
        const orderYear = orderDate.getFullYear();

        return orderYear === selectedYear;
      })
    : [];



  const calculateMonthlyRevenue = () => {
    const orderArray = Object.values(orders);
    if (selectedYear) {
      const monthlyRevenueMap = new Map();

      orderArray.forEach((order) => {
        // เปลี่ยนจาก filteredOrders เป็น orders
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
              completedOrders: order.status === "completed" ? 1 : 0,
              canceledOrders: order.status === "canceled" ? 1 : 0,
            });
          } else {
            const existingData = monthlyRevenueMap.get(formattedDate);
            monthlyRevenueMap.set(formattedDate, {
              month: formattedDate,
              orderCount: existingData.orderCount + 1,
              revenue: existingData.revenue + order.total_amount,
              completedOrders:
                existingData.completedOrders +
                (order.status === "completed" ? 1 : 0),
              canceledOrders:
                existingData.canceledOrders +
                (order.status === "canceled" ? 1 : 0),
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
  ];

  const handleOpen = () => {
    setOpen(true);
    yearlyRevenueData;
    filteredOrders;
    monthlyFilteredRevenueData;
    selectedYear;
  };

  useEffect(() => {
    if (selectedYear === null) {
      setSelectedYear(new Date().getFullYear());
      setSelectedYearString(new Date().getFullYear().toString());
    }

    const initialFilter = {
      startDate: `${selectedYearString}-01-01`,
      endDate: `${selectedYearString}-12-31`,
    };
    QueryOrder(initialFilter);
    
   
    handleFilterData(); 
    calculateMonthlyRevenue();
  }, []);
  useEffect(() => {
  
    calculateMonthlyRevenue();
  }, [orders]);
  return (
    <CardStyle
      bordered={false}
      style={{ fontFamily: "Sarabun" }}
      title={
        <Row justify={"space-between"}>
          <Col>
            <Typography>รายงานรายรับรายปี</Typography>
          </Col>
          <Col>
            <DatePicker.YearPicker
              onChange={handleYearChange}
              style={{ marginRight: 10 }}
            />
            <Button
              type="primary"
              onClick={handleFilterData}
              style={{ marginRight: 10 }}
            >
              กรองข้อมูล
            </Button>
            <Button type="primary" onClick={handleOpen} style={{}}>
              <PrinterOutlined />
              พิมพ์รายงาน
            </Button>
          </Col>
        </Row>
      }
    >
      <Row justify={"center"} style={{ marginTop: 20 }}>
        {/* Modify the LineChart to display yearly revenue */}
        <LineChart width={800} height={400} data={monthlyFilteredRevenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
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

      <Row style={{ marginTop: 20 }} justify={"center"}>
        <Table
          style={{ fontSize: 14, width: "95%", overflow: "auto" }}
          dataSource={monthlyFilteredRevenueData}
          columns={monthlyColumns}
          rowKey="month" 
          pagination={false} 
          
        />
      </Row>
      {ReportYearModal(
        open,
        setOpen,
        yearlyRevenueData,
        filteredOrders,
        monthlyFilteredRevenueData,
        selectedYear
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
`;

export default ReportYear;
