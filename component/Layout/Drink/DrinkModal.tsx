import {
    Button,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Typography,
    message,
    notification,
  } from "antd";
  import React, { useEffect, useState } from "react";
  import styled from "styled-components";
  import HeaderTitle from "../HeaderTitle";
  import Upload, {
    RcFile,
    UploadChangeParam,
    UploadFile,
    UploadProps,
  } from "antd/lib/upload";
  import {
    LoadingOutlined,
    PlusOutlined,
    UploadOutlined,
  } from "@ant-design/icons";
  import axios from "axios";
  
  const getBase64 = (img: any, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      notification["success"]({
        message: "You can only upload JPG/PNG file!",
      });
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      notification["success"]({
        message: "Image must smaller than 1MB!",
      });
      message.error("Image must smaller than 1MB!");
    }
    return isJpgOrPng && isLt5M;
  };
  
  
  const DrinkModal = (
    modal: any,
    setModal: any,
    onAddDrink: any,
    onEditDrink: any,
    onDeleteDrink: any,
    typeDrink: any
  ) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
   
    const { Option } = Select;
    const [form] = Form.useForm();
    const onFinish = async (values: any) => {
      form.resetFields();
      if (modal?.status === "add") {
        onAddDrink({ ...values });
        setModal({ value: values, open: false });
        setImageUrl("");
      } else if (modal?.status === "edit") {
        onEditDrink({ ...values });
        setModal({ value: values, open: false });
        setImageUrl("");
      } else if (modal?.status === "delete") {
        onDeleteDrink(values?.delete);
        setModal({ open: false });
      }
      // console.log("values>>>>>>>",values)
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
          name: modal?.value?.name,
          // image: modal?.value?.image,
          price: modal?.value?.price,
          typeDrink_id: modal?.value?.typeDrink_id,
        });
        setImageUrl(modal?.value?.image);
      } else if (modal?.status === "add") {
        form.setFieldsValue({});
      }
    }, [modal, setModal]);
  
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
      <ModalStyled
        open={modal?.open}
        footer={false}
        width={900}
        centered
        onCancel={() => {
          setModal({ open: false });
          setImageUrl("");
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
                <Typography style={{ textAlign: "center", fontSize: 20 }}>
                  ต้องการลบเมนู {modal?.value?.name} {" "}
                  ใช่หรือไม่
                </Typography>
              </Row>
            </>
          ) : (
            <>
              <Row
                justify="space-between"
                style={{ width: "100%", marginTop: "50px" }}
              >
                <Col span={10}>
                  <Form.Item
                    name="name"
                    label="เครื่องดื่ม"
                    rules={[
                      {
                        required: modal?.status !== "detail" && true,
                        message: "กรุณากรอก ชื่อเครื่องดื่ม",
                      },
                    ]}
                  >
                    <InputStyled placeholder="เครื่องดื่ม" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    label="รูปภาพ"
                    name="image"
                    rules={[
                      {
                        required: modal?.status !== "detail" && true,
                        message: "กรุณากรอก รูปภาพ",
                      },
                    ]}
                  >
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
                <Col span={10}>
                  <Form.Item
                    name="price"
                    label="ราคา"
                    rules={[
                      {
                        required: modal?.status !== "detail" && true,
                        message: "กรุณากรอก ราคา",
                      },
                    ]}
                  >
                    <InputStyled placeholder="ราคา" />
                  </Form.Item>
                </Col>
  
                <Col span={10}>
                  <Form.Item
                    label="ประเภทเครื่องดื่ม"
                    name="typeDrink_id"
                    rules={[
                      {
                        required: modal?.status !== "detail" && true,
                        message: "กรุณากรอก ประเภทเครื่องดื่ม",
                      },
                    ]}
                  >
                    <SelectStyled
                      showSearch
                      size="large"
                      placeholder="เลือกประเภทเครื่องดื่ม"
                      optionFilterProp="children"
                      onSearch={onSearchSelect}
                      filterOption={(input, option) =>
                        (option!.children as unknown as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {typeDrink !== undefined &&
                        typeDrink?.map((value: any, index: number) => (
                          <Option key={index} value={value?.id}>
                            {value?.name}
                          </Option>
                        ))}
                    </SelectStyled>
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
                  setImageUrl("");
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
                  : "save"}
              </ButtonStyled>
            </Col>
          </Row>
        </Form>
      </ModalStyled>
    );
  };
  const ModalStyled = styled(Modal)`
    .ant-modal-content {
      border-radius: 46px;
      padding: 30px;
    }
  
.ant-modal-close {
      margin-top: 20px;
      margin-right: 30px;
  }
  
    .ant-modal-close-x {
      font-size: 22px;
    }
  `;
  
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
  
  const SelectStyled = styled(Select)`
    .ant-select-selector {
      border-radius: 10px !important;
    }
  `;
  const UploadStyled = styled(Upload)`
    .ant-upload.ant-upload-select-picture-card {
      width: 260px;
      height: 300px;
      border-radius: 30px;
      display: block;
      margin: 0px auto;
      margin-bottom: 30px;
    }
  `;
  
  export default DrinkModal;
  