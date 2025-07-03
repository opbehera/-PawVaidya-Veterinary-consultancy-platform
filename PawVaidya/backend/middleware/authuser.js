import jwt from 'jsonwebtoken';

//user auth middleware
const authuser = async(req , res , next) => {
    try{
        const {token} = req.headers;
        if(!token){
            return res.json({
                success: false,
                message: "not authorized to login"
            })
        }
        const token_decode = jwt.verify(token,  process.env.JWT_SECRET)
        req.body.userId = token_decode.id 
        next()
    }catch(error){
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

export default authuser