import { Button, Col, Modal, Row, Table, Typography, notification } from "antd";
import axios from "axios";
import { addYears, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { th } from "date-fns/locale";
import html2canvas from "html2canvas";
import Cookies from "js-cookie";
import jsPDF from "jspdf";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components";

interface PaymentStatus {
  _id: string;
  order_id: string;
  payment_status: string;
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
  foodOrders: FoodOrder[]; // Add this property
  drinkOrders: DrinkOrder[]; // Add this property
}
const ReportDayModal = (
  open: any,
  setOpen: any,
  filteredOrders: any,
  dailyRevenueData: any,
  selectedDate: any,
  totalRevenue: any,
  topSellingFood: any,
  topSellingDrinks: any
) => {
  const router = useRouter();

  const selectedDateInTZ = utcToZonedTime(selectedDate, "Asia/Bangkok");

  const thaiYear = selectedDateInTZ ? addYears(selectedDateInTZ, 543) : null;
  const formattedYear = selectedDateInTZ
    ? format(addYears(selectedDateInTZ, 543), "yyyy", { locale: th })
    : ""; // ถ้า selectedDateInTZ เป็น null หรือ undefined ให้กำหนดค่าเป็น ""

  // const formattedYear = thaiYear ? format(thaiYear, "yyyy", { locale: th }) : "";

  const formattedDate = `${format(selectedDate, "วันที่ d เดือน MMMM", {
    locale: th,
  })} พ.ศ. ${formattedYear}`;
  const modalContentRef = useRef(null);

  const handleExportToPDF = () => {
    if (modalContentRef.current) {
      const pdf = new jsPDF("p", "mm", "a4");
      const content = modalContentRef.current;
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
        pdf.save(
          `รายรับวัน${format(selectedDate, "dd-MMMM", {
            locale: th,
          })} ${formattedYear}.pdf`
        );
      });
    }
  };

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
  useEffect(() => {
    queryFood(foodFilter);
    queryDrink(drinkFilter);
  }, [foodFilter, setFoodFilter, drinkFilter, setDrinkFilter]);

  const columns = [
    {
      title: "รหัสออร์เดอร์",
      dataIndex: "order_number",
      key: "order_number",
    },
    {
      title: "วันที่สั่งซื้อ",
      dataIndex: "order_date",
      key: "order_date",
      render: (order_date: string) => (
        <Typography>{format(new Date(order_date), "dd/MM/yyyy")}</Typography>
      ),
    },
    {
      title: "ประเภทการจัดส่ง",
      dataIndex: "delivery_type",
      key: "delivery_type",
    },
    {
      title: "ยอดรวม",
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
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "สถานะการชำระเงิน",
      dataIndex: "payment",
      render: (payment: PaymentStatus) => (
        <Typography>{payment.payment_status}</Typography>
      ),
    },
  ];

  const foodColumns = [
    {
      title: "อาหาร",
      dataIndex: "food_id", // Assuming "food_id" is the ID field in your table data
      render: (food_id: any) => {
        const foodItem = food.find((item) => item.id === food_id); // Assuming you have the food data in the "food" state
        return foodItem ? foodItem.name : "N/A"; // Display the food name or "N/A" if not found
      },
    },
    {
      title: "จำนวนการขาย",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  const drinkColumns = [
    {
      title: "เครื่องดื่ม",
      dataIndex: "drink_id",
      render: (drink_id: any) => {
        const drinkItem = drink.find((item) => item.id === drink_id);
        return drinkItem ? drinkItem.name : "N/A";
      },
    },
    {
      title: "จำนวนการขาย",
      dataIndex: "quantity",
      key: "quantity",
    },
    // Add additional columns as needed
  ];

  return (
    <StyledModal
      width={990}
      open={open}
      onCancel={() => setOpen(false)}
      footer={[
        <Row justify={"center"}>
          <Button onClick={handleExportToPDF} type="primary">
            Export to PDF
          </Button>
        </Row>,
      ]}
    >
      <div id="pdf-export" style={{ width: "100%" }} ref={modalContentRef}>
        <Row justify={"end"} style={{ paddingRight: 20 }}>
          <Typography.Text strong style={{ fontSize: 18 }}>
            รายงานรายรับรายวัน
          </Typography.Text>
        </Row>
        <Row justify={"end"} style={{ paddingRight: 20 }}>
          <Typography
            style={{
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
          <Typography style={{ fontFamily: "Sarabun", textAlign: "right" }}>
            {formattedDate}
          </Typography>
        </Row>
        <div style={{ justifyContent: "center" }}>
          <Row
            style={{ marginTop: 30, width: "95%" }}
            gutter={[24, 0]}
            justify={"center"}
          >
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Typography.Text strong style={{ fontSize: 16 }}>
                กราฟรายรับรายวัน
              </Typography.Text>

              <Row justify={"center"} style={{ marginTop: 10 }}>
                <BarChart width={800} height={300} data={dailyRevenueData}>
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
              </Row>
            </Col>

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
        </div>
        <div>
          {" "}<Typography.Text strong style={{ marginBottom: 20 ,textAlign:"start"}}>
                ตารางรายรับรายวัน
              </Typography.Text>
          <Row style={{ marginTop: 20 }} justify={"center"}>
          
            <Table
               
               style={{
                width: "100%",
                overflow: "auto",
              }}
         
              dataSource={Object.values(filteredOrders)}
              columns={columns}
              rowKey={(record: any) => record.order_id}
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
      </div>
    </StyledModal>
  );
};
const StyledModal = styled(Modal)`
  max-width: 80%; /* ปรับขนาด Modal ตามต้องการ */
`;

export default ReportDayModal;
