import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
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
const generatePayload = require("promptpay-qr");
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

const Payment = (
  openpay: any,
  setOpenPay: any,
  totalPriceWithDelivery: any,
  orderID: any
) => {
  const router = useRouter();
  const promptPayNumber = "1139600115904";
  const amount = totalPriceWithDelivery; // Replace with actual amount
  const [form] = Form.useForm();
  const [payment, setPayment] = useState();
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
        message: "payment-add-success",
      });
    }
  };

  const onFinish = async (values: any) => {
    form.resetFields();
    const paymentData = {
      order_id: orderID,
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
  return (
    <>
      <Modal
        title="การชำระเงิน"
        open={openpay}
        centered
        footer={false}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
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
        >
          <QRCode
            style={{ width: 300, height: 300 }}
            value={generatePayload(promptPayNumber, { amount })}
          />
          <Row>
            <Typography.Text strong style={{margin:10}}>แสกน QR เพื่อชำระเงิน</Typography.Text>
            <Typography>ยอดชำระ {totalPriceWithDelivery} บาท</Typography>
          </Row>
          <Form.Item label="หลักฐานการชำระเงิน" name="image">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Row
            justify="center"
            gutter={16}
            style={{ width: "100%", marginTop: "20px" }}
          >
            <Col span={6}>
              <Button
                style={{ width: "100%"  }}
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
              <Button
                htmlType="submit"
                onClick={() => setOpenPay(false)}
                style={{ width: "100%" }}
              >
                ยืนยัน
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Payment;
