import {
  Button,
  Card,
  Col,
  Dropdown,
  Image,
  Input,
  Layout,
  Menu,
  Pagination,
  Radio,
  Row,
  Select,
  Spin,
  Table,
  Typography,
  notification,
} from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import FoodModal from "../component/Layout/Food/FoodModal";
import { getFiletoBase64 } from "../lib/common";

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
        destination: "/loginEmployee",
        parmanent: false,
      },
    };
  }
}

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
interface IFood {
  name: any;
  price: string;
  typeFood_id: string;
  image: string;
}
interface Iprops {
  user: any;
}
interface IModalFood {
  header?: string;
  status?: string;
  open?: boolean;
  value?: any;
}
const Food = (props: Iprops) => {
  const router = useRouter();
  const [foodData, setFoodData] = useState<IFood[]>([]);
  const [modal, setModal] = useState<IModalFood>({
    header: "",
    status: "",
    open: false,
    value: {},
  });
  const [typeFood, setTypeFood] = useState([
    {
      id: "",
      name: "",
    },
  ]);
  const [searchName, setSearchName] = useState("");

  const [totalPage, setTotalPage] = useState<number>();

  const [loading, setLoading] = useState(false);

  const [displayCount, setDisplayCount] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * displayCount;
  const endIndex = startIndex + displayCount;
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const [filter, setFilter] = useState({
    where: {},
    query: "",
    limit: 12,
    skip: 0,
  });
  const [typeFoodFilter, setTypeFoodFilter] = useState({
    where: {},
    query: "",
    limit: 10,
    skip: 0,
  });
  const [selectedTypeFood, setSelectedTypeFood] = useState<string | undefined>(
    undefined
  );
  const menu = (
    <MenuStyled
      style={{ background: "#DEE7F1", fontSize: 14 }}
      items={[
        {
          key: "1",
          label: (
            <span
              onClick={() => {
                const newModal = {
                  ...modal,
                  header: "แก้ไขข้อมูล",
                  status: "edit",
                  open: true,
                };
                setModal(newModal);
              }}
            >
              <FormOutlined /> {"แก้ไขข้อมูล"}
            </span>
          ),
        },
        {
          key: "2",
          label: (
            <span
              onClick={() => {
                const newModal = {
                  ...modal,
                  header: "ลบข้อมูล",
                  status: "delete",
                  open: true,
                };
                setModal(newModal);
              }}
            >
              <DeleteOutlined />
              ลบข้อมูล
            </span>
          ),
        },
      ]}
    />
  );

  const queryFood = async (filter: any) => {
    const result = await axios({
      method: "post",
      url: `/api/food/query`,
      data: filter,
    }).catch((err) => {
      if (err) {
        if (err?.response?.data?.message?.status === 401) {
          notification["error"]({
            message: "Query ข้อมูลไม่สำเร็จ",
            description: "กรุณาเข้าสู่ระบบ",
          });
          Cookies.remove("user");
          router.push("/loginEmployee");
        }
      }
    });

    if (result?.status === 200) {
      const responseData = result?.data?.data;
      const filteredData = responseData.filter((food: IFood) =>
        food.name.toLowerCase().includes(searchName.toLowerCase())
      );

      if (selectedTypeFood) {
        const filteredByType = filteredData.filter(
          (food: IFood) => food.typeFood_id === selectedTypeFood
        );
        setFoodData(filteredByType);
        setTotalPage(filteredByType.length);
      } else {
        setFoodData(filteredData);
        setTotalPage(filteredData.length);
      }
      setLoading(false);
    } else {
      setTotalPage(0);
      setLoading(false);
      setFoodData([]);
    }
  };

  const queryTypeFood = async (filter: any) => {
    const result = await axios({
      method: "post",
      url: `/api/typeFood/query`,
      data: filter,
    }).catch((err) => {
      if (err) {
        if (err?.response?.data?.message?.status === 401) {
          notification["error"]({
            message: "Query ข้อมูลไม่สำเร็จ",
            description: "กรุณาเข้าสู่ระบบ",
          });
          Cookies.remove("user");
          router.push("/loginEmployee");
        }
      }
    });
    if (result?.status === 200) {
      const typeFoodData: any[] = [];
      result?.data?.data?.map((value: any) => {
        typeFoodData.push({
          id: value._id,
          name: value?.name,
        });
      });

      setTypeFood(typeFoodData);
    }
  };

  const onAddFood = async (value: any) => {
    const url: any = await getFiletoBase64(value?.image?.file?.originFileObj);
    value.image = url;
    console.log("value >>>>>>>>> ", value);
    const result = await axios({
      method: "post",
      url: `/api/food/create`,
      data: value,
    }).catch((err) => {
      if (err) {
        if (err?.response?.data?.message?.status === 401) {
          notification["error"]({
            message: "Query ข้อมูลไม่สำเร็จ",
            description: "กรุณาเข้าสู่ระบบ",
          });
          Cookies.remove("user");
          router.push("/loginEmployee");
        }
      }
    });
    if (result?.status === 200) {
      let newModal = { ...modal, open: false };
      setModal(newModal);
      notification["success"]({
        message: "food-add-success",
      });
      console.log("data>>>>>>>>..", value);
      queryFood(filter);
    }
  };

  const onEditFood = async (value: any) => {
    if (value?.image?.file?.originFileObj) {
      let url: any = await getFiletoBase64(value?.image?.file?.originFileObj);
      value.image = url;
    }
    console.log("edit value >>>>>>>>>>> ", value);
    const result = await axios({
      method: "post",
      url: `/api/food/update`,
      data: {
        ...value,
        id: modal?.value?._id,
      },
    }).catch((err) => {
      if (err) {
        if (err?.response?.data?.message?.status === 401) {
          notification["error"]({
            message: "Query ข้อมูลไม่สำเร็จ",
            description: "กรุณาเข้าสู่ระบบ",
          });
          Cookies.remove("user");
          router.push("/loginEmployee");
        }
      }
    });
    if (result?.status === 200) {
      notification["success"]({
        message: "food-edit-success",
      });
      queryFood(filter);
    }
  };

  const onDeleteFood = async (value: any) => {
    const result = await axios({
      method: "post",
      url: `/api/food/delete`,
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
    if (result?.status === 200) {
      let newModal = { ...modal, open: false };
      setModal(newModal);
      notification["success"]({
        message: "food-delete-success",
      });
      queryFood(filter);
    }
  };

  const handleSearch = (value: string) => {
    const searchValue = value.toLowerCase();

    const filteredFoodData = foodData.filter((food: IFood) =>
      food.name.toLowerCase().includes(searchValue)
    );

    setFoodData(filteredFoodData);
    setSearchName(value);
  };

  useEffect(() => {
    setFoodData([]);
  }, [searchName]);

  useEffect(() => {
    queryFood(filter);
  }, [searchName, selectedTypeFood]);

  const handleTypeFoodChange = (value: string) => {
    setSelectedTypeFood(value);
  };

  useEffect(() => {
    queryFood(filter);
  }, [modal, setModal, filter, setFilter]);

  useEffect(() => {
    queryTypeFood(typeFoodFilter);
  }, [modal, setModal, typeFoodFilter, setTypeFoodFilter]);

  const FoodList: any = foodData;

  return (
    <Layout>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={12} md={18}>
          <Title level={2} style={{ marginLeft: 50, marginTop: 50 }}>
            Food
          </Title>
        </Col>

        <Col style={{ paddingRight: 50 }} xs={24} sm={12} md={6}>
          <ButtonStyled
            type="primary"
            onClick={() =>
              setModal({
                header: "เพิ่มเมนูอาหาร",
                status: "add",
                open: true,
                value: "",
              })
            }
          >
            Add Food
          </ButtonStyled>
        </Col>
      </Row>

      <Row style={{ margin: "24px 16px 0" }}>
        <div
          style={{
            padding: 24,
            textAlign: "center",
          }}
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <CardStyle>
                <Row gutter={[16, 16]} justify={"start"}>
                  <Col xs={24} sm={12} md={8} style={{ textAlign: "start" }}>
                    <Text strong>ประเภทอาหาร:</Text>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="กรุณาเลือกประเภทอาหาร"
                      allowClear
                      onChange={handleTypeFoodChange}
                    >
                      {typeFood.map((typeFood: any) => (
                        <Option key={typeFood.id} value={typeFood.id}>
                          {typeFood.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col xs={24} sm={12} md={8} style={{ textAlign: "start" }}>
                    <Text strong>ค้นหา:</Text>
                    <Search
                      placeholder="ค้นหาอาหาร"
                      onSearch={handleSearch}
                      allowClear
                    />
                  </Col>
                </Row>
              </CardStyle>
            </Col>
            <Col span={24}>
              <CardStyle bordered={false}>
                {loading ? (
                  <Spin />
                ) : (
                  <Row
                    justify="start"
                    gutter={45}
                    style={{ width: "100%", margin: "50px 0px" }}
                  >
                    {Array.isArray(FoodList) &&
                      FoodList.slice(startIndex, endIndex).map((value: any) => (
                        <Col span={8} key={value?.id}>
                          <ResultCard xxl={20} xl={24} lg={24} key={value?.id}>
                            <Row style={{ width: "100%" }} gutter={8}>
                              <Col
                                xxl={10}
                                xl={12}
                                lg={14}
                                md={12}
                                sm={24}
                                xs={24}
                              >
                                <Image
                                  style={{
                                    borderTopLeftRadius: "30px",
                                    borderBottomLeftRadius: "30px",
                                    width: "100%",
                                  }}
                                  height={150}
                                  src={value?.image}
                                />
                              </Col>
                              <Col
                                xxl={14}
                                xl={12}
                                lg={10}
                                md={12}
                                sm={24}
                                xs={24}
                              >
                                <Row
                                  align="middle"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    padding: "10px 0px",
                                  }}
                                >
                                  <Row style={{ width: "100%" }}>
                                    <Col
                                      span={20}
                                      style={{ alignContent: "end" }}
                                    >
                                      <RadioStyled
                                        checked
                                        color={
                                          value?.typeFood_id ===
                                          "63c913b133d18478d6fb87ef"
                                            ? "#FD5855"
                                            : value?.typeFood_id ===
                                              "652c97000654e614303fffb1"
                                            ? "#2CBF44"
                                            : value?.typeFood_id ===
                                              "652c971d0654e614303fffb2"
                                            ? "#FFA500"
                                            : value?.typeFood_id ===
                                              "652c973a0654e614303fffb3"
                                            ? "#2f54eb"
                                            : value?.typeFood_id ===
                                              "652c97630654e614303fffb4"
                                            ? "#A5A"
                                            : value?.typeFood_id ===
                                              "652c97980654e614303fffb5"
                                            ? "#fa541c"
                                            : value?.typeFood_id ===
                                              "652c97b80654e614303fffb6"
                                            ? "#722ed1"
                                            : value?.typeFood_id ===
                                              "652e064bcc998987d16d8803"
                                            ? "#eb2f96"
                                            : "#A5A3A3"
                                        }
                                        style={{ color: "#A5A3A3" }}
                                      >
                                        {value?.typeFood_id ===
                                        "63c913b133d18478d6fb87ef"
                                          ? "ต้มและแกง"
                                          : value?.typeFood_id ===
                                            "652c97000654e614303fffb1"
                                          ? "ผัด"
                                          : value?.typeFood_id ===
                                            "652c971d0654e614303fffb2"
                                          ? "อาหารจานเดียว"
                                          : value?.typeFood_id ===
                                            "652c973a0654e614303fffb3"
                                          ? "สลัด ยำ ส้มตำ"
                                          : value?.typeFood_id ===
                                            "652c97630654e614303fffb4"
                                          ? "ของว่าง"
                                          : value?.typeFood_id ===
                                            "652c97980654e614303fffb5"
                                          ? "ทอด"
                                          : value?.typeFood_id ===
                                            "652c97b80654e614303fffb6"
                                          ? "น้ำพริกเครื่องเคียง"
                                          : value?.typeFood_id ===
                                            "652e064bcc998987d16d8803"
                                          ? "อื่นๆ"
                                          : "Unknown"}
                                      </RadioStyled>
                                    </Col>

                                    <Col span={4}>
                                      <Dropdown
                                        overlay={menu}
                                        placement="bottom"
                                      >
                                        {/* <Button type="text" icon={ */}
                                        <MenuOutlined
                                          onMouseEnter={() => {
                                            const modalValue = {
                                              ...modal,
                                              value: value,
                                            };
                                            setModal(modalValue);
                                          }}
                                          style={{ fontSize: "18px" }}
                                        />
                                        {/* } /> */}
                                      </Dropdown>
                                    </Col>
                                  </Row>
                                  <Row style={{ width: "100%" }}>
                                    <TextStyled>{value?.name}</TextStyled>
                                  </Row>
                                  <Row style={{ width: "100%" }}>
                                    <TextStyled>ราคา: {value?.price}</TextStyled>
                                  </Row>
                                </Row>
                              </Col>
                            </Row>
                          </ResultCard>
                        </Col>
                      ))}
                  </Row>
                )}
                <Row justify="center" style={{ width: "100%" }}>
                  {totalPage === 0 ? (
                    <Typography
                      style={{ textAlign: "center", fontSize: "18px" }}
                    >
                      common-not-found-data
                    </Typography>
                  ) : (
                    <Pagination
                      current={currentPage}
                      defaultPageSize={displayCount}
                      total={FoodList.length}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                    />
                  )}
                </Row>
              </CardStyle>
            </Col>
          </Row>
        </div>
      </Row>
      {FoodModal(
        modal,
        setModal,
        onAddFood,
        onEditFood,
        onDeleteFood,
        typeFood
      )}
    </Layout>
  );
};

const MenuStyled = styled(Menu)`
  .ant-select-dropdown-menu-item-active:not(
      .ant-select-dropdown-menu-item-disabled
    ),
  .ant-select-dropdown-menu-item:hover:not(
      .ant-select-dropdown-menu-item-disabled
    ) {
    background-color: red !important;
  }
`;

const RadioStyled = styled(Radio)<{ color: string }>`
  .ant-radio-checked .ant-radio-inner {
    border-color: ${(props: any) => props.color};
  }

  .ant-radio-inner::after {
    background-color: ${(props: any) => props.color};
  }
  :where(.css-dev-only-do-not-override-fpg3f5).ant-radio-wrapper .ant-radio-checked .ant-radio-inner {
    background-color: transparent; !important;
   
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

const CardStyle = styled(Card)`
  box-shadow: 0px 20px 27px #0000000d;
  border-radius: 12px;
  width: 100%;
`;

const ResultCard = styled(Col)`
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 4px 3px 20px #00000029;
  border-radius: 30px;
  margin-bottom: 30px;
  height: 150px;
  padding: 0 !important;
`;

const TextStyled = styled(Typography)`
  font-size: 16px;
  font-family: Sarabun;
`;

export default Food;
