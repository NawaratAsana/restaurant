import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const QueryDrink = async(req:any,res:any) => {
    console.log("data >>> ", req?.body)
    const user = JSON.parse(req?.cookies?.user);
    const result = await axios({
        method: 'get',
        url: `${process.env.NEXT_PUBLIC_API_URL}/drink`,
        headers: { 
            ' Authorization': `Bearer ${user.token}`,
            'x-access-token':`Bearer ${user.token}`,
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
        data: result?.data,
        
    })
    console.log('data',result?.data)
}

export default QueryDrink