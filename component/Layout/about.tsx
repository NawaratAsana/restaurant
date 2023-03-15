import { Col, Divider, Row, Typography } from "antd";
import React from "react";
import styled from "styled-components";

const About = () => {
  return (
    <Row justify={"space-around"} style={{ marginTop: "30px" }}>
      <Col span={10} >
        <img
          alt="ห้องอาหาร"
          src="../images/3.png"
          style={{ width: "100%", height: "100%" ,margin:'auto',display:'block'}}
        />
      </Col>
      <Col span={10}>
        <Divider style={{ fontSize: "40px" }}>About</Divider>
        <Typography style={{ fontSize: "24px" }}>
          ห้องอาหารบัวขาว เป็นห้องอาหารที่มีบรรยากาศสบายๆ
          และมีเมนูอาหารหลากหลายชนิด อาทิเช่น อาหารเอเชีย และอาหารไทย
          รวมถึงบุฟเฟ่ต์และอาหารจานเดียวก็มีให้ท่านเลือกสรรได้ตามใจชอบ
          เปิดตั้งแต่ 06.30-20.30 น.
        </Typography>
      </Col>
    </Row>
  );
};


export default About;
