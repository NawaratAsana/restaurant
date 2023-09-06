import React from "react";
import { Form, Input, Button, Modal, notification } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import styled from "styled-components";

const canceledOrder = (
  open: any,
  setOpen: any,
  CancelOrder:any
  

) => {
  const router = useRouter();
  console.log("OpenCancel", open);
  const [form] = Form.useForm();
console.log("CancelOrder",CancelOrder)
  const handleCancelOrder = async (order: any) => {
    
    const result = await axios({
      method: "post",
      url: `/api/order/update`,
      data:  order ,
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
        message: "ยกเลิกรายการอาหารสำเร็จ",
      });
  
    }
  };
  const onFinish = async (values: any) => {
    console.log("Value", values);
    form.resetFields();

    handleCancelOrder({
      cancellation_reason: values?.cancellation_reason,
      status: "cancelled",
      id: CancelOrder?.order?._id,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal
      open={open}
      title="ยกเลิกรายการอาหาร"
      footer={null}
      centered
      onCancel={() => {
        setOpen( false);
        form.resetFields();
      }}
    >
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item
          label="เหตุผลการยกเลิก"
          name="cancellation_reason"
          rules={[
            {
              required: true,
              message: "กรุณากรอกเหตุผลการยกเลิก",
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <ButtonStyled  htmlType="submit" onClick={() => setOpen(false)}>
          ยืนยันการยกเลิก
        </ButtonStyled>
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

export default canceledOrder;
