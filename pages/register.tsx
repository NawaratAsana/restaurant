import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Radio,
  RadioChangeEvent,
  Row,
  Typography,
} from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Cookies from "js-cookie";
import { NextPage } from "next";
import Link from "next/link";
const Login: NextPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  // const onFinish = async (values: any) => {
  //   try {
  //     const data = {
  //       name: values?.name,
  //       lname: values?.lname,
  //       gender:values?.gender,
  //       email: values?.email,
  //       // phone: values?.phone,
  //       username: values?.username,
  //       password: values?.password,
  //     };
  //     const result = await axios({
  //       method: "post",
  //       url: `/api/auth/register`,
  //       data: data,
  //     });
  //     console.log("data", data);
  //     if (result?.status === 200) {
  //       const user = result?.data?.data;
  //       console.log("user=========>", user);
  //       Cookies.set(
  //         "user",
  //         JSON.stringify({
  //           token: user?.token,
  //           name: user?.name,
  //           lname: user?.lname,
  //           gender: user?.gender,
  //           email: user?.email,
  //           username: user?.username,
  //           password: user?.password,
  //           id: user?._id,
  //         })
  //       );
  //       console.log("result", result.data);
  //       notification["success"]({
  //         message: "Success Sign in.",
  //       });
  //       if (Cookies.get("user") !== undefined) {
  //         {
  //           user?.role_id === "633e749477746afb52cb883c"
  //             ? router.push("/Statics")
  //             : router.push("/Leave");
  //         }
  //       }
  //     } else if (result?.status === 500) {
  //       notification["error"]({
  //         message: "Invalid Sign up.",
  //       });
  //     }
  //   } catch (err) {
  //     console.log("error here :", err);
  //     notification["error"]({
  //       message: "Invalid Sign up.",
  //     });
  //   }
  // };
  const onFinish = async (value: any) => {
    console.log(value)
    const result = await axios({
      method: "post",
      url: `/api/auth/register`,
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
    console.log("result>>>", result);
    if (result?.status === 200) {
    
       notification["success"]({
        message: "person-add-success",
      }); 
      router.push("/login");
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const [gender, setGender] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setGender(e.target.value);
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
                  สมัครสมาชิก
                </Typography>
              </Col>
              <Col span={24}>
                <Form
                  name="register"
                  form={form}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  layout="vertical"
                  style={{ marginTop: "10%" }}
                >
                  <Row justify="space-between">
                    <Col span={11}>
                      <Form.Item
                        name="name"
                        label="ชื่อ"
                        rules={[{ required: true, message: "กรุณากรอก ชื่อ" }]}
                      >
                        <InputUsername placeholder="ชื่อ" />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        name="lname"
                        label="นามสกุล"
                        rules={[
                          { required: true, message: "กรุณากรอก นามสกุล" },
                        ]}
                      >
                        <InputUsername placeholder="นามสกุล" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row justify="space-between">
                    <Col span={11}>
                      <Form.Item
                        name="gender"
                        label="เพศ"
                        rules={[{ required: true, message: "กรุณากรอก เพศ" }]}
                      >
                        <Radio.Group onChange={onChange} value={gender}>
                          <Radio value={"ชาย"}>ชาย</Radio>
                          <Radio value={"หญิง"}>หญิง</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        name="email"
                        label="เบอร์โทรศัพท์"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอก เบอร์โทรศัพท์",
                          },
                        ]}
                      >
                        <InputUsername placeholder="เบอร์โทรศัพท์" />
                      </Form.Item>
                    </Col>
                  </Row>
                  {/* <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "กรุณากรอก Email" }]}
                  >
                    <InputUsername placeholder="Email" />
                  </Form.Item> */}
                  <Form.Item
                    name="address"
                    label="ที่อยู่"
                    rules={[{ required: true, message: "กรุณากรอก ที่อยู่" }]}
                  >
                    <InputUsername placeholder="ที่อยู่" />
                  </Form.Item>
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
                  <ButtonStyled htmlType="submit">สมัครสมาชิก</ButtonStyled>
                </Form>
                <Row justify='center' style={{marginTop:'20px'}}>
                <Typography>Already have an account?{" "}
              <Link href='../login'>{"  "}Sign In.</Link></Typography>
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
  height: calc(120vh);
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

export default Login;
