import { UserRole } from "@models/User.model"
import ApiError from "@utils/ApiError";
import logger from "@utils/logger";
import { NextFunction,Request,Response } from "express"

export const validateUserRole = (role: UserRole) => {
    return (req:Request,_res:Response,next:NextFunction)=>{
        logger.info(`Validating user role: ${req.user?.role} for role: ${role}`);
        if(req.user?.role !== role){
            return next(ApiError.unauthorized("You are not authorized to access this resource"));
        }
        next();
    }
}