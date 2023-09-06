import axios from "axios";
import dotenv from "dotenv";
// import cookies from "next-cookies";
dotenv.config();

const UpdateOederEmp = async (req: any, res: any) => {
  const user = JSON.parse(req?.cookies?.user);
  console.log("employee >>>> ", req?.body);
  const result = await axios({
    method: "post",
    url: `${process.env.NEXT_PUBLIC_API_URL}/order/update/${req?.body?.id}`,
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'x-access-token':`Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
    data: {
      total_amount: req?.body?.total_amount,
      order_date: req?.body?.order_date,
      member_id: req?.body?.member_id,
      employee_id: req?.body?.order?.employee_id,
      delivery_type: req?.body?.delivery_type,
       status: req?.body?.status,
       foods: req?.body?.foods,
       drinks: req?.body?.drinks,
       delivery_location: req?.body?.delivery_location,
       cancellation_reason:req?.body?.cancellation_reason
     
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

export default UpdateOederEmp;
