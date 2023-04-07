import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const logout = async(req:any,res:any) => {
    
    const result = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        headers: { 
            'Content-Type': 'application/json'
        },
       data: req.body
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

export default logout

