import React, { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Divider,
  notification,
  Row,
  Col,
  Button,
} from "antd";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const { Paragraph } = Typography;
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

const ReceiptModal = (
  openReceipt: any,
  setOpenReceipt: any,
  orderReceipt: any
) => {
  const router = useRouter();
  const [food, setFood] = useState([
    {
      id: "",
      name: "",
      price: 0,
    },
  ]);
  const [drink, setDrink] = useState([
    {
      id: "",
      name: "",
      price: 0,
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
      let foodData: any[] = [];
      result?.data?.data?.map((value: any) => {
        foodData.push({
          id: value._id,
          name: value?.name,
          price: value?.price,
        });
      });

      setFood(foodData);
      console.log("Food", food);
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
          price: value?.price,
        });
      });

      setDrink(drinkData);
      console.log("Drink", drink);
    }
  };
  useEffect(() => {
    queryFood(foodFilter);
    queryDrink(drinkFilter);
  }, [foodFilter, setFoodFilter, drinkFilter, setDrinkFilter]);



  const downloadPDF = async () => {
    const modalContent = document.getElementById("receipt-modal-content");

    if (modalContent) {
      const canvas = await html2canvas(modalContent);

      // Define the dimensions for the PDF (change as needed)
      const pdfWidth = 80; // Width of the receipt slip (in mm)
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Calculate height to maintain aspect ratio

      const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);
      const imgData = canvas.toDataURL("image/png");

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("receipt.pdf");
    }
  };

  return (
    <Modal
      // title="รายละเอียดใบเสร็จรับเงิน"
      open={openReceipt}
      width={550}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onCancel={() => {
        setOpenReceipt(false);
      }}
      footer={[
        <Row justify={"center"}>
        <Button  type="primary" key="download" style={{justifyContent:"center"}} onClick={downloadPDF}>
          ดาวน์โหลดใบเสร็จ PDF
        </Button></Row>
      ]}
    >
      {orderReceipt && (
        <div id="receipt-modal-content" style={{ padding: 20 }}>
          <Paragraph style={{ textAlign: "center" }}>
            <Typography.Text strong>
              {" "}
             ห้องอาหารบัวขาว
            </Typography.Text>
            <br />
            ศูนย์ฝึกประสบการณ์วิชาชีพ มหาวิทยาลัยราชภัฏวไลยอลงกรณ์
          </Paragraph>
          <Divider />
          <Paragraph style={{ textAlign: "center" }}>
            <Typography.Text strong>ใบเสร็จรับเงิน</Typography.Text>
            <br />
            <Row>
              <Col span={14}><Typography style={{ textAlign: "start" }}>

              เลขที่ใบเสร็จ: {orderReceipt?.order?.order_number}
            </Typography></Col>
              <Col span={10}><Typography style={{ textAlign: "end" }}>
             
              วันที่:{" "}
              {new Date(orderReceipt?.order?.order_date).toLocaleDateString()}
            </Typography></Col>
            </Row>
            
            
          </Paragraph>

          <Paragraph>
            <Divider />
            <Paragraph>
              <Typography.Text strong>รายการอาหาร</Typography.Text>
              <br />
              {orderReceipt?.order?.foodOrders.map((foodOrder: FoodOrder) => {
                const foodItem = food.find(
                  (item) => item.id === foodOrder.food_id
                );
                const totalFoodPrice =
                  foodOrder?.quantity * (foodItem?.price || 0); // คำนวณราคารวม
                return (
                  <Row key={foodOrder._id}>
                    <Col span={16}>
                      <Typography>{foodItem?.name}</Typography>
                    </Col>
                    <Col span={4}>
                      {foodOrder.quantity > 1 && (
                        <Typography>@{foodItem?.price}</Typography>
                      )}
                    </Col>
                    <Col span={4}>
                      <Typography>THB {totalFoodPrice}</Typography>
                    </Col>
                  </Row>
                );
              })}
              {orderReceipt?.order?.drinkOrders.map(
                (drinkOrder: DrinkOrder) => {
                  const drinkItem = drink.find(
                    (item) => item.id === drinkOrder.drink_id
                  );
                  const totalDrinkPrice =
                    drinkOrder?.quantity * (drinkItem?.price || 0); // คำนวณราคารวม
                  return (
                    <Row key={drinkOrder._id}>
                      <Col span={16}>
                        <Typography>{drinkItem?.name}</Typography>
                      </Col>
                      <Col span={4}>
                        {drinkOrder.quantity > 1 && (
                          <Typography>@{drinkItem?.price}</Typography>
                        )}
                      </Col>
                      <Col span={4}>
                        <Typography style={{ textAlign: "end" }}>
                          {totalDrinkPrice}
                        </Typography>
                      </Col>
                    </Row>
                  );
                }
              )}
            </Paragraph>
          </Paragraph>
          <Divider />
          <Paragraph>
            {orderReceipt?.order?.delivery_type === "delivery" && (
              <Row justify={"space-evenly"}>
              <Col span={18}>
                <Typography.Text strong>ค่าบริการจัดส่ง:</Typography.Text>
              </Col>
              <Col span={6}>
                <Typography style={{ textAlign: "end", marginRight: 15 }}>
                  THB 20
                </Typography>
              </Col>
              </Row>
            )}
            <Row justify={"space-evenly"}>
              <Col span={18}>
                <Typography.Text strong>รวมทั้งสิ้น:</Typography.Text>
              </Col>
              <Col span={6}>
                <Typography style={{ textAlign: "end", marginRight: 15 }}>
                  THB {orderReceipt?.order?.total_amount}
                </Typography>
              </Col>
            </Row>
          </Paragraph>
          <Divider />
          {/* <Paragraph>
            <Text strong>ชำระโดย:</Text> บัตรเครดิต
            <br />
            <Text>หมายเลขบัตร:</Text> **** **** **** 1234
            <br />
            <Text>ชื่อเจ้าของบัตร:</Text> JOHN DOE
          </Paragraph>
          <Divider /> */}
          <Paragraph style={{ textAlign: "center" }}>
            ขอบคุณที่ใช้บริการ!
          </Paragraph>
        </div>
      )}
    </Modal>
  );
};

export default ReceiptModal;
