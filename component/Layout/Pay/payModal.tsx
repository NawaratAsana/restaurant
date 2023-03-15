import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Image, Modal, Row, Upload } from "antd";
import React, { useState } from "react";

const payModal = (openpay: any, setOpenPay: any) => {
  return (
    <>
      <Modal
        title="การชำระเงิน"
        centered
        open={openpay}
        onOk={() => setOpenPay(false)}
        onCancel={() => setOpenPay(false)}
        width={800}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Row justify="center" gutter={16}>
            <Col span={8}>
              <Form.Item>
                <Image
                  width={200}
                  src="../images/QrCode.png"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="หลักฐานการชำระเงิน" valuePropName="fileList">
                <Upload action="/upload.do" listType="picture-card">
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default payModal;
