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
        const user = result?.data?.data;
        // console.log("user=========>", user);
        Cookies.set(
          "user",
          JSON.stringify({
             id: user?._id, 
             token: user?.token,
             employeeID: user?.employeeID,
            name: user?.name,
            lname: user?.lname,
            username: user?.username,
            password: user?.password,
            position_id: user?.position_id,
          
            image: user?.image,
 

          })
        );
        console.log("result", result.data);
        notification["success"]({
          message: "Success Sign in.",
        });
        if (Cookies.get("user") !== undefined) {
          {
            user?.position_id=== "63c90d2f5b5a03c61bd0118e"
              ? router.push("/static")
              : user?.position_id === "63c90d725b5a03c61bd01190"
              ?router.push("/menu")
              :user?.position_id === "63c90d7a5b5a03c61bd01192"
              ?router.push("/kitchen")
              : router.push("/")
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
                  เข้าสู่ระบบพนักงาน
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
                    label="ชื่อผู้ใช้งาน"
                    rules={[{ required: true, message: "กรุณากรอก ชื่อผู้ใช้งาน" }]}
                  >
                    <InputUsername placeholder="Username" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="รหัสผ่าน"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอก รหัสผ่าน",
                      },
                    ]}
                  >
                    <InputPassword placeholder="Password" />
                  </Form.Item>
                  <ButtonStyled htmlType="submit">เข้าสู่ระบบ</ButtonStyled>
                </Form>
               
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
  background-image: url("../images/2022-06-24edit.jpg");
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
