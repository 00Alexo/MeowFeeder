const jwt = require('jsonwebtoken')
const User = require('../models/userModel');

const verifyAuth = async (req, res, next) => {
  const { authorization } = req.headers
  console.log('TEST', authorization)
  if (!authorization) {
    return res.status(401).json({error: 'You must be logged in!'})
  }

  const token = authorization.split(' ')[1]

  try {
    const { _id } = jwt.verify(token, process.env.SECRET)

    req.user = await User.findOne({ _id }).select('_id')
    next()

  } catch (error) {
    console.log(error)
    res.status(401).json({error: 'You must be logged in!'})
  }
}

module.exports = verifyAuth