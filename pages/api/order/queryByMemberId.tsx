import axios from "axios"
import dotenv from "dotenv"
// import cookies from "next-cookies";
dotenv.config()

const QueryByMemberID = async(req:any,res:any) => {
    const user = JSON.parse(req?.cookies?.user)
    console.log("user >>> ", user?.id)
    const result = await axios({
        method: 'get',
        url: `${process.env.NEXT_PUBLIC_API_URL}/order/searchOrdersByMemberId/${user?.id}`,
        headers: {
            "x-access-token": `Bearer ${user.token}`,
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        },

    }).catch((err) => {
        console.log("error :", err)
        res.status(500).json({
            success: false,
            data: {},
            message: err
        })
    })
    res.status(200).json({
        success: true,
        data: result?.data
    })
    console.log("result",result?.data?.combinedOrders)
}

export default QueryByMemberID