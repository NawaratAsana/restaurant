import axios from "axios";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

const AddFoodWithoutImage = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const user = JSON.parse(req?.cookies?.user as string);

  try {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/food/addFoodWithoutImage`,
        {
          name: req.body.name,
          price: req.body.price,
          typeFood_id: req.body.typeFood_id,
        },
        {
          headers: {
            "x-access-token": `Bearer ${user.token}`,
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((result) => {
        res.status(200).json({
          success: true,
          data: result?.data?.result,
        });
      })
      .catch((error) => {
        console.error("Error creating food item", error);
        res.status(500).json({
          success: false,
          data: {},
          message: "An error occurred while creating the food item",
        });
      });
  } catch (error) {
    console.error("Error creating food item", error);
    res.status(500).json({
      success: false,
      data: {},
      message: "An error occurred while creating the food item",
    });
  }
};

export default AddFoodWithoutImage;
