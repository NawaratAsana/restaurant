import {
  Button,
  Form,
  Image,
  Modal,
  Row,
  Typography,
  notification,
} from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const checkProof = (
  openCheckProof: any,
  setOpenCheckProof: any,
  orderCheckProof: any
) => {
  const router = useRouter();
  const [form] = Form.useForm();

  const handleCompltedOrder = async (order: any) => {
    const result = await axios({
      method: "post",
      url: `/api/order/update`,
      data: { id: order?._id, status: "completed" }, // Pass the updatedOrder object as the data
    }).catch((err) => {
      if (err) {
        console.log(err);
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
        message: "ยืนยันรายการอาหารสำเร็จ",
      });
    }
  };

  const onFinish = async (values: any) => {
    form.resetFields();
    const orderData = {
      _id: orderCheckProof?.order?._id,
      status: "completed",
    };
    handleCompltedOrder(orderData);

    setOpenCheckProof(false);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="หลักฐานชำระเงิน"
      open={openCheckProof}
      footer={null}
      onCancel={() => {
        setOpenCheckProof(false);
      }}
    >
      <Form
        name="basic"
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row justify={"center"}>
          {" "}
          <Typography.Text strong style={{ textAlign: "center", margin: 10 }}>
            Order ID: {orderCheckProof?.order?.order_number}
          </Typography.Text>
        </Row>
        <Row justify={"center"}>
          {" "}
          <Image width={300} src={orderCheckProof?.order?.payment?.image} />
        </Row>
        <Row justify={"center"}>
          <Typography.Text strong style={{ textAlign: "center", margin: 10 }}>
            Total Amount: {orderCheckProof?.order?.total_amount}
          </Typography.Text>
        </Row>

        <Row justify={"center"}>
          {" "}
          <ButtonStyled
            htmlType="submit"
            onClick={() => setOpenCheckProof(false)}
            style={{ margin: 10 }}
          >
            ยืนยันการชำระเงิน
          </ButtonStyled>
        </Row>
      </Form>
    </Modal>
  );
};
const ButtonStyled = styled(Button)`
  background-color: #faad14;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
`;
export default checkProof;
