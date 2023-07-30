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
        🛵 เวลาจัดส่ง Delevery ⏰ 10.00-17.00น 
👉 ค่าบริการส่งเพียง 20 บาท/บิล
☎️ 02-9091100, 087-0449032
        </Typography>
      </Col>
    </Row>
  );
};


export default About;
