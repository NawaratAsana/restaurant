import axios from "axios"
import dotenv from "dotenv"
// import cookies from "next-cookies";
dotenv.config()

const UpdateEmployee = async(req:any,res:any) => {
    const user = JSON.parse(req?.cookies?.user)
    console.log("employee >>> ", req?.body)
    const result = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_API_URL}/employee/update/${req?.body?.id}`,
        headers: { 
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        },
        data: {
            employeeID: req?.body?.employeeID,
            name: req?.body?.name,
            lname: req?.body?.lname,
            gender: req?.body?.gender,
            birthday: req?.birthday,
            age: req?.body?.age,
            email: req?.body?.email,
            phone: req?.body?.phone,
            address: req?.body?.address,
            photo: req?.body?.photo,
            username: req?.body?.username,
            password: req?.body?.password,
            position_id: req?.body?.position_id,
            active:req?.body?.active,
            role:req?.body?.role,
        }
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

export default UpdateEmployee