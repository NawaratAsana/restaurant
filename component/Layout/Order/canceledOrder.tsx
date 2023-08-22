import React from "react";
import { Form, Input, Button, Modal } from "antd";

const canceledOrder = (
  open: any,
  setOpen: any,
  cancellationReason: any,
  setCancellationReason: any,
  orders: any,
  setOrders: any,
  handleCancelOrder: any
) => {
  console.log("Orders", open);
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    console.log("Value", values);
    form.resetFields();

    handleCancelOrder({
      cancellation_reason: values?.cancellation_reason,
      status: "cancelled",
      id: open?.value,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal
      open={open?.open}
      title="ยกเลิกรายการอาหาร"
      footer={null}
      centered
      onCancel={() => {
        setOpen({ open: false });
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

        <Button type="primary" htmlType="submit" onClick={() => setOpen(false)}>
          ยืนยันการยกเลิก
        </Button>
      </Form>
    </Modal>
  );
};

export default canceledOrder;
