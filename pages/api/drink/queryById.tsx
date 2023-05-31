import axios from "axios"
import dotenv from "dotenv"
// import cookies from "next-cookies";
dotenv.config()

const QueryDrinkID = async(req:any,res:any) => {
    const drink = JSON.parse(req?.cookies?.user)
    console.log("user >>> ", drink?.id)
    const result = await axios({
        method: 'get',
        url: `${process.env.BACK_END_URL}/drink/get/${drink?.id}`,
        headers: { 
            // 'Authorization': `Bearer ${employee.token}`,
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

export default QueryDrinkID