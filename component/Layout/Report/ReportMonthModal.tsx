import { Button, Col, Modal, Row, Table, Typography, notification } from "antd";
import { addYears, format } from "date-fns";
import { th } from "date-fns/locale";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
import { utcToZonedTime } from "date-fns-tz";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
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
const ReportMonthModal = (
  open: any,
  setOpen: any,
  dailyRevenueData: any,
  monthlyRevenueData: any,
  filteredOrders: any,
  topSellingFood: any,
  topSellingDrinks: any,
  selectedMonth: any
) => {
  const selectedMonthInTZ = utcToZonedTime(selectedMonth, "Asia/Bangkok");

  const thaiYear = addYears(selectedMonthInTZ, 543);

  const formattedYear = format(thaiYear, "yyyy", { locale: th });

  const formattedDate = `${format(selectedMonth, "MMMM", {
    locale: th,
  })} พ.ศ. ${formattedYear}`;

  const totalRevenue = dailyRevenueData.reduce(
    (accumulator: number, order: any) => accumulator + order.revenue,
    0
  );
  const router = useRouter();
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
      // console.log("Food", result?.data?.data);
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
      // console.log("Drink", result?.data?.data);
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

  const modalContentRef = useRef(null);
  const handleExportToPDF = () => {
    if (modalContentRef.current) {
      const pdf = new jsPDF("p", "mm", "a4");
      const content = modalContentRef.current;
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
        pdf.save(
          `รายรับเดือน${format(selectedMonth, "MMMM", {
            locale: th,
          })} ${formattedYear}.pdf`
        );
      });
    }
  };

  // const handleExportToPDF = () => {
  //   if (modalContentRef.current) {
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const content = modalContentRef.current;

  //     // Function to add a new page to the PDF
  //     const addNewPage = () => {
  //       pdf.addPage();
  //     };

  //     // Capture the chart section
  //     html2canvas(content.querySelector(".chart-section")).then((canvas) => {
  //       const imgData = canvas.toDataURL("image/png");
  //       pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
  //       addNewPage();

  //       // Capture the daily revenue table section
  //       html2canvas(content.querySelector(".daily-revenue-table")).then(
  //         (canvas) => {
  //           const imgData = canvas.toDataURL("image/png");
  //           pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
  //           addNewPage();

  //           // Capture the top-selling food and drinks section
  //           html2canvas(content.querySelector(".top-selling-section")).then(
  //             (canvas) => {
  //               const imgData = canvas.toDataURL("image/png");
  //               pdf.addImage(imgData, "PNG", 10, 10, 190, 0);

  //               // Save the PDF with a meaningful name
  //               pdf.save(
  //                 `รายรับเดือน${format(selectedMonth, "MMMM", {
  //                   locale: th,
  //                 })} ${formattedYear}.pdf`
  //               );
  //             }
  //           );
  //         }
  //       );
  //     });
  //   }
  // };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "sequence", // A new dataIndex for the sequence number
      render: (_: any, record: any, index: any) => {
        // Render the sequence number using the index
        return index + 1;
      },
    },
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
    },

    {
      title: "จำนวนเงินรายรับ",
      dataIndex: "revenue",
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
  const foodColumns = [
    {
      title: "อาหาร",
      dataIndex: "food_id",
      render: (food_id: any) => {
        const foodItem = food.find((item) => item.id === food_id);
        return foodItem ? foodItem.name : "N/A";
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
  ];
  useEffect(() => {
    queryFood(foodFilter);
    queryDrink(drinkFilter);
  }, [foodFilter, setFoodFilter, drinkFilter, setDrinkFilter]);

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
        <div className="chart-section">
          <Row justify={"end"} style={{ paddingRight: 20 }}>
            <Typography.Text strong style={{ fontSize: 18 }}>
              รายงานรายรับรายเดือน
            </Typography.Text>
          </Row>
          <Row justify={"end"} style={{ paddingRight: 20 }}>
            <Typography
              style={{
                lineHeight: "1.5",
                marginBottom: 10,
                textAlign: "right",
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
                textAlign: "right",
              }}
            >
              มหาวิทยาลัยราชภัฎวไลยอลงกรณ์ในพระบรมราชูปถัมภ์
            </Typography>
          </Row>
          <Row justify={"end"} style={{ paddingRight: 20 }}>
            <Typography style={{ fontFamily: "Sarabun", textAlign: "right" }}>
              เดือน{formattedDate}
            </Typography>
          </Row>

          <Row justify={"center"} style={{ marginTop: 20 }}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              {" "}
              <BarChart width={450} height={300} data={dailyRevenueData}>
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
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              {" "}
              <LineChart width={450} height={300} data={dailyRevenueData}>
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
                <Line
                  dataKey="orderCount"
                  fill="#82ca9d"
                  name="จำนวนออร์เดอร์"
                />
              </LineChart>
            </Col>
          </Row>
        </div>

        <div className="daily-revenue-table">
        <Typography.Text strong style={{ marginBottom: 20 ,textAlign:"start"}}>
                ตารางรายรับรายเดือน
              </Typography.Text>
          <Row style={{ marginTop: 20 }} justify={"center"}>
            <Table
              style={{
                width: "95%",
                overflow: "auto",
              }}
              dataSource={Object.values(dailyRevenueData)}
              columns={columns}
              rowKey={(record: any) => record.order_id}
              pagination={false}
              footer={() => (
                <Row justify={"end"}>
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
        <div className="top-selling-section">
          <Row style={{ marginTop: 20 }} justify={"center"}>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              style={{ marginTop: 20 }}
            >
              <Typography.Text strong style={{ marginBottom: 10 }}>
                อาหารขายดีประจำเดือน
              </Typography.Text>
              <Table
                style={{
                  width: "95%",
                  overflow: "auto",
                }}
                dataSource={topSellingFood.slice(0, 10)}
                columns={foodColumns}
                rowKey={(record: any) => record.order_id}
                pagination={false}
              />
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              style={{ marginTop: 20 }}
            >
              <Typography.Text strong style={{ marginBottom: 10 }}>
                เครื่องดื่มขายดีประจำเดือน
              </Typography.Text>
              <Table
                style={{
                  width: "950%",
                  overflow: "auto",
                }}
                dataSource={topSellingDrinks.slice(0, 10)}
                columns={drinkColumns}
                rowKey={(record: any) => record.order_id}
                pagination={false}
              />
            </Col>
          </Row>
        </div>
      </div>
    </StyledModal>
  );
};
const StyledModal = styled(Modal)`
  max-width: 80%; /* ปรับขนาด Modal ตามต้องการ */
`;

export default ReportMonthModal;
