import { Button, Col, Form, Input, notification, Row, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Cookies from "js-cookie";
import { NextPage } from "next";
import Link from "next/link";
const LoginEmployee: NextPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();


  const onFinish = async (values: any) => {
    try {
      const data = {
        username: values?.username,
        password: values?.password,
      };
      const result = await axios({
        method: "post",
        url: `/api/auth/LoginEmployee`,
        data: data,
      });
      console.log("data", data);
      if (result?.status === 200) {
        const employee = result?.data?.data;
        console.log("employee=========>", employee);
        Cookies.set(
          "employee",
          JSON.stringify({
            token: employee?.token,
            employeeID: employee?. employeeID,
            name: employee?.name,
            lname: employee?.lname,
            gender: employee?.gender,
            birthday:employee?.birthday,
            age: employee?.age,
            email: employee?.email,
            phone: employee?.phone,
            address: employee?.address,
            username: employee?.username,
            password: employee?.password,
            position_id: employee?.position_id,
            id: employee?._id,

          })
        );
        console.log("result", result.data);
        notification["success"]({
          message: "Success Sign in.",
        });
        if (Cookies.get("employee") !== undefined) {
          {
            employee?.role=== "63f5124b0e947c18f977699d"
              ? router.push("/static")
              : router.push("/");
          }
        }
      } else if (result?.status === 500) {
        notification["error"]({
          message: "Invalid Sign in.",
        });
      }
    } catch (err) {
      console.log("error here :", err);
      notification["error"]({
        message: "Invalid Sign in.",
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <LoginContainer>
        <Row style={{ width: "100%", height: "100%" }}>
          <Col xxl={14} xl={14} lg={14} md={4} sm={0} xs={0}></Col>
          <Col xxl={8} xl={8} lg={8} md={16} sm={24} xs={24}>
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
                  }}
                >
                  เข้าสู่ระบบ
                </Typography>
              </Col>
              <Col span={24}>
                <Form
                  name="login"
                  form={form}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  layout="vertical"
                >
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: "กรุณากรอก usernsme" }]}
                  >
                    <InputUsername placeholder="Username" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอก Password",
                      },
                    ]}
                  >
                    <InputPassword placeholder="Password" />
                  </Form.Item>
                  <ButtonStyled htmlType="submit">เข้าสู่ระบบ</ButtonStyled>
                </Form>
                <Row justify='center' style={{marginTop:'20px'}}>
              <Typography>Don't have an account? 
              <Link href='../register'>{"  "}Sign Up.</Link></Typography>
              </Row>
              </Col>
            </Row>
          </Col>
          <Col xxl={2} xl={2} lg={2} md={4} sm={0} xs={0}></Col>
        </Row>
      </LoginContainer>
    </>
  );
};
const LoginContainer = styled.div`
  width: 100%;
  height: calc(100vh);
  padding: 0px;
  background-image: url("../images/Buakhao.jpg");
  background-size: cover;
`;
const ButtonStyled = styled(Button)`
  background: #f1be44;
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

export default LoginEmployee;
