import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const LoginEmployee = async(req:any,res:any) => {
    
    const result = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_API_URL}/login/employee`,
        headers: { 
            'Content-Type': 'application/json'
        },
       data: JSON.stringify({username: req?.body?.username, password: req?.body?.password})
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
        data: JSON.parse(result?.data),
    })
}

export default LoginEmployee
