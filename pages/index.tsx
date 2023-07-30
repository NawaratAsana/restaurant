import { Button, Divider, Layout, Row, Typography } from "antd";
import { useRouter } from "next/router";
import styled from "styled-components";

import HowItworks from "../component/Layout/howItworks";


interface Iprops {
  user: any;
}
export default function Home(userCookie: any) {
  const router = useRouter();
  return (
    <LayoutStyled>
    
        <ImageStyled
          src="../images/2022-06-24edit3.jpg"
          style={{ opacity: 0.93 }}
        />
        <Overlay>
          <HRHStyled>HRH Princess Valaya</HRHStyled>
          <Divider
            style={{
              height: "2px",
              backgroundColor: "#fff",
              margin: " 10px 0",
              border: 0,
            }}
          />
          <TypographyStyled>
            Princess Valaya ห้องอาหารบัวขาว จำหน่ายอาหาร รับทำอาหารกล่อง
            งานบุฟเฟต์ การจัดงานเลี้ยงสังสรรค์ งานแต่งงาน การประชุม อบรมสัมมนา
            ห้องพัก
          </TypographyStyled>
          <ButtonStyled onClick={() => router.push("/menu")}>
            Order Now
          </ButtonStyled>
        </Overlay>
            <HowItworks/>
   
    </LayoutStyled>
  );
}

const LayoutStyled = styled(Layout)`
  position: relative;
  text-align: center;
  background-color: #fff;

`;

const ImageStyled = styled.img`
  display: block;
  max-width: 100%;
  max-height: 100%;
`;
const Overlay = styled.div`
  position: absolute;
  top: 45%;
  left: 40%;
  transform: translate(-50%, -50%);
  text-align: left;
  padding: 20px;
  color: white;

  /* Adjust spacing between the image and the menu */
  @media (max-width: 768px) {
    padding: 10px;
    top: 50%;
    left: 50%;
  }

  @media (max-width: 480px) {
    padding: 5px;
    top: 60%;
    left: 50%;
  }
`;

const TypographyStyled = styled(Typography)`
  text-shadow: 2px 2px 5px #141414;
  font-size: 28px;
  color: white;
  font-weight: bold;

  /* Adjust font size for smaller screens */
  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const HRHStyled = styled(Typography)`
  text-shadow: 2px 2px 5px #141414;
  font-size: 60px;
  color: white;
  font-weight: bolder;

  /* Adjust font size for smaller screens */
  @media (max-width: 768px) {
    font-size: 40px;
  }

  @media (max-width: 480px) {
    font-size: 30px;
  }
`;

const ButtonStyled = styled(Button)`
  text-shadow: 2px 2px 5px #434343;
  background-color: #faad14;
  padding: 0px 50px;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  margin-top: 50px;
  width: 200px; /* Add the desired width */
  height: 50px; /* Add the desired height */
  box-shadow: 0px 4px 10px #1f1f1f; /* Add the box shadow */
`;

// export async function getServerSideProps(context: any) {
//   const userCookie = context.req?.cookies?.user
//     ? JSON.parse(context.req?.cookies?.user)
//     : null;

//   return {
//     props: {
//       userCookie: userCookie,
//     },
//   };
// }
