import jwt from 'jsonwebtoken'
import "dotenv/config"

export const userAuthenticate = (req,res, next)=> {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //payload
        next();
    }
    catch(err){
        return res.status(401).json({message: "Unauthorized"})
    }
};


export const authoriseRoles = (roles) =>{
   return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: "Access denied: Admins only"});
        }
        next();
    }
}