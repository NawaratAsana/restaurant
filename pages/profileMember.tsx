import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Layout,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Typography,
  Upload,
  message,
  notification,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment, { Moment } from "moment";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import "moment-timezone";
import { getFiletoBase64 } from "../lib/common";
moment.tz.setDefault("Asia/Bangkok");

const { Title } = Typography;

export async function getServerSideProps(context: any) {
  if (context.req?.cookies?.user) {
    const getCookie = JSON.parse(context.req?.cookies?.user);

    return {
      props: {
        userCookie: getCookie,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

interface IMember {
  key: React.Key;
  name: string;
  active: boolean;
  address: String;
  phone: String;
  birthday: Date;
  email: String;

  gender: String;
  lname: String;
  password: String;
  username: String;
  position_id: string;
  image: string;
  id: string;
}

interface IProps {
  userCookie(userCookie: any): unknown;
  user: any;
}
interface IDataMember {
  status?: string;
  value?: any;
}
interface IFormValue {
  name: string;
  lname: String;
  address: String;
  phone: String;
  birthday: Date;
  email: String;
  gender: String;
  password: String;
  username: String;
  image: string;
  id?: string;
}

const ProfileMember = (props: IProps) => {
  const [userData, setUserData] = useState<IDataMember>({
    status: "",
    value: [],
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState<string>();

  const [gender, setGender] = useState(1);
  const { Option } = Select;

  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<any>(null);



  const queryProfile = async (data: any) => {
    setLoading(true);
    const result = await axios({
      method: "post",
      url: `/api/member/queryById`,
      data: data,
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
      console.log("result?.data?.data?.rows >>>>> ", result);
      setUserData({ status: "detail", value: result?.data?.data });
      setLoading(false);
    } else {
      setUserData({ status: "detail", value: {} });
      setLoading(false);
    }
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };
  const formattedDate = selectedDate
    ? moment(selectedDate).format("YYYY-MM-DD")
    : "";

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setGender(e.target.value);
  };

  const getBase64 = (img: any, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error("Image must smaller than 1MB!");
    }
    return isJpgOrPng && isLt1M;
  };
  
  const onEditMember = async (value: any) => {
    if (value?.image?.file?.originFileObj) {  
      let url: any = await getFiletoBase64(value?.image?.file?.originFileObj);
      value.image = url;
    
    } 
    const result = await axios({
      method: "post",
      url: `/api/member/update`,
      data: { ...value, id: userData?.value[0]?._id },
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
        message: "member-edit-success",
      });
  
      queryProfile(userData);
    }
  };
  
  
  const onFinish = async (values: any) => {
    form.resetFields();
    if (userData?.status === "edit") {
      onEditMember({ ...values });
      setUserData({ value: values });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    queryProfile(props.userCookie);
  }, []);

  useEffect(() => {
    if (userData?.status === "edit" || userData?.status === "detail") {
      if (userData?.value && userData.value.length > 0) {
        const momentDate = moment(
          userData.value[0]?.birthday,
          "YYYY-MM-DDTHH:mm:ss.SSSZ"
        );
        form.setFieldsValue({
          name: userData.value[0]?.name,
          lname: userData.value[0]?.lname,
          address: userData.value[0]?.address,
          phone: userData.value[0]?.phone,
          birthday: momentDate,
          email: userData.value[0]?.email,
          gender: userData.value[0]?.gender,
          password: userData.value[0]?.password,
          username: userData.value[0]?.username,
          role: userData.value[0]?.role,
        });
        setImageUrl(userData.value[0]?.image);
        setSelectedDate(momentDate);
      }
    }
  }, [userData, setUserData]);

  const handleChange: any["onChange"] = (info: any) => {
    console.log("info=======>", info);
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as any, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Layout
      className="site-layout"
      style={{ backgroundColor: "#fff", marginTop: 20 }}
    >
      <Content style={{ margin: "24px 16px 0" }}>
        <Row justify={"center"}>
          <Col span={22}>
            <img
              src="/images/minimal-scandinavian-breakfast-nook-style1.jpg"
              width="100%"
              height={300}
              style={{
                opacity: 0.8,
                borderTopLeftRadius: 80,
                boxShadow: "0px 0px 10px #bfbfbf",
              }}
              alt="Breakfast Nook"
            />
          </Col>
        </Row>
        <Form
          name="basic"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelAlign="left"
          labelCol={{ span: 6 }}
        >
          <Row gutter={[24, 0]} style={{ marginTop: -50 }}>
            <Col xs={130} sm={130} md={130} lg={130} xl={130} style={{paddingLeft:70}}>
              <Image
                src={
                  userData?.value && userData.value.length > 0
                    ? userData.value[0]?.image
                    : undefined
                }
                className="profile-image"
                width={130}
                style={{
                  borderRadius: "50%",
                  border: "solid #f0f0f0 5px",
                }}
                alt="My Profile"
              />
            </Col>
            <Col
              xs={10}
              sm={12}
              md={16} 
              lg={16}
              xl={18}
              style={{
                display: "flex",

                justifyContent: "flex-start",
                alignItems: "flex-start",
                marginTop: 60,
              }}
            >
              <Typography.Title level={1} style={{ fontWeight: "bold" }}>
                Profile
              </Typography.Title>
            </Col>
            <Col
              xs={4}
              sm={12}
              md={8}
              lg={2}
              xl={2}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",

                marginBottom: 25,
              }}
            >
              {userData?.status === "edit" ? (
                <>
                  <ButtonCancleStyled
                    type="default"
                    style={{ margin: "0 10px" }}
                    onClick={() => {
                      setUserData({ status: "detail" });
                    }}
                  >
                    Cancel
                  </ButtonCancleStyled>
                  <ButtonStyled
                    htmlType="submit"
                    type="primary"
                    style={{ margin: "0 10px" }}
                  >
                    Save
                  </ButtonStyled>
                </>
              ) : (
                <ButtonStyled
                  type="primary"
                  style={{ margin: "0 10px" }}
                  onClick={() => {
                    let newData = {
                      ...userData,
                      status: "edit",
                    };
                    setUserData(newData);
                  }}
                >
                  Edit
                </ButtonStyled>
              )}
            </Col>
          </Row>

          <>
            <Row justify="center" style={{ width: "100%", marginTop: "50px" }}>
              <Col span={18}>
                <Form.Item name="gender" label="เพศ">
                  <Radio.Group onChange={onChange} value={gender}>
                    <Radio value={"ชาย"}>ชาย</Radio>
                    <Radio value={"หญิง"}>หญิง</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item label="ชื่อ" name="name">
                  <InputStyled placeholder="ชื่อ" />
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item name="lname" label="นามสกุล">
                  <InputUsername placeholder="นามสกุล" />
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item name="birthday" label="วัน/เกือน/ปี เกิด">
                  <DatePickerStyled
                    value={selectedDate}
                    onChange={handleDateChange}
                    showTime
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item name="email" label="email">
                  <InputUsername placeholder="Email" />
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item name="address" label="ที่อยู่">
                  <InputUsername placeholder="ที่อยู่" />
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item label="รูปภาพ" name="image">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
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
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item name="phone" label="เบอร์โทร">
                  <InputUsername placeholder="เบอร์โทร" />
                </Form.Item>
              </Col>{" "}
              <Col span={18}>
                <Form.Item name="username" label="Username">
                  <InputUsername placeholder="Username" />
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item name="password" label="Password">
                  <InputPassword placeholder="Password" />
                </Form.Item>
              </Col>
            </Row>
          </>
        </Form>
      </Content>
    </Layout>
  );
};
const InputPassword = styled(Input.Password)`
  font-size: 14px;
  height: 40px;
  border-radius: 8px;
`;

const InputUsername = styled(Input)`
  font-size: 14px;
  height: 40px;
  border-radius: 8px;
`;

const InputStyled = styled(Input)`
  font-size: 16px;
  height: 40px;
  border-radius: 8px;

  @media screen and (max-width: 768px) {
    font-size: 14px;
    height: 32px;
  }
`;

const DatePickerStyled = styled(DatePicker)`
  font-size: 14px;
  height: 40px;
  border-radius: 8px;
  width: 100%;

  @media screen and (max-width: 768px) {
    font-size: 12px;
    height: 32px;
  }
`;
const ButtonStyled = styled(Button)`
  height: 40px;
  width: 100%;
  border-radius: 20px;
  font-size: 18px;
  border: none;
  margin-top: 50px;
  background: transparent
    linear-gradient(62deg, #00369e 0%, #005cfd 53%, #a18dff 100%) 0% 0%
    no-repeat padding-box;
`;
const ButtonCancleStyled = styled(Button)`
  height: 40px;
  width: 100%;
  border-radius: 20px;
  font-size: 18px;
  border: none;
  margin-top: 50px;
 
`;

export default ProfileMember;
