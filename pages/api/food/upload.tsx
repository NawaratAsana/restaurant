import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const UploadImage = async (req: any, res: any) => {
  const user = JSON.parse(req?.cookies?.user);
  
  try {
    const result = await axios({
      method: "post",
      url: `http://localhost:9000/upload`,
      headers: {
        "x-access-token": `Bearer ${user.token}`,
       " Authorization": `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      data: req?.body,
    });

    res.status(200).json({
      success: true,
      data: result?.data?.result,
    });
  } catch (err) {
    console.log("error:", err);
    return res.status(500).json({
      success: false,
      data: {},
      message: err,
    });
  }
};

export default UploadImage;
