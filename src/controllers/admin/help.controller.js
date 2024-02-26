const service = require("../../services/mongodb.services");
const { SuccessResponse } = require("../../utility/apiResponse");
const { BadRequest } = require("../../utility/apiError");
const { Help } = require("../../models/index");
const messages = require("../../utility/message");


/**
 * @description - This function is used for Create Policy and Term
 */
const createHelp = async (req, res, next) => {
    try {
      let { question, answer, type } = req.body;
        let addHelp = await new Help({ type, question, answer});
        await service.createForAwait(addHelp); 
        return new SuccessResponse(messages.success.created).send(res);

    } catch (error) {
      throw new BadRequest(error.message);
    }
  };

/**
 * @description - This function is used for get Policy and Terms
 */
const getallHelp = async (req, res, next) => {
  try {
    const type = req.params.type
    let checkPolicy = await service.findManyForAwait(Help,{ type: type, isDeleted: false },{});
    if (!checkPolicy) throw new BadRequest(messages.error.noFoundHelp);

    return new SuccessResponse(messages.success.fetchsucess, {
      data: checkPolicy
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * Get Helps Details through id
 *
 */
const gethelpDetails = async (req, res, next) => {
    const { id } = req.params
    try {
        let helps = await service.findManyForAwait(Help, { _id: id }, {},{});
        if (!helps) {
            throw new BadRequest(messages.error.noFoundHelp);
        }
        return new SuccessResponse(messages.success.getQuery, helps).send(res);
    } catch (error) {
        throw new BadRequest(error.message)
    }
};

/**
 * @description - This function is used for update card details
 */

const updateHelp = async (req, res, next) => {
    try {
      let {question, answer, id } = req.body;
     
      let checkHelp = await service.findOneForAwait(Help,{ _id: id, isDeleted: false },{});
      if (!checkHelp) throw new BadRequest(messages.error.noFoundPlan);
  
      await service.findOneAndUpdateForAwait(
        Help,
        { _id: id },
        { question,answer }
      );
      return new SuccessResponse(messages.success.updatePlan).send(res);
    } catch (error) {
      throw new BadRequest(error.message);
    }
  };
  
  const deleteHelp = async (req, res, next) => {
    try {
      let {id } = req.body;
     
      let checkHelp = await service.findOneForAwait(Help,{ _id: id, isDeleted: false },{});
      if (!checkHelp) throw new BadRequest(messages.error.noFoundPlan);
  
      await service.findOneAndUpdateForAwait(
        Help,
        { _id: id },
        { isDeleted: true }
      );
      return new SuccessResponse(messages.success.deletesucess).send(res);
    } catch (error) {
      throw new BadRequest(error.message);
    }
  };
/**
 * @description - This function is used for get Help Center
 */
// const getHelp = async (req, res, next) => {
//     try {
  
//         let checkQuery = await service.findManyForAwait(Help,{},{});
//         if (!checkQuery) throw new BadRequest(messages.error.noFoundHelp);
//       return new SuccessResponse(messages.success.getQuery, {
//         helps: checkQuery
//       }).send(res);
//     } catch (error) {
//       throw new BadRequest(error.message);
//     }
//   };


module.exports = {
  createHelp,
  gethelpDetails,
  getallHelp,
  updateHelp,
  deleteHelp
}