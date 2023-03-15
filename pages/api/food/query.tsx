import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const QueryFood = async(req:any,res:any) => {
    const user = JSON.parse(req?.cookies?.user)
    const url = `${process.env.BACK_END_URL}/food?query`
    const result = await axios({
        method: 'get',
        url: encodeURI(url),
        headers: { 
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        },
        data: req?.body
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
 

export default QueryFood
