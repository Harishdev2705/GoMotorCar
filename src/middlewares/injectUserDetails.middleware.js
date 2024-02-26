const Users = require("../models/user.model");
const Vender = require("../models/vender.model");
const { ObjectId } = require("mongoose").Types;

const getUserById = async (decode) => {
  let user;
  if(decode.role=="vender"||decode.role=="subvender")
  {
   user = await Vender.findById(decode.id);
  }else{
   user = await Users.findOne(
    {
      _id: decode.id,
      email: decode.email,
      role: decode.role,
    },
  );
  }
  if (!user) {
    throw new Error("No user found");
  }
  return user;
};

const injectUserDetails = async (req, res, next) => {
  try {
    let user = await getUserById(req.decoded);
    req.user = user;
    next();
  } catch (error) {
    logger.error(error);
    return res.status(400).send({
      status: "BadRequest",
      statusCode: 400,
      message: error.message,
    });
  }
};

module.exports = {
  injectUserDetails,
};
