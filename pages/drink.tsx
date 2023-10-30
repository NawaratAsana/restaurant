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
import { getFiletoBase64 } from "../lib/common";
import DrinkModal from "../component/Layout/Drink/DrinkModal";
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
  Typography,
  notification,
} from "antd";

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
interface IDrink {
  name: any;
  price: string;
  typeDrink_id: string;
  image: string;
}
interface Iprops {
  user: any;
}
interface IModalDrink {
  header?: string;
  status?: string;
  open?: boolean;
  value?: any;
}
const Drink = (props: Iprops) => {
  const router = useRouter();
  const [searchName, setSearchName] = useState("");
  const [selectedTypeDrink, setSelectedTypeDrink] = useState<
    string | undefined
  >(undefined);

  const [drinkData, setDrinkData] = useState<IDrink[]>([]);
  const [modal, setModal] = useState<IModalDrink>({
    header: "",
    status: "",
    open: false,
    value: {},
  });
  const [typeDrink, setTypeDrink] = useState([
    {
      id: "",
      name: "",
    },
  ]);

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
  const [typeDrinkFilter, setTypeDrinkFilter] = useState({
    where: {},
    query: "",
    limit: 10,
    skip: 0,
  });

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

  const queryDrink = async (filter: any) => {
    const result = await axios({
      method: "post",
      url: `/api/drink/query`,
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
    console.log("result >>>>>>result?.data?.data?.rows ", result?.data?.data);
    if (result?.status === 200) {
      const responseData = result?.data?.data;
      const filteredData = responseData.filter((drink: IDrink) =>
        drink.name.toLowerCase().includes(searchName.toLowerCase())
      );
      if (selectedTypeDrink) {
        const filteredByType = filteredData.filter(
          (drink: IDrink) => drink.typeDrink_id === selectedTypeDrink
        );
        setDrinkData(filteredByType);
        setTotalPage(filteredByType.length);
      } else {
        setDrinkData(filteredData);
        setTotalPage(filteredData.length);
      }
      setLoading(false);
    } else {
      setTotalPage(0);
      setLoading(false);
      setDrinkData([]);
    }
  };

  const queryTypeDrink = async (filter: any) => {
    const result = await axios({
      method: "post",
      url: `/api/typeDrink/query`,
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
      const typeDrinkData: any[] = [];
      result?.data?.data?.map((value: any) => {
        typeDrinkData.push({
          id: value._id,
          name: value?.name,
        });
      });

      setTypeDrink(typeDrinkData);
    }
  };

  const onAddDrink = async (value: any) => {
    const url: any = await getFiletoBase64(value?.image?.file?.originFileObj);
    value.image = url;
    console.log("value >>>>>>>>> ", value);
    const result = await axios({
      method: "post",
      url: `/api/drink/create`,
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
      const newModal = { ...modal, open: false };
      setModal(newModal);
      notification["success"]({
        message: "Drink-add-success",
      });
      console.log("data>>>>>>>>..", value);
      queryDrink(filter);
    }
  };

  const onEditDrink = async (value: any) => {
    if (value?.image?.file?.originFileObj) {
      const url: any = await getFiletoBase64(value?.image?.file?.originFileObj);
      value.image = url;
    }
    console.log("edit value >>>>>>>>>>> ", value);
    const result = await axios({
      method: "post",
      url: `/api/drink/update`,
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
        message: "Drink-edit-success",
      });
      queryDrink(filter);
    }
  };
  const onDeleteDrink = async (value: any) => {
    const result = await axios({
      method: "post",
      url: `/api/drink/delete`,
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
      const newModal = { ...modal, open: false };
      setModal(newModal);
      notification["success"]({
        message: "Drink-delete-success",
      });
      queryDrink(filter);
    }
  };
  const handleTypeDrinkChange = (value: string) => {
    setSelectedTypeDrink(value);
  };
  const handleSearch = (value: string) => {
    const searchValue = value.toLowerCase();

    const filteredFoodData = drinkData.filter((drink: IDrink) =>
      drink.name.toLowerCase().includes(searchValue)
    );

    setDrinkData(filteredFoodData);
    setSearchName(value);
  };
  useEffect(() => {
    setDrinkData([]);
  }, [searchName]);

  useEffect(() => {
    queryDrink(filter);
  }, [searchName, selectedTypeDrink]);
  useEffect(() => {
    queryDrink(filter);
  }, [modal, setModal, filter, setFilter]);

  useEffect(() => {
    queryTypeDrink(typeDrinkFilter);
  }, [modal, setModal, typeDrinkFilter, setTypeDrinkFilter]);

  const DrinkList: any = drinkData;

  return (
    <Layout>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={12} md={18}>
          <Title level={2} style={{ marginLeft: 50, marginTop: 50 }}>
            Drink
          </Title>
        </Col>

        <Col style={{ paddingRight: 50 }} xs={24} sm={12} md={6}>
          <ButtonStyled
            type="primary"
            onClick={() =>
              setModal({
                header: "เพิ่มเครื่องดื่ม",
                status: "add",
                open: true,
                value: "",
              })
            }
          >
            Add Drink
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
                    <Text strong>ประเภทเครื่องดื่ม:</Text>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="กรุณาเลือกประเภทเครื่องดื่ม"
                      allowClear
                      onChange={handleTypeDrinkChange}
                    >
                      {typeDrink.map((typeDrink: any) => (
                        <Option key={typeDrink.id} value={typeDrink.id}>
                          {typeDrink.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col xs={24} sm={12} md={8} style={{ textAlign: "start" }}>
                    <Text strong>ค้นหา:</Text>
                    <Search
                      placeholder="ค้นหาเครื่องดื่ม"
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
                    {Array.isArray(DrinkList) &&
                      DrinkList.slice(startIndex, endIndex).map(
                        (value: any) => (
                          <Col span={8} key={value?.id}>
                            <ResultCard
                              xxl={20}
                              xl={24}
                              lg={24}
                              key={value?.id}
                            >
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
                                            value?.typeDrink_id ===
                                            "649efe26b9847f59f7c3e1f7"
                                              ? "#FD5855"
                                              : value?.typeDrink_id ===
                                                "63c9132e33d18478d6fb87ec"
                                              ? "#2CBF44"
                                              : value?.typeDrink_id ===
                                                "63c9134f33d18478d6fb87ed"
                                              ? "#FFA500"
                                              : value?.typeDrink_id ===
                                                "63c9130533d18478d6fb87ea"
                                              ? "#4096ff"
                                              :value?.typeDrink_id ==="652c985f0654e614303fffb8"?
                                              "#A5A"
                                              : "#A5A3A3"
                                          }
                                          style={{ color: "#A5A3A3" }}
                                        >
                                          {value?.typeDrink_id ===
                                          "649efe26b9847f59f7c3e1f7"
                                            ? "milk/chocolate"
                                            : value?.typeDrink_id ===
                                              "63c9132e33d18478d6fb87ec"
                                            ? "smoothie/soda"
                                            : value?.typeDrink_id ===
                                              "63c9134f33d18478d6fb87ed"
                                            ? "เครื่องดื่ม"
                                            : value?.typeDrink_id ===
                                              "63c9130533d18478d6fb87ea"
                                            ? "coffee&tea"
                                            : value?.typeDrink_id ===
                                              "652c985f0654e614303fffb8"
                                            ? "add"
                                            : "Unknown"}
                                        </RadioStyled>
                                      </Col>

                                      <Col span={4}>
                                        <Dropdown
                                          overlay={menu}
                                          placement="bottom"
                                        >
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
                        )
                      )}
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
                      total={DrinkList.length}
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
      {DrinkModal(
        modal,
        setModal,
        onAddDrink,
        onEditDrink,
        onDeleteDrink,
        typeDrink
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

export default Drink;
