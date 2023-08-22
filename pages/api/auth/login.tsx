import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const login = async (req: any, res: any) => {
    try {
        const result = await axios({
            method: 'post',
            url: `${process.env.NEXT_PUBLIC_API_URL}/login`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                username: req?.body?.username,
                password: req?.body?.password
            }
        });

        res.status(200).json({
            success: true,
            data: result.data, // No need to parse again
        });
    } catch (error) {
        console.log("error:", error);
        res.status(500).json({
            success: false,
            data: {},
            message: "An error occurred",
        });
    }
};

export default login;
