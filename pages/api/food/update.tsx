import axios from "axios";
import dotenv from "dotenv";
// import cookies from "next-cookies";
dotenv.config();

const UpdateFood = async (req: any, res: any) => {
  const user = JSON.parse(req?.cookies?.user);
  console.log("employee >>> ", req?.body);
  const result = await axios({
    method: "post",
    url: `${process.env.NEXT_PUBLIC_API_URL}/food/update/${req?.body?.id}`,
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
    data: {
      food: req.body.food,
      photo: req.body.photo,
      price: req.body.price,
      typeFood_id: req.body.typeFood_id,
    },
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

export default UpdateFood;
