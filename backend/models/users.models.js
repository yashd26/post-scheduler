const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const connection = require("../db")

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validateEmail
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: validatePassword
    }
  },
  firstName: {
    type: String,
    required: true,
    maxLength: 30,
    validate: {
      validator: validateName
    }
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 30,
    validate: {
      validator: validateName
    }
  },
  notifyUser: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

async function validateEmail(value) {
  console.log(value);
  if (!value) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(value)) {
    throw Error('Email not valid')
  }
}

async function validatePassword(value) {
  console.log(value);
  if (!value) {
    throw Error('All fields must be filled')
  }
  if (!validator.isStrongPassword(value)) {
    throw Error('Password not strong enough')
  }
}

async function validateName(value) {
  console.log(value);
  if (!value) {
    throw Error('All fields must be filled')
  }
}

// static signup method
userSchema.statics.signup = async function (email, password, firstName, lastName) {

  const selectUserQuery = 'SELECT * FROM User WHERE email = ?';
  const [rows] = await connection.execute(selectUserQuery, [email]);

  if (rows.length > 0) {
    throw new Error('Email already in use');
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const insertUserQuery = 'INSERT INTO User (email, password, firstName, lastName) VALUES (?, ?, ?, ?)';
  const [userId] = await connection.execute(insertUserQuery, [email, hash, firstName, lastName]);
  const insertedId = userId.insertId;

  const selectQuery = 'SELECT * FROM User WHERE id = ?';
  const [userRows] = await connection.execute(selectQuery, [insertedId]);

  const insertedUser = userRows[0];

  return insertedUser;
}

// static login method
userSchema.statics.login = async function (email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  // const user = await this.findOne({ email })
  const selectUserQuery = 'SELECT * FROM User WHERE email = ?';
  const [rows] = await connection.execute(selectUserQuery, [email]);

  const user = rows[0];

  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user;
}

const User = mongoose.model('User', userSchema);

module.exports = User;