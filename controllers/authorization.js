const redisClient = require('./signin').redisClient;


const requireAuth = (req, res, next) => {
    console.log(req.headers);
    const {authorization} = req.headers;
    console.log(authorization);
    if (!authorization){
        return res.status(401).json('1.Unauthorized');
    }
    return redisClient.get(authorization,(err, reply)=>{
        if (err || !reply){
            return res.status(400).json('2.Unauthorized');
        }
        return next();
    })
}

module.exports={
    requireAuth
}