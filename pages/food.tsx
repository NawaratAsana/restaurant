import {
  Button,
  Card,
  Col,
  Image,
  Layout,
  Row,
  Spin,
  Table,
  Typography,
  notification,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import FoodModal from "../component/Layout/Food/FoodModal";


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
const { Title } = Typography;
interface IFood {
  name: string;
  image: string;
  price: number;
  typeFood_id: string;
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
const food = (props: Iprops) => {
  const router = useRouter();
  const [food, setFood] = useState<IFood[]>([]);
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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  let pageSize: number = 10;
  const [filter, setFilter] = useState({
    where: {},
    query: "",
    limit: 10,
    skip: 0,
  });
  const [typeFoodFilter, setTypeFoodFilter] = useState({
    where: {},
    query: "",
    limit: 10,
    skip: 0,
  });

  
  const queryFood = async (filter: any) => {
    setLoading(true);
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
      console.log("result?.data?.data?.rows >>>>> ", result?.data?.data);
      
      const foodData = result?.data?.data;
      const foodWithImageData = foodData.map((foodItem: IFood) => {
        const { image } = foodItem;
        const imageData = `data:image/png;base64, ${image}`; // Assuming the image data is in base64 format
        return { ...foodItem, image: imageData };
      });
      
      setTotalPage(result?.data?.data?.count);
      setFood(result?.data?.data);
      setLoading(false);
    } else {
      setTotalPage(0);
      setFood([]);
      setLoading(false);
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
      // console.log("result position >>>> ", result?.data?.data?.rows);
      let typeFoodData: any[] = [];
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
      notification["success"]({
        message: "food-add-success",
      });
      console.log("", value);
      queryFood(filter);
    }
  };
  const onEditFood = async (value: any) => {
    console.log("edit value >>>>>>>>>>> ", value);
    const result = await axios({
      method: "post",
      url: `/api/food/update`,
      data: { ...value, id: modal?.value?._id },
    }).catch((err) => {
      if (err) {
        // console.log(err)
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
      data: { id: modal?.value?._id },
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
      notification["success"]({
        message: "food-delete-success",
      });
      queryFood(filter);
    }
  };
  useEffect(() => {
    queryFood(filter);

  }, [modal, setModal, filter, setFilter]);

  useEffect(() => {
    queryTypeFood(typeFoodFilter);
  }, [modal, setModal, typeFoodFilter, setTypeFoodFilter]);




  const columns: any = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "10%",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image:any) => <Image src={image} alt="Food Image" width="100" height="100" />,
    
  },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "TypeFood",
      key: "typeFood_id",
      dataIndex: "typeFood_id",
      align: "center",
      render: (_: any, record: any) => (
        <>
          {typeFood?.map((value: any, index: number) => {
            if (value?.id === record?.typeFood_id) {
              return <Typography key={index}>{value?.name}</Typography>;
            }
          })}
        </>
      ),
    },

    {
      title: "Action",
      key: "manage",
      dataIndex: "manage",
      align: "center",
      width: "30%",
      render: (_: any, record: any) => (
        <Row justify="center" gutter={8} style={{ width: "100%" }}>
          <Col span={6}>
            <EditOutlined
              style={{
                fontSize: "24px",
                color: "#064595",
              }}
              onClick={() =>
                setModal({
                  // header: props?.user?.role === "63f5124b0e947c18f977699d" ? "แก้ไขข้อมูล" : "รายละเอียด",
                  header: "แก้ไขข้อมูล",
                  // status: props?.user?.role === "63f5124b0e947c18f977699d" ? "edit" : "detail",
                  status: "edit",
                  open: true,
                  value: record,
                })
              }
            />
          </Col>
          <Col span={6}>
            <SearchOutlined
              style={{
                fontSize: "24px",
                color: "#064595",
              }}
              onClick={() =>
                setModal({
                  header: "รายละเอียด",
                  status: "detail",
                  open: true,
                  value: record,
                })
              }
            />
          </Col>
          <Col span={6}>
            <DeleteOutlined
              style={{ color: "#f5222d", fontSize: "24px" }}
              onClick={() =>
                setModal({
                  header: "ลบเมนูอาหาร",
                  status: "delete",
                  open: true,
                  value: record,
                })
              }
            />
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <Layout className="site-layout" style={{ marginLeft: 200 }}>
      <Content style={{ margin: "24px 16px 0" }}>
        <div
          style={{
            padding: 24,
            textAlign: "center",
          }}
        >
          <Row gutter={[24, 0]}>
            <Col span={20} style={{ textAlign: "left" }} xs="20" xl={20}>
              <Title> ข้อมูลเมนูอาหาร</Title>
            </Col>
            <Col span={4}>
              <ButtonStyled
                type="primary"
                onClick={() =>
                  setModal({
                    header: "เพิ่มเมนูอาหาร",
                    status: "add",
                    open: true,
                  })
                }
              >
                Add Food
              </ButtonStyled>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs="24" xl={24}>
              <CardStyle bordered={false}>
                <div className="table-responsive">
                  {loading ? (
                    <Spin />
                  ) : (
                    <Table
                      style={{ fontSize: 14 }}
                      pagination={{
                        current: page,
                        total: totalPage,
                        pageSize: pageSize,
                        showSizeChanger: false,
                        onChange: async (page: number) => {
                          let newFilter = {
                            ...filter,
                            skip: (page - 1) * pageSize,
                          };
                          setPage(page);
                          setFilter(newFilter);
                          await queryTypeFood(newFilter);
                        },
                      }}
                      columns={columns}
                      dataSource={food}
                      // className="ant-border-space"
                    />
                  )}
                </div>
              </CardStyle>
            </Col>
          </Row>
        </div>
      </Content>
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

const ButtonStyled = styled(Button)`
  height: 40px;
  width: 100%;
  border-radius: 20px;
  font-size: 18px;
  border: none;
`;

const CardStyle = styled(Card)`
  box-shadow: 0px 20px 27px #0000000d;
  border-radius: 12px;
`;
export default food;
