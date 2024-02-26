const asyncHandler=execution=>(req,res,next)=>{
    execution(req, res, next).catch(next);
}

module.exports=asyncHandler