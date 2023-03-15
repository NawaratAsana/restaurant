import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Typography,
} from "antd";
import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";

const loginModal = (open: any, setOpen: any) => {
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <ModalStyled
        // title="เข้าสู่ระบบ"
        centered
        open={open}
        width={600}
        footer={false}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <Row
          justify="center"
          align="middle"
          style={{
            background: "white",
            padding: "30px 50px",
            height: "100%",
          }}
        >
          <Col span={24}>
            <Typography
              style={{
                fontSize: "36px",
                textAlign: "center",
                marginBottom:'30px'
              }}
            >
              Sign In
            </Typography>
          </Col>
          <Col span={24}>
            <Form
              name="login"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
            >
             
              <Form.Item
                label='Username'
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <InputUsername placeholder="Username" />
              </Form.Item>

              <Form.Item
                label='Password'
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <InputPassword placeholder="Password" />
              </Form.Item>

              <ButtonStyled htmlType="submit">Sign In</ButtonStyled>
              
            </Form>
            <Row justify='center' style={{marginTop:'20px'}}>
              <Typography>Not a member? </Typography>
              <Link href='../register'>{"  "}Sign Up.</Link>
              </Row>
          </Col>
        </Row>
      </ModalStyled>
    </>
  );
};
const ButtonStyled = styled(Button)`
  background: #389e0d;
  border: none;
  border-radius: 10px;
  color: white;
  width: 50%;
  height: 40px;
  font-size: 18px;
  display: block;
  margin: 0px auto;
`;
const InputUsername = styled(Input)`
  height: 40px;
  border-radius: 10px;
  font-size: 16px;
`;

const InputPassword = styled(Input.Password)`
  height: 40px;
  border-radius: 10px;
  font-size: 16px;
`;
const ModalStyled = styled(Modal)`
.ant-modal-content{
  border-radius: 20px;
}

.anticon svg {
  display: inline-block;
  font-size: 18px;
}
  .ant-modal-title {
    font-size: 30px;
    text-align: center;
  }
`;
export default loginModal;
