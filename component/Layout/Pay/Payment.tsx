import {
  DownloadOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Image,
  Modal,
  Row,
  Typography,
  Upload,
  message,
  notification,
} from "antd";
import React, { useState } from "react";
import dotenv from "dotenv";
import QRCode from "qrcode.react";
import { UploadChangeParam, UploadFile } from "antd/lib/upload";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import styled from "styled-components";
const generatePayload = require("promptpay-qr");
const QRCode2 = require("qrcode");

dotenv.config();

const getBase64 = (img: any, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    notification["success"]({
      message: "You can only upload JPG/PNG file!",
    });
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    notification["success"]({
      message: "Image must smaller than 1MB!",
    });
    message.error("Image must smaller than 1MB!");
  }
  return isJpgOrPng && isLt5M;
};

const Payment = (openpay: any, setOpenPay: any, orderPayment: any) => {
  const router = useRouter();
  const promptPayNumber = "1139600115904";
  const amount = orderPayment?.total_amount; // Replace with actual amount
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const onUpdatePayment = async (value: any) => {
    console.log("edit value >>>>>>>>>>> ", value);
    const result = await axios({
      method: "post",
      url: `/api/pay/update`,
      data: value,
    }).catch((err) => {
      if (err) {
        console.log("Update payment error:", err);
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
      notification["success"]({
        message: "บันทึกหลักฐานการชำระเงินเรียบร้อย",
      });
    }
  };

  const onFinish = async (values: any) => {
    form.resetFields();
    const paymentData = {
      order_id: orderPayment?.order?._id,
      payment_status: "รอการยืนยัน",
      image: imageUrl,
    };
    console.log("paymentData", paymentData);
    onUpdatePayment(paymentData);
    setImageUrl("");
    setOpenPay(false);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }

    if (info.file.status === "error") {
      setLoading(false);
      setImageUrl("");
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const generateQRCodeDataURL = () => {
    const qrCodeValue = generatePayload(promptPayNumber, { amount });
    const canvas = document.createElement("canvas");
    QRCode2.toCanvas(canvas, qrCodeValue, { width: 300, height: 300 });
    return canvas.toDataURL("image/png");
  };
  const handleDownloadQRCode = () => {
    const qrCodeDataURL = generateQRCodeDataURL();
    const link = document.createElement("a");
    link.href = qrCodeDataURL;
    link.download = "qrcode.png";
    link.click();
  };

  return (
    <>
      <Modal
        title="การชำระเงิน"
        open={openpay}
        footer={false}
        onCancel={() => {
          setOpenPay(false);
          setImageUrl("");
          form.resetFields();
        }}
      >
        <Form
          name="basic"
          layout="horizontal"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <QRCode
            style={{ width: 200, height: 200 }}
            value={generatePayload(promptPayNumber, { amount })}
          />
          <Row justify={"center"}> 
            <Button
              icon={<DownloadOutlined />}
              style={{ margin: "10px" }}
              onClick={handleDownloadQRCode}
            >
              Download QR Code
            </Button>
          </Row>

          <Row style={{ margin: 10 }}>
            <Typography.Text strong>
              แสกน QR เพื่อชำระเงิน{"  "}
              ยอดชำระ {orderPayment?.order?.total_amount} บาท
            </Typography.Text>
          </Row>
          <Form.Item name="image">
            <Row justify="center" align="middle">
              <Col span={24}>
                <Typography.Text
                  strong
                  style={{ textAlign: "left" }}
                >
                  หลักฐานการชำระเงิน:
                </Typography.Text>
              </Col>
              <Col span={24} style={{ textAlign: "center" }}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  style={{ justifyContent: "center" }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Col>
            </Row>
          </Form.Item>

          <Row
            justify="center"
            gutter={16}
            style={{ width: "100%", margin: "20px" }}
          >
            <Col span={6}>
              <Button
                onClick={() => {
                  setOpenPay(false);
                  form.resetFields();
                  setImageUrl("");
                }}
              >
                cancel
              </Button>
            </Col>
            <Col span={6}>
              <ButtonStyled htmlType="submit" onClick={() => setOpenPay(false)}>
                ยืนยัน
              </ButtonStyled>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
const ButtonStyled = styled(Button)`
  background-color: #faad14;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
`;
export default Payment;
