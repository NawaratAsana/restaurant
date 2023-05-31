import axios from "axios"
import dotenv from "dotenv"
// import cookies from "next-cookies";
dotenv.config()

const QueryFoodImageID = async(req:any,res:any) => {
    const user = JSON.parse(req?.cookies?.user)
    const food = JSON.parse(req?.cookies?.user)
    console.log("user >>> ", food?.id)
    const result = await axios({
        method: 'get',
        url: `${process.env.NEXT_PUBLIC_API_URL}/food/image/${food?.image}`,
        headers: { 
            'Authorization': `Bearer ${user.token}`,
            'x-access-token':`Bearer ${user.token}`,
            'Content-Type': 'application/json'
        },
        // data: req?.body
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
        data: result?.data?.result,
    })
}

export default QueryFoodImageID