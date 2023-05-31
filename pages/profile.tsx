import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Image,
  Layout,
  Row,
  Space,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

interface IProps {
  user: any;

}
const profile = (props:IProps) => {
  const router = useRouter();

  console.log("userIProps", props?.user)
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
            <Col>
              <Col style={{ textAlign: "left" }}>
                <Title> ประวัติส่วนตัว</Title>
              </Col>
            </Col>
            <Row style={{ width: "100%", marginTop: "20px" }}>
              <Col span={2}>
                <Avatar
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                  src={<Image src="../images/me.jpg" />}
                />
              </Col>
              <Col span={16}>
                <Typography style={{ fontWeight: "bold" }}>
                  {props?.user?.name}
                </Typography>
              </Col>

              <Col span={6}>
                <Button
                  type="primary"
                  style={{
                    float: "right",
                    margin: "25px",
                    fontSize: "20px",
                    borderRadius: "20px",
                    // background: "transparent linear-gradient(62deg, #00369e 0%, #005cfd 53%, #a18dff 100%) 0% 0% no-repeat padding-box",
                    lineHeight: "1",
                  }}
                >
                  แก้ไขข้อมูลส่วนตัว
                </Button>
              </Col>
            </Row>
            <Row
              style={{
                width: "100%",
                margin: "50px 80px",
                backgroundColor: "#fbfbfb",
                justifyContent: "center",
                borderRadius: "20px",
                padding: "10px",
              }}
            ></Row>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default profile;
