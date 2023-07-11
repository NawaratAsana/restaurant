import {
  ArrowUpOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ShoppingFilled,
  UserOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Layout,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Typography,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";
import styled from "styled-components";
import Revenue from "../component/Layout/chart/Revenue";

const Static = () => {
  const { Title, Text } = Typography;

  const data = [
    {
      title: "Ant Design Title 1",
    },
    {
      title: "Ant Design Title 2",
    },
    {
      title: "Ant Design Title 3",
    },
    {
      title: "Ant Design Title 4",
    },
  ];
  const count = [
    {
      today: "Today’s Sales",
      title: "$53,000",
      persent: "+30%",
      icon: <DollarOutlined />,
      bnb: "bnb2",
    },
    {
      today: "Today’s Sales",
      title: "$53,000",
      persent: "+30%",
      icon: <DollarOutlined />,
      bnb: "bnb2",
    },
    {
      today: "Today’s Sales",
      title: "$53,000",
      persent: "+30%",
      icon: <DollarOutlined />,
      bnb: "bnb2",
    },
    {
      today: "Today’s Sales",
      title: "$53,000",
      persent: "+30%",
      icon: <DollarOutlined />,
      bnb: "bnb2",
    },
  ];
  return (
    <Layout
      className="site-layout"
      // style={{ marginTop: "50px" }}
    >
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <div
          style={{
            padding: 24,
            textAlign: "center",
          }}
        >
          <Row gutter={[24, 0]}>
            <Typography>Dashboard</Typography>
          </Row>
          <Row gutter={[24, 0]}>
            {count.map((c, index) => (
              <Col
                key={index}
                xs={24}
                sm={24}
                md={12}
                lg={6}
                xl={6}
                className="mb-24"
              >
                <Card bordered={false} className="criclebox ">
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={18}>
                        <span>{c.today}</span>
                        <Title level={3}>
                          {c.title} <small className={c.bnb}>{c.persent}</small>
                        </Title>
                      </Col>
                      <Col xs={6}>
                        <div className="icon-box">{c.icon}</div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            ))}
            {/* <Col span={8}>
          <CardStyle>
            <Row justify="space-between">
              <Space align="center">
                <ShoppingCartOutlined style={{ fontSize: 30 }} />
              </Space>
              <Typography style={{ fontSize: 30, color: "#13c2c2" }}>
                {" "}
                117
              </Typography>
            </Row>
            <TextStyle style={{}}> Total Order</TextStyle>
            <Progress percent={50} showInfo={false} />
          </CardStyle>
        </Col>
        <Col span={8}>
          <CardStyle>
            <Row justify="space-between">
              <Space align="center">
                <UserOutlined style={{ fontSize: 30 }} />
              </Space>
              <Typography style={{ fontSize: 30, color: "#13c2c2" }}>
                {" "}
                117
              </Typography>
            </Row>
            <TextStyle style={{}}> Total Member</TextStyle>
            <Progress percent={50} showInfo={false} />
          </CardStyle>
        </Col>
        <Col span={8}>
          <CardStyle>
            <Row justify="space-between">
              <Space align="center">
                <ShoppingFilled style={{ fontSize: 30 }} />
              </Space>
              <Typography style={{ fontSize: 30, color: "#13c2c2" }}>
                {" "}
                117
              </Typography>
            </Row>
            <TextStyle style={{}}> Total Employee</TextStyle>
            <Progress percent={50} showInfo={false} />
          </CardStyle>
        </Col> */}
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
              <Card bordered={false} className="criclebox h-full">
                <Revenue />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
              <CardStyle1 title="Revenue">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </CardStyle1>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
              <List
                style={{
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  textAlign: "left",
                }}
                bordered
                header={
                  <div>
                    <TextStyle1>Order</TextStyle1>
                  </div>
                }
                itemLayout="vertical"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<a href="https://ant.design">{item.title}</a>}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                  </List.Item>
                )}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
              <List
                style={{
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  textAlign: "left",
                  marginTop: 20,
                }}
                bordered
                header={
                  <div>
                    <TextStyle1>New Member</TextStyle1>
                  </div>
                }
                itemLayout="vertical"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<a href="https://ant.design">{item.title}</a>}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

const TextStyle1 = styled(Typography)`
  font-weight: bolder;
  font-size: 20px;
`;
const TextStyle = styled(Typography)`
  font-weight: bolder;
  font-size: 20px;
  float: left;
`;
const CardStyle = styled(Card)`
  border-radius: 10px;
  // width: 300px;
  // max-width: 400px;
  margin: auto;
`;
const CardStyle1 = styled(Card)`
  border-color: #d9d9d9;
  border-radius: 10px;

  .ant-card-head-title {
    font-weight: bolder;
    font-size: 20px;
    text-align: left;
  }
`;

export default Static;
