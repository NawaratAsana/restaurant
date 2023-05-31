import axios from "axios"
import dotenv from "dotenv"
// import cookies from "next-cookies";
dotenv.config()

const QueryTypeFood = async(req:any,res:any) => {
    // const user = JSON.parse(req?.cookies?.user)
    console.log("user >>> ", req?.body)
    const result = await axios({
        method: 'get',
        url: `http://localhost:9000/typeFood`,
        headers: { 
            // 'Authorization': `Bearer ${user.token}`,
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
    // console.log('position>>>>.',result?.data)

}

export default QueryTypeFood