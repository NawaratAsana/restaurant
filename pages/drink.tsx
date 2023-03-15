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

const Drink = () => {
  const { Meta } = Card;
  const onChange = (key: string) => {
    console.log(key);
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `ชา`,
      children: `Content of Tab Pane 1`,
    },
    {
      key: "2",
      label: `กาแฟ`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: "3",
      label: `น้ำสมุนไพร`,
      children: `Content of Tab Pane 3`,
    },
  ];
  return (
    <Layout
      className="site-layout"
      style={{ marginLeft: 200, }}
    >
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <div
          style={{
            padding: 24,
            textAlign: "center",
          }}
        >
          <Col span={24}>
            <Typography
              style={{
                fontSize: "46px",
                textAlign: "center",
                // margin: "30px 0px",
              }}
            >
              Beverage Menu
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
          <Row justify="center" style={{ width: "100%" }}>
            <Col span={8}>
              <Card
                style={{ width: 300, height: "200px" }}
                cover={
                  <img
                    alt="example"
                    src="https://sites.google.com/site/peannapa01/_/rsrc/1513001163084/na-smunphir-tang/na-xaychan-manaw/%E0%B8%AD%E0%B8%B1%E0%B8%8D%E0%B8%8A%E0%B8%B1%E0%B8%99.jpg"
                  />
                }
                actions={[
                  <Button style={{ borderColor: "tomato", color: "tomato" }}>
                    {" "}
                    Add To Cart
                  </Button>,
                ]}
              >
                <Meta title="น้ำอัญชันมะนาว" description="ราคา 30" />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                style={{ width: 300 }}
                cover={
                  <img
                    alt="example"
                    src="data:image/jpeg;base64,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"
                  />
                }
                actions={[
                  <Button style={{ borderColor: "tomato", color: "tomato" }}>
                    {" "}
                    Add To Cart
                  </Button>,
                ]}
              >
                <Meta title="น้ำมะตูม" description="ราคา 30" />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                style={{ width: 300, height: "200px" }}
                cover={
                  <img
                    alt="example"
                    src="data:image/jpeg;base64,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"
                  />
                }
                actions={[
                  <Button style={{ borderColor: "tomato", color: "tomato" }}>
                    {" "}
                    Add To Cart
                  </Button>,
                ]}
              >
                <Meta title="ชามะนาว" description="ราคา 30" />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Drink;
