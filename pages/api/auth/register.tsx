import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const register = async (req: any, res: any) => {
//   const member = JSON.parse(req?.cookies?.member);
  // console.log("user >>> ", req)
  const result = await axios({
    method: "post",
    url: `${process.env.NEXT_PUBLIC_API_URL}/register`,
    headers: {
    //   Authorization: `Bearer ${member.token}`,
      "Content-Type": "application/json",
    },
    data: req?.body,
    maxBodyLength: Infinity,
  }).catch((err) => {
    console.log("error :", err);
    res.status(500).json({
      success: false,
      data: {},
      message: err,
    });
  });
  res.status(200).json({
    success: true,
    data: result?.data?.result,
  });
};

export default register;
