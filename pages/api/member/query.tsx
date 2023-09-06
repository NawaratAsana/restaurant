import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const QueryMember = async (req: any, res: any) => {
  const user = JSON.parse(req?.cookies?.user);
  console.log("data >>> ", req?.body);
  const result = await axios({
    method: "get",
    url: `http://localhost:9000/member`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      "x-access-token": `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
    data: req?.body,
  

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
    data: result?.data,
  });
  
};

export default QueryMember;
