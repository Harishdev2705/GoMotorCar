const service = require("../../services/mongodb.services");
const { SuccessResponse } = require("../../utility/apiResponse");
const { BadRequest } = require("../../utility/apiError");
const { Policy } = require("../../models/index");
const messages = require("../../utility/message");


/**
 * @description - This function is used for Create Policy and Term
 */
const createPolicyTerms = async (req, res, next) => {
    try {
      let { content, type } = req.body;
      
      let checkPolicyTerms = await service.findOneForAwait(Policy,{ type, isDeleted: false },{});
      if (checkPolicyTerms) {
        await service.findOneAndUpdateForAwait(
          Policy,
          { type: type },
          { content }
        );
        return new SuccessResponse(messages.success.updatePolicyTerm).send(res);
      }else{
        let addClientReview = await new Policy({ type, content });
        await service.createForAwait(addClientReview); 
        return new SuccessResponse(messages.success.created).send(res);
      }
    } catch (error) {
      throw new BadRequest(error.message);
    }
  };

/**
 * @description - This function is used for get Policy and Terms
 */
const getPolicyTerms = async (req, res, next) => {
  try {
    const type = req.params.type
    let checkPolicy = await service.findOneForAwait(Policy,{ type: type, isDeleted: false },{});
    if (!checkPolicy) throw new BadRequest(messages.error.noFoundPolicy);

    return new SuccessResponse(messages.success.fetchsucess, {
      data: checkPolicy
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};



module.exports = {
  createPolicyTerms,
  getPolicyTerms
}