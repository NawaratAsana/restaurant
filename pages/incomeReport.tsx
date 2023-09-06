import {
  Button,
  Card,
  Col,
  Layout,
  Row,
  Table,
  Typography,
  notification,
} from "antd";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Chart from "chart.js/auto";
import reportDay from "../component/Layout/Report/reportDay";
import ReportMonth from "../component/Layout/Report/reportMonth";
import ReportDay from "../component/Layout/Report/reportDay";
import ReportYear from "../component/Layout/Report/reportYear";

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
const IncomeReportPage = () => {
  const [showReportDay, setShowReportDay] = useState(true); // เพิ่มสถานะเพื่อควบคุมการแสดงหน้า reportMonth
  const [showReportMonth, setShowReportMonth] = useState(false); // เพิ่มสถานะเพื่อควบคุมการแสดงหน้า reportMonth
  const [showReportYear, setShowReportYear] = useState(false); // เพิ่มสถานะเพื่อควบคุมการแสดงหน้า reportYear

  return (
    <Layout>
      <Row>
        <Col span={24}>
          <CardStyle bordered={false} style={{ marginTop: 20 }}>
            <Button
              onClick={() => {
                setShowReportDay(true);
                setShowReportMonth(false);
                setShowReportYear(false);
              }}
              style={{ marginRight: 8 }}
            >
              รายรับรายวัน
            </Button>
            <Button
              onClick={() => {
                setShowReportMonth(true);
                setShowReportDay(false);
                setShowReportYear(false);
              }}
              style={{ marginRight: 8 }}
            >
              รายรับรายเดือน
            </Button>
            <Button
              onClick={() => {
                setShowReportYear(true);
                setShowReportDay(false);
                setShowReportMonth(false);
              }}
            >
              รายรับรายปี
            </Button>
          </CardStyle>
        </Col>
      </Row>

       
        {showReportDay && <ReportDay />}
       
        {showReportMonth && <ReportMonth />}
      
        {showReportYear && <ReportYear />}
      
    </Layout>
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
export default IncomeReportPage;
