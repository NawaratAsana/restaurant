import axios from "axios";
import dotenv from "dotenv";
// import cookies from "next-cookies";
dotenv.config();

const UpdatePayment = async (req: any, res: any) => {
  const user = JSON.parse(req?.cookies?.user);
  console.log("employee >>> ", req?.body);
  const result = await axios({
    method: "post",
    url: `${process.env.NEXT_PUBLIC_API_URL}/payment/update`,
    headers: {
      ' Authorization': `Bearer ${user.token}`,
      'x-access-token':`Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
    data: {
      order_id:req?.body?.order_id,
      payment_status:req?.body?.payment_status,
      image:req?.body?.image
     
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

export default UpdatePayment;
