import {
  Avatar,
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Image,
  Input,
  Layout,
  Pagination,
  Row,
  Spin,
  Typography,
  notification,
} from "antd";
import { Footer, Header } from "antd/lib/layout/layout";
import styled from "styled-components";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { FormOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import HeaderMenu from "../component/Layout/headerMenu";
interface IFood {
  name: any;
  price: string;
  typeFood_id: string;
  image: string;
}
interface Iprops {
  user: any;
}
export default function Home() {
  const router = useRouter();
  const [foodData, setFoodData] = useState<IFood[]>([]);

  const [totalPage, setTotalPage] = useState<number>();

  const [loading, setLoading] = useState(false);

  const [displayCount, setDisplayCount] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * displayCount;
  const endIndex = startIndex + displayCount;

  console.log("FoodData", foodData);
  const [filter, setFilter] = useState({
    // where: {},
    // query: "",
    // limit: 12,
    // skip: 0,
  });

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
          router.push("/login");
        }
      }
    });

    if (result?.status === 200) {
      setFoodData(result?.data?.data);
      setTotalPage(result?.data?.data?.length);
      setLoading(false);
    } else {
      setTotalPage(0);
      setLoading(false);
      setFoodData([]);
    }
  };

  useEffect(() => {
    queryFood(filter);
  }, [filter, setFilter]);

  const FoodList: any = foodData;
  const { Meta } = Card;

  const [order, setOrder] = useState<IFood[]>([]);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
    setOrder([]);
  };
  const handleAddToOrder = (food: IFood) => {
    setOrder((prevOrder) => [...prevOrder, food]);
  };
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    let totalPrice = 0;
    order.forEach((item) => {
      totalPrice += parseFloat(item.price);
    });
    setTotalPrice(totalPrice);
  }, [order]);
  return (
    <Layout>
      <Row gutter={[24, 0]}>
        <Divider style={{ fontSize: "40px" }}>Recommended Menu</Divider>
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
                    <Col span={6} key={value?.id}>
                     
                        <CardStyle
                          cover={
                            <Image
                              style={{ width: "100%" }}
                              height={230}
                              src={value?.image}
                            />
                          }
                          actions={[
                            <Button
                              onClick={() => handleAddToOrder(value)}
                              icon={<FormOutlined />}
                            >
                              Add to Order
                            </Button>,
                          ]}
                        >
                          <Meta
                            title={value?.name}
                            description={value?.price}
                          />
                        </CardStyle>
                     
                    </Col>
                  ))}
              </Row>
            )}
            <Row justify="center" style={{ width: "100%" }}>
              {totalPage === 0 ? (
                <Typography style={{ textAlign: "center", fontSize: "18px" }}>
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
          {order.length > 0 && (
            <CardStyle bordered={false} style={{ float: "right", marginTop: "50px" }}>
              <Typography.Title level={4}>Your Order</Typography.Title>
              {order.map((item) => (
                <Card key={item.name} style={{ marginBottom: '16px' }}>
                  <Typography.Text>{item.name}</Typography.Text>
                  <Typography.Text type="secondary">
                    Price: {item.price}
                  </Typography.Text>
                </Card>
              ))}
              <Typography.Text strong>Total Price: {totalPrice.toFixed(2)}</Typography.Text>
            </CardStyle>
          )}
        </Col>

        <Footer style={{ textAlign: "center", marginTop: "20px" }}>
          H.R.H. Princess Valaya Building
        </Footer>
      </Row>
 
    </Layout>
  );
}


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
  height: 200px;
  padding: 0 !important;
`;

const TextStyled = styled(Typography)`
  font-size: 16px;
  font-family: Sarabun;
`;
