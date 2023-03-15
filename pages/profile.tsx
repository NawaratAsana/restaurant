import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Image,
  Row,
  Space,
  Typography,
} from "antd";
import React from "react";
import styled from "styled-components";

const profile = () => {
  return (
    <Row
      justify="center"
      style={{ width: "100%" }}
      className="space-align-container"
    >
      <Row style={{ padding: "0px 80px " }} className="space-align-block">
        <Row>
          <Typography style={{ fontSize: "50px", margin: "20px 0px" }}>
            ประวัติส่วนตัว
          </Typography>
        </Row>
        <Row style={{ width: "100%", marginTop: "20px" }}>
        
            <Col span={2}>
              <Avatar
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                src={<Image src="../images/me.jpg" />}
              />
            </Col>
            <Col span={16}>
              <Typography
                style={{
                  fontSize: "30px",
                  padding: "15px 0px",
                  fontWeight: "lighter",
                  marginLeft: "20px",
                }}
              >
                Nawarat Asana
              </Typography>
            </Col> 

            <Col span={6}>
              <Button
                type="default"
                style={{
                  float: "right",
                  margin: "25px",
                  fontSize: "20px",
                  borderRadius: "20px",
                  color: "#A3BB98",
                  borderColor: "#A3BB98",
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
        >
         
        </Row>
      </Row>
    </Row>
  );
};


export default profile;

