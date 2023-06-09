import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const CreateFood = async (req: any, res: any) => {
  const user = JSON.parse(req?.cookies?.user);
  // const buffer = Buffer.from(req?.body?.image.replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", ""),"base64");
  // console.log('buffer',buffer)
  try {
    const result = await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}/food/create`,
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

export default CreateFood;
