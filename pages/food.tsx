import {
  Avatar,
  Button,
  Card,
  Col,
  Layout,
  Row,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";

const Food = () => {
  const { Meta } = Card;
  const onChange = (key: string) => {
    console.log(key);
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `อาหารไทย`,
      children: `Content of Tab Pane 1`,
    },
    {
      key: "2",
      label: `อาหารเอเชีย`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: "3",
      label: `อาหารหวาน`,
      children: `Content of Tab Pane 3`,
    },
  ];

  return (

    <Layout
      className="site-layout"
      style={{ marginLeft: 200, marginTop: "50px" }}
    >
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <div
          style={{
            padding: 24,
            textAlign: "center",
          }}
        >
          <Row style={{ width: "100%" }}>
            <Col span={24}>
          <Typography
            style={{
              fontSize: "46px",
              textAlign: "center",
              // margin: "30px 0px",
            }}
          >
            Food Menu
          </Typography>
        </Col>

            <Col span={24}>
              <Tabs
                defaultActiveKey="1"
                items={items}
                onChange={onChange}
                centered
              />
            </Col>
            <Row justify="center" style={{ width: "100%" }} gutter={16}>
              <Col span={8}>
                <Card
                  style={{ width: "100%" }}
                  cover={
                    <img
                      alt="example"
                      src="https://img.theculturetrip.com/1440x/smart/wp-content/uploads/2020/04/fkdbth.jpg"
                    />
                  }
                  actions={[
                    <Button style={{ borderColor: "tomato", color: "tomato" }}>
              
                      Add To Cart
                    </Button>,
                  ]}
                >
                  <Meta title="ต้มยำกุ้ง" description="ราคา 100" />
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  style={{  width: "100%" }}
                  cover={
                    <img
                      alt="example"
                      src="https://img.theculturetrip.com/1440x/smart/wp-content/uploads/2020/04/fkdbth.jpg"
                    />
                  }
                  actions={[
                    <Button style={{ borderColor: "tomato", color: "tomato" }}>
                      {" "}
                      Add To Cart
                    </Button>,
                  ]}
                >
                  <Meta title="ต้มยำกุ้ง" description="ราคา 100" />
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  style={{  width: "100%" }}
                  cover={
                    <img
                      alt="example"
                      src="https://img.theculturetrip.com/1440x/smart/wp-content/uploads/2020/04/fkdbth.jpg"
                    />
                  }
                  actions={[
                    <Button style={{ borderColor: "tomato", color: "tomato" }}>
                      {" "}
                      Add To Cart
                    </Button>,
                  ]}
                >
                  <Meta title="ต้มยำกุ้ง" description="ราคา 100" />
                </Card>
              </Col>
            </Row>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Food;
