import {
  Avatar,
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Layout,
  Row,
  Typography,
} from "antd";
import { Footer, Header } from "antd/lib/layout/layout";
import styled from "styled-components";
import Link from "next/link";
import { useState } from "react";
import loginModal from "../component/Layout/Login/loginModal";
import payModal from "../component/Layout/Pay/payModal";
import { UserOutlined } from "@ant-design/icons";
import orderModal from "../component/Layout/Order/orderModal";
import About from "../component/Layout/about";

export default function Home() {

  const { Meta } = Card;
  return (
   
    <Row >
  
      {/* <Carousel autoplay>
        <div>
          <img
            style={{ width: "100%", height: "500px" }}
            src="../images/119215314_1587608851412230_5243429861827458305_n.jpg"
          />
        </div>
        <div>
          <img
            style={{ width: "100%", height: "500px" }}
            src="../images/119638010_1587608838078898_1189823384217180633_n.jpg"
          />
        </div>
        <div>
          <img
            style={{ width: "1600px", height: "500px" }}
            src="../images/Buakhao.jpg"
          />
        </div>
      </Carousel>

      <Divider style={{ fontSize: "40px" }}>Recommended Menu</Divider>
      <Row  justify="space-around" style={{ marginTop: "30px" }}>
        <Col span={6}>
          <Card
            hoverable
            style={{ width: 350 }}
            cover={
              <ImgStyle
                alt="example"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX2FVLyYmJTfdNUzun6pD6otZFASZ_PTsg0A&usqp=CAU"
              />
            }
          >
            <Meta title="ข้าวผัด" description="50 บาท" />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            style={{ width: 350, height: 350 }}
            cover={
              <ImgStyle
                alt="ผัดสะตอ"
                src="https://www.swedishnomad.com/wp-content/images/2019/09/Pad-Sataw.jpg"
              />
            }
          >
            <Meta title="ผัดสะตอ" description="100 บาท" />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            style={{ width: 350, height: 350 }}
            cover={
              <ImgStyle
                alt="ผัดกระเพรา"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbU9B2ZwT9GWs_0uhj1EQnXTnEgH6ls3KzMA&usqp=CAU"
              />
            }
          >
            <Meta title="ข้าวผัดกระเพรา" description="60 บาท" />
          </Card>
        </Col>
      </Row>
    
        <About/>
 
      <Footer style={{ textAlign: "center", marginTop: "20px" }}>
        H.R.H. Princess Valaya Building
      </Footer> */}

     
    </Row>
  );
}


const CardStyle = styled(Card)`
  .ant-card {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: "tnum", "tnum";
    position: relative;
    background: #fff;
    border-radius: 10px;
  }
`;
const ImgStyle = styled.img`
  width: 350px;
  height: 350px;
`;
const DividerStyle = styled(Divider)`
  margin-top: 30px;
  .ant-divider-horizontal.ant-divider-with-text {
    display: flex;
    margin: 36px 0;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 36px;
    white-space: nowrap;
    text-align: center;
    border-top: 0;
    border-top-color: rgba(0, 0, 0, 0.06);
  }
`;
