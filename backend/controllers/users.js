let User = require('../models/users.models');
const jwt = require('jsonwebtoken');
const connection = require("../db")

const createToken = (_id, email, firstName) => {
  return jwt.sign({ _id, email, firstName }, process.env.SECRET, { expiresIn: '3d' })
}

const getUser = async function (req, res) {
  try {
    const id = +req.params.id;
    console.log(id);
    // const user = await User.findById(id);

    const selectUserQuery = 'SELECT * FROM User WHERE id = ?';
    const [rows] = await connection.execute(selectUserQuery, [id]);
    const user = rows[0];
    console.log(user);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const login = async function (req, res) {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user.id, user.email, user.firstName)

    res.status(200).json({ email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const signUp = async function (req, res) {
  const { email, password, firstName, lastName } = req.body

  try {
    const user = await User.signup(email, password, firstName, lastName)

    // create a token
    const token = createToken(user.id, user.email, user.firstName)

    res.status(200).json({ email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { login, signUp, getUser };
