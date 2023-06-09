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
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadFileStatus } from "antd/lib/upload/interface";
import axios from "axios";
// import { url } from "inspector";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

interface IFormValue {
  name: string;
  image: string;
  price: number;
  typeFood_id: string;
  id?: string;
  delete?: string;
}

const FoodModal = (
  modal: any,
  setModal: any,
  onAddFood: any,
  onEditFood: any,
  onDeleteFood: any,
  typeFood: any
) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileList, setFileList] = useState<string>();
console.log
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      notification["success"]({
        message: "You can only upload JPG/PNG file!",
      });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      notification["success"]({
        message: "Image must smaller than 2MB!",
      });
    }
    return isJpgOrPng && isLt2M;
  };


  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
        setFileList(url);

      });
    }
    setFileList(info.file.url);
    console.log('fileList =====>', fileList)
  };
 
  const { Option } = Select;
  const [form] = Form.useForm();
  const onFinish = async (values: IFormValue) => {
    form.resetFields();
   
    if (modal?.status === "add") {
      onAddFood({...values  }); // Pass the image URL as a parameter
      setModal({ value: values, open: false });
    } else if (modal?.status === "edit") {
      onEditFood({ ...values }); // Pass the image URL as a parameter
      setModal({ value: values, open: false });
    } else if (modal?.status === "delete") {
      onDeleteFood(values?.delete);
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
        name: modal?.value?.name,
        image: modal?.value?.image,
        price: modal?.value?.price,
        typeFood_id: modal?.value?.typeFood_id,
      });
    } else if (modal?.status === "add") {
      form.setFieldsValue({});
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
        setImageUrl("");
        setFileList("")
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
                ต้องการลบเมนู {modal?.value?.name}
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
                  label="อาหาร"
                  rules={[
                    {
                      required: modal?.status !== "detail" && true,
                      message: "กรุณากรอก ชื่ออาหาร",
                    },
                  ]}
                >
                  <InputStyled placeholder="อาหาร" />
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
                      <div>
                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
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
                  label="ประเภทอาหาร"
                  name="typeFood_id"
                  rules={[
                    {
                      required: modal?.status !== "detail" && true,
                      message: "กรุณากรอก ประเภทอาหาร",
                    },
                  ]}
                >
                  <SelectStyled
                    showSearch
                    size="large"
                    placeholder="เลือกประเภทอาหาร"
                    optionFilterProp="children"
                    onSearch={onSearchSelect}
                    filterOption={(input, option) =>
                      (option!.children as unknown as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {typeFood !== undefined &&
                      typeFood?.map((value: any, index: number) => (
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
    margin-top: 50px;
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

export default FoodModal;
