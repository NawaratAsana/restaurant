import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import HeaderTitle from "../HeaderTitle";



interface IFormValue {
  name: string;
  active: String;
  address: String;
  phone: String;
  birthday: Date;
  email: String;
  employeeID: String;
  gender: String;
  lname: String;
  password: String;
  username: String;
  position_id: string;
  id?: string;
  delete?: string;
}

// const { Text } = Typography;
const EmployeeModal = (
  modal: any,
  setModal: any,
  onAddEmployee: any,
  onEditEmployee: any,
  onDeleteEmployee: any,
  position: any
) => {
  const [gender, setGender] = useState(1);
  const { Option } = Select;
  const [value, setValue] = useState(1);
  const [form] = Form.useForm();
  const onChangeRadio = (e: any) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const onChangeDate: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };
  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setGender(e.target.value);
  };
  const onFinish = (values: IFormValue) => {
    form.resetFields();
    if (modal?.status === "add") {
      onAddEmployee(values);
      setModal({ value: values, open: false });
    } else if (modal?.status === "edit") {
      onEditEmployee(values);
      setModal({ value: values, open: false });
    } else if (modal?.status === "delete") {
      onDeleteEmployee(values?.delete);
      setModal({ open: false });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onSearchSelect = (value: string) => {
    console.log("search:", value);
  };

  useEffect(() => {
    if (modal?.status === "edit" || modal?.status === "detail") {
      form.setFieldsValue({
        employeeID: modal?.value?.employeeID,
        name: modal?.value?.name,
        lname: modal?.value?.lname,
        address: modal?.value?.address,
        phone: modal?.value?.phone,
        // birthday: modal?.value?.birthday,
        email: modal?.value?.email,
        gender: modal?.value?.gender,
        password: modal?.value?.password,
        username: modal?.value?.username,
        position_id: modal?.value?.position_id,
        role: modal?.value?.role,
        active: modal?.value?.active,
      });
    } else if (modal?.status === "add") {
      form.setFieldsValue({
        active: true, //form.item > name="status"
      });
    }
  }, [modal, setModal]);
  return (
   
    <ModalStyled
      open={modal?.open}
      footer={false}
      width={900}
      centered
      onCancel={() => {
        setModal({ open: false });
        form.resetFields();
      }}
    >
      <HeaderTitle header={modal?.header} isDivider={true} />
      <Form
        name="basic"
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {modal?.status === "delete" ? (
          <>
            <Row justify="center" style={{ width: "100%", margin: "40px 0px" }}>
              <Typography style={{ textAlign: "center" }}>
                ต้องการลบพนักงาน {modal?.value?.name} {modal?.value?.lname}
                ใช่หรือไม่
              </Typography>
            </Row>
          </>
        ) : (
          <>
            <Row
              justify="space-between"
              //   gutter={16}
              style={{ width: "100%", marginTop: "50px" }}
            >
              <Col span={10}>
                <Form.Item
                  name="employeeID"
                  label="รหัสพนักงาน"
                  rules={[
                    {
                      required: modal?.status !== "detail" && true,
                      message: "กรุณากรอก รหัสพนักงาน",
                    },
                  ]}
                >
                  <InputUsername placeholder="รหัสพนักงาน" />
                </Form.Item>
              </Col>
              <Col span={10}>
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
              <Col span={10}>
                <Form.Item
                  label="ชื่อ"
                  name="name"
                  rules={[
                    {
                      required: modal?.status !== "detail" && true,
                      message: "กรุณากรอก ชื่อ",
                    },
                  ]}
                >
                  <InputStyled
                    placeholder="ชื่อ"
                    // disabled={modal?.status === "detail" && true}
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="lname"
                  label="นามสกุล"
                  rules={[
                    {
                      required: modal?.status !== "detail" && true,
                      message: "กรุณากรอก นามสกุล",
                    },
                  ]}
                >
                  <InputUsername placeholder="นามสกุล" />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="birthday"
                  label="วัน/เกือน/ปี เกิด"
                  rules={[
                    {
                      required: modal?.status !== "detail" && true,
                      message: "กรุณากรอก วันเกิด",
                    },
                  ]}
                >
                  <DatePickerStyled
                    onChange={onChangeDate}
                    // locale={locale}
                    format={"DD-MM-YYYY"}
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="email"
                  label="email"
                  rules={[
                    {
                      required: modal?.status !== "detail" && true,
                      message: "กรุณากรอก Email",
                    },
                  ]}
                >
                  <InputUsername placeholder="Email" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label="ที่อยู่"
                  rules={[
                    {
                      required: modal?.status !== "detail" && true,
                      message: "กรุณากรอก ที่อยู่",
                    },
                  ]}
                >
                  <InputUsername placeholder="ที่อยู่" />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="phone"
                  label="เบอร์โทร"
                  rules={[
                    {
                      required: modal?.status !== "detail" && true,
                      message: "กรุณากรอก เบอร์โทร",
                    },
                  ]}
                >
                  <InputUsername placeholder="เบอร์โทร" />
                </Form.Item>
              </Col>{" "}
              <Col span={10}>
                <Form.Item
                  label="ตำแหน่ง"
                  name="position_id"
                  rules={[
                    {
                      required: modal?.status !== "detail" && true,
                      message: "กรุณากรอก ตำแหน่งพนักงาน",
                    },
                  ]}
                >
                  <SelectStyled
                    showSearch
                    size="large"
                    placeholder="เลือกตำแหน่งพนักงาน"
                    optionFilterProp="children"
                    // disabled={modal?.status === "detail" && true}
                    onSearch={onSearchSelect}
                    filterOption={(input, option) =>
                      (option!.children as unknown as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {position !== undefined &&
                      position?.map((value: any, index: number) => (
                        <Option key={index} value={value?.id}>
                          {value?.name}
                        </Option>
                      ))}
                  </SelectStyled>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    {
                      required: modal?.status !== "detail" && true,
                      message: "กรุณากรอก Username",
                    },
                  ]}
                >
                  <InputUsername placeholder="Username" />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: modal?.status !== "detail" && true,
                      message: "กรุณากรอก Password",
                    },
                  ]}
                >
                  <InputPassword
                    placeholder="Password"
                    // disabled={modal?.status === "detail" || "edit" && true}
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="สถานะการใช้งาน" name="active">
                  <Radio.Group
                    onChange={onChangeRadio}
                    value={value}
                    // disabled={modal?.status === "detail" && true}
                  >
                    <RadioStyled value={true}>ใช้งาน</RadioStyled>
                    <RadioStyled value={false}>ปิดใช้งาน</RadioStyled>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        <Row
          justify="center"
          gutter={16}
          style={{ width: "100%", marginTop: "20px" }}
        >
          <Col span={6}>
            <ButtonStyled
              color="#F1BE44"
              style={{ width: "100%" }}
              onClick={() => {
                setModal({ open: false });
                form.resetFields();
              }}
            >
              cancel
            </ButtonStyled>
          </Col>
          <Col span={6}>
            <ButtonStyled
              htmlType="submit"
              background="#F1BE44"
              onClick={() => {
                setModal({ open: false });
                // form.resetFields();
              }}
              style={{ width: "100%" }}
            >
          
              {modal?.status === "delete"
                ? "confirm"
                : modal?.status === "detail"
                ? "close"
                :"save"
                }
            </ButtonStyled>
          </Col>
        </Row>
      </Form>
    </ModalStyled>

  );
};

const ButtonStyled = styled(Button)<{ background?: string; color?: string }>`
  height: 40px;
  border: 1px solid #f1be44;
  border-radius: 20px;
  color: ${(props) => (props?.color ? props?.color : "white")};
  background: ${(props) => (props?.background ? props?.background : "white")};
  font-size: 18px;
`;

const InputStyled = styled(Input)`
  font-size: 16px;
  height: 40px;
  border-radius: 8px;
`;

const InputPassword = styled(Input.Password)`
  font-size: 16px;
  height: 40px;
  border-radius: 8px;
`;
const InputUsername = styled(Input)`
  font-size: 16px;
  height: 40px;
  border-radius: 8px;
`;
const DatePickerStyled = styled(DatePicker)`
  font-size: 16px;
  height: 40px;
  border-radius: 8px;
  width: 100%;
`;
const SelectStyled = styled(Select)`
  .ant-select-selector {
    border-radius: 10px !important;
  }
`;

const RadioStyled = styled(Radio)`
  .ant-radio-inner {
    width: 25px;
    height: 25px;
  }

  .ant-radio-checked .ant-radio-inner {
    border-color: #064595;
  }

  .ant-radio-inner::after {
    width: 25px;
    height: 25px;
    top: 30%;
    left: 30%;
    background-color: #064595;
  }
`;

const ModalStyled = styled(Modal)`
  .ant-modal-content {
    border-radius: 46px;
    padding: 30px;
  }

  .ant-modal-close {
    margin-top: 50px;
    margin-right: 30px;
  }

  .ant-modal-close-x {
    font-size: 22px;
  }
`;

export default EmployeeModal;
