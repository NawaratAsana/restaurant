import axios from "axios";
import dotenv from "dotenv";
// import cookies from "next-cookies";
dotenv.config();

const UpdateOrder = async (req: any, res: any) => {
  const user = JSON.parse(req?.cookies?.user);
  console.log("employee >>> ", req?.body?.order);
  const result = await axios({
    method: "post",
    url: `${process.env.NEXT_PUBLIC_API_URL}/order/update/${req?.body?.order?.id}`,
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'x-access-token':`Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
    data: {
      total_amount: req?.body?.order?.total_amount,
      order_date: req?.body?.order?.order_date,
      member_id: req?.body?.order?.member_id,
      employee_id: req?.body?.order?.order?.employee_id,
      delivery_type: req?.body?.order?.delivery_type,
       status: req?.body?.order?.status,
       foods: req?.body?.order?.foods,
       drinks: req?.body?.order?.drinks,
       delivery_location: req?.body?.order?.delivery_location,
       cancellation_reason:req?.body?.order?.cancellation_reason
     
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

export default UpdateOrder;
