import Joi from "joi"



const registerSchema = Joi.object({
    email: Joi.string().email({ tlds: false }).messages({ "string.empty": "email is required" }),
    firstName: Joi.string().required().pattern(/^[0-9a-zA-Z]{2,}$/).messages({
        "string.empty": "firstName is required",
        "string.pattern.base": "firstName must contain a-z A-Z 0-9 and must be at lease 2 characters.!!!"
    }),
    lastName: Joi.string().required().pattern(/^[0-9a-zA-Z]{2,}$/).messages({
        "string.empty": "lastName is required",
        "string.pattern.base": "lastName must contain a-z A-Z 0-9 and must be at lease 2 characters.!!!"
    }),
    password: Joi.string().required().pattern(/^[0-9a-zA-Z]{6,}$/).messages({
        "string.empty": "Password is required",
        "string.pattern.base": "Password must contain a-z A-Z 0-9 and must be at lease 6 characters.!!!"
    }),

    confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
        "string.empty": "Confirm Password is required!!!",
        "any.only": "Password and Confirm Password is not match!!!"
    })

})

const validateRegister = (input) => {
    const { error } = registerSchema.validate(input, {
        abortEarly: false
    })
    //ถ้ามี error
    // console.log(error.details)
    if (error) {
        const formatError = error.details.reduce((prev, curr) => {

            //code
            // console.log(curr.path[0])
            // console.log(curr.message)
            prev[curr.path[0]] = curr.message

            return prev

        }, {})

        return formatError
    }
    return null

}

export default validateRegister








const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: false }).messages({ "string.empty": "email is required" }),
    password: Joi.string().required().pattern(/^[0-9a-zA-Z]{6,}$/).messages({
        "string.empty": "Password is required",
        "string.pattern.base": "Password must contain a-z A-Z 0-9 and must be at lease 6 characters.!!!"
    }),
})


export const validateLogin = (input) => {
    const { error } = loginSchema.validate(input, {
        abortEarly: false
    })

    if (error) {
        const formatError = error.details.reduce((prev, curr) => {


            prev[curr.path[0]] = curr.message

            return prev

        }, {})

        return formatError
    }
    return null


}









