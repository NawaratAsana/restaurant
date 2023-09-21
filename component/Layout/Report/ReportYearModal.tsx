import { Button, Col, Modal, Row, Table, Typography } from "antd";
import { addYears, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { th } from "date-fns/locale";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useRef } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components";

const ReportYearModal = (
  open: any,
  setOpen: any,
  yearlyRevenueData: any,
  filteredOrders: any,
  monthlyFilteredRevenueData: any,
  selectedYear: any
) => {
  const totalRevenue = monthlyFilteredRevenueData.reduce(
    (accumulator: number, order: any) => accumulator + order.revenue,
    0
  ); 
  const selectedYearInTZ = utcToZonedTime(selectedYear, "Asia/Bangkok");

  const thaiYear = addYears(selectedYearInTZ, 543);

  const formattedYear = format(thaiYear, "yyyy", { locale: th });

  const formattedDate = `  ปี พ.ศ. ${formattedYear}`;
  // console.log("monthlyFilteredRevenueData",monthlyFilteredRevenueData)
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
      title: "ออร์เดอร์ที่เสร็จสมบูรณ์",
      dataIndex: "completedOrders",
      key: "completedOrders",
    },
    {
      title: "ออร์เดอร์ที่ยกเลิก",
      dataIndex: "canceledOrders",
      key: "canceledOrders",
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

  const modalContentRef = useRef(null);
 
  const createAndPrintPDF = () => {
    // เลือกคอมโพเนนต์ที่คุณต้องการสร้าง PDF
    const contentToPrint = document.getElementById("pdf-export");
  
    if (contentToPrint) {
      // สร้าง PDF โดยใช้ jsPDF
      const pdf = new jsPDF("p", "mm", "a4");
  
      // แปลงเนื้อหาเป็นรูปภาพโดยใช้ html2canvas
      html2canvas(contentToPrint).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
  
        // เพิ่มรูปภาพลงใน PDF
        pdf.addImage(imgData, "PNG", 10, 10, 190, 0);

  
        // บันทึก PDF
        pdf.save("รายงาน.pdf");
      });
    }
  };
  
  return (
    <StyledModal
      width={990}
      open={open}
      onCancel={() => setOpen(false)}
      footer={[
        <Row justify={"center"}>
          <Button onClick={createAndPrintPDF} type="primary">
                Export to PDF
              </Button>
        </Row>,
      ]}
    >
      <div id="pdf-export" style={{ width: "100%" }} ref={modalContentRef}>

      <Row justify={"end"} style={{ paddingRight: 20 }}>
        <Typography.Text strong style={{ fontFamily: "Sarabun", fontSize: 18 }}>
          รายงานรายรับรายปี
        </Typography.Text>
      </Row>
      <Row justify={"end"} style={{ paddingRight: 20 }}>
        <Typography
          style={{
            fontFamily: "Sarabun",
            lineHeight: "1.5",
            marginBottom: 10,
            textAlign: "right", // Right-align the text
          }}
        >
          ห้องอาหารบัวขาวศูนย์ฝึกประสบการณ์วิชาชีพ (H.R.H. Princess Valaya
          Building)
        </Typography>
      </Row>
      <Row justify={"end"} style={{ paddingRight: 20 }}>
        <Typography
          style={{
            lineHeight: "1.5",
            marginBottom: 10,
            textAlign: "right", // Right-align the text
          }}
        >
          มหาวิทยาลัยราชภัฎวไลยอลงกรณ์ในพระบรมราชูปถัมภ์
        </Typography>
      </Row>
      <Row justify={"end"} style={{ paddingRight: 20 }}>
        <Typography style={{  textAlign: "right" }}>
         {formattedDate}
        </Typography>
      </Row>
      <Row justify={"center"} style={{ marginTop: 20 }} gutter={[24, 0]}>
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
          style={{
            width: "95%",
            overflow: "auto",
     
          }}
          dataSource={monthlyFilteredRevenueData}
          columns={monthlyColumns}
          rowKey="month" 
          pagination={false}
          footer={() => (
            <Row justify={"end"} style={{ fontFamily: "Sarabun" }}>
              <div
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  marginRight: 100,
                }}
              >
                รวม
              </div>
              <div style={{ textAlign: "right", fontWeight: "bold" }}>
                {totalRevenue} บาท
              </div>
            </Row>
          )}
        />
      </Row>

      </div>
    </StyledModal>
  );
};
const StyledModal = styled(Modal)`
  max-width: 80%; /* ปรับขนาด Modal ตามต้องการ */
`;

export default ReportYearModal;
