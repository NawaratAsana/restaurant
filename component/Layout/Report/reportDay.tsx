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
} from "recharts";

interface PaymentStatus {
  _id: string;
  order_id: string;
  payment_status: string;
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

  const handleDateChange = (value: Dayjs | null, dateString: string) => {
    if (value) {
      setSelectedDate(value.toDate());
      console.log("SelectDate", value.toDate());
    } else {
      setSelectedDate(null);
      console.log("SelectDate", null);
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

  const filteredOrders = Object.values(orders).filter((order) => {
    const orderDate = new Date(order.order_date).toISOString().split("T")[0];
    return orderDate === selectedDateFormatted;
  });

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
      key: "total_amount",
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

  const calculateDailyRevenue = () => {
    const orderArray = Object.values(orders);
    const selectedMonth = selectedDate
      ? selectedDate.getMonth()
      : new Date().getMonth();
    const selectedYear = selectedDate
      ? selectedDate.getFullYear()
      : new Date().getFullYear();

    // Initialize a Map to store daily revenue
    const dailyRevenueMap = new Map();

    orderArray.forEach((order) => {
      const orderDate = new Date(order.order_date);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();

      // Check if the order belongs to the selected month and year
      if (orderMonth === selectedMonth && orderYear === selectedYear) {
        const formattedDate = orderDate.toISOString().split("T")[0];
        const totalAmount = order.total_amount;

        if (!dailyRevenueMap.has(formattedDate)) {
          dailyRevenueMap.set(formattedDate, totalAmount);
        } else {
          dailyRevenueMap.set(
            formattedDate,
            dailyRevenueMap.get(formattedDate) + totalAmount
          );
        }
      }
    });

    const dailyRevenueArray = Array.from(dailyRevenueMap).map(
      ([date, revenue]) => ({
        date,
        revenue,
      })
    );
    // Calculate total daily revenue
    const totalRevenue = dailyRevenueArray.reduce(
      (accumulator, entry) => accumulator + entry.revenue,
      0
    );

    setDailyRevenueData(dailyRevenueArray);
  };

  // console.log("dailyRevenueData",dailyRevenueData);
  useEffect(() => {
    const initialFilter = {};
    QueryOrder(initialFilter);
    handleFilterData();
  }, []);

  useEffect(() => {
    calculateDailyRevenue();
  }, [selectedDate]);

  useEffect(() => {
    calculateDailyRevenue();
  }, [dailyRevenueData]);

  return (
    <CardStyle style={{ marginBottom: 50 }}
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
            <Button type="primary" onClick={handleFilterData}>
              กรองข้อมูล
            </Button>
          </Col>
        </Row>
      }
    >
      <Row justify={"center"} style={{ marginTop: 20 }}>
        <LineChart width={800} height={400} data={dailyRevenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            name="Daily Revenue"
          />
        </LineChart>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Table
          style={{ fontSize: 14, width: "100%", overflow: "auto" }}
          dataSource={Object.values(filteredOrders)}
          columns={columns}
          rowKey={(record: any) => record.order_id}
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
  };
  `;
export default ReportDay;
