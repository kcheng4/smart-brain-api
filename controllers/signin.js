const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            return user[0];
          })
          .catch(err => Promise.reject('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => Promise.reject('wrong credentials'))
}

const createSessions = (user) => {
  console.log(user);
  const {email, id, name, entries} = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(()=>{return{success:'true', userId: id, token, name, entries}})
    .catch((error)=>console.log(error));
}

const signToken = (email) => {
  const jwtPayload = {email};
  return jwt.sign(jwtPayload, 'secret', {expiresIn: '2 days'});
}

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id));
}

const getAuthTokenId = (req, res) => {
  const {authorization} = req.headers;
  return redisClient.get(authorization, (error, reply)=>{
    if (error || !reply){
      return res.status(400).json('Unauthorized');
    }
    return res.json({id:reply});
  })
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const {authorization} = req.headers;
  return authorization ? 
  getAuthTokenId(req, res) : 
  handleSignin(db, bcrypt, req, res)
  .then(data => {
    return data.id && data.email ? createSessions(data) : Promise.reject(data);
  })
  .then(session => {
    res.json(session);
  })
  .catch(err =>{
    res.status(400).json(err);
  });
}
module.exports = {
  signinAuthentication,
  redisClient
}