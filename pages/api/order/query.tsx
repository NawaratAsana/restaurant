import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const QueryOrder = async (req: any, res: any) => {
  const user = JSON.parse(req?.cookies?.user);
  console.log("data >>> ", req?.body);
  try {
    const result = await axios({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/orderHistory`,
      headers: {
       ' Authorization': `Bearer ${user.token}`,
       'x-access-token':`Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      data: req?.body,
    });

    res.status(200).json({
      success: true,
      data: result?.data,
    });
    console.log("data", result?.data);
  } catch (err) {
    console.log("error :", err)
    res.status(500).json({
        success: false,
        data: {},
        message: err
    })
  }
};

export default QueryOrder;
