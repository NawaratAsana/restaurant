import { Button, Col, Divider, Row, Typography } from "antd";
import Layout, { Footer } from "antd/lib/layout/layout";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const HowItworks = () => {
  const router = useRouter();
  return (
    < >
      <Row justify={"center"} style={{ marginTop: 30, marginBottom: 100 }}>
        <Col span={24}>
          <Typography
            style={{ fontSize: 30, fontWeight: "bold", textAlign: "center" }}
          >
            How It Works?
          </Typography>
        </Col>
        <Row justify={"center"} gutter={[24, 0]} style={{ marginTop: 50 }}>
          <Col span={8}>
            <img src="../images/menu_1046849.png" width={50} height={50} />
            <TypographyStyled>
              ลงชื่อเข้าใช้ & สั่งอาหารจากรายการอาหาร
            </TypographyStyled>
          </Col>
          <Col span={8}>
            <img src="../images/motorbike_3066399.png" width={50} height={50} />
            <TypographyStyled>จัดส่งอาหารถึงมือคุณ</TypographyStyled>
          </Col>
          <Col span={8}>
            <img
              src="../images/vegetarian_5635363.png"
              width={50}
              height={50}
            />
            <TypographyStyled>เพลิดเพลินกับอาหารของเรา</TypographyStyled>
          </Col>
          <ButtonStyled onClick={() => router.push("/menu")}>
            Order Now
          </ButtonStyled>
        </Row>
      </Row>
      <Row justify={"space-around"} align={"middle"} >
        <Col span={10}>
          <img
            alt="ห้องอาหาร"
            src="../images/3.png"
            style={{
              width: "50%",
              height: "100%",
              margin: "auto",
              display: "block",
            }}
          />
        </Col>
        <Col span={10}>
        
        <Typography style={{ fontSize: "24px" }}>
            🛵 เวลาจัดส่ง Delevery ⏰ 10.00-17.00น 
            
          </Typography>
          <Typography style={{ fontSize: "24px" }}>
            
            👉 ค่าบริการส่งเพียง 20บาท/บิล 
          
          </Typography>
          
          <Typography style={{ fontSize: "24px" }}>
           
            ☎️ 02-9091100, 087-0449032
          </Typography>
        </Col>
      </Row>
      <FooterStyled style={{ textAlign: "center", marginTop: "20px" }}>
          H.R.H. Princess Valaya Building
        </FooterStyled>
    </>
  );
};

const ButtonStyled = styled(Button)`
  text-shadow: 2px 2px 5px #434343;
  background-color: #faad14;
  padding: 0px 50px;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;

  margin-top: 50px;
  width: 200px; /* Add the desired width */
  height: 50px; /* Add the desired height */
  // box-shadow: 0px 4px 10px #1f1f1f; /* Add the box shadow */
`;
const TypographyStyled = styled(Typography)`
  font-size: 20px;
  margin-top: 30px;
`;
const FooterStyled = styled(Footer)`
  // position: absolute;
  // bottom: 0;
  width: 100%;
  text-align: center;
  margin-top: 20px;
`;
export default HowItworks;
