const jwt = require("jsonwebtoken");
const User = require("../models/users.models");
const connection = require("../db");

const verifyJWT = async function (req, res, next) {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  const token = authorization.substring(13);

  try {
    const { _id, email, firstName } = jwt.verify(token, process.env.SECRET)
    // console.log(_id);

    const selectUserByIdQuery = 'SELECT * FROM User WHERE id = ?';
    const [userByIdRows] = await connection.execute(selectUserByIdQuery, [_id]);

    const userById = userByIdRows[0];
    // console.log(userById);
    
    // console.log(req);
    req.user = {};
    req.user._id = userById.id;
    req.user.email = userById.email;
    req.user.firstName = userById.firstName;

    next()

  } catch (error) {
    res.status(401).json({ error: 'Request is not authorized' })
  }
}

module.exports = { verifyJWT }
