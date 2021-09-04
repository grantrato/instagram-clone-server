const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const { uploadImage } = require('../utils/storage')


require('dotenv').config({path: '.env'})

function createToken(user, SECRET_KEY, expiresIn) {
  const {id, name, email, username} = user
  const payload = {
    id,
    name,
    email,
    username
  }

  return jwt.sign(payload, SECRET_KEY, {expiresIn})

}


async function register(input) {
  const newUser = input
  newUser.username = newUser.username.toLowerCase()

  const {email, username, password} = newUser
  
  //Revisar si el email esta en uso
  const foundEmail = await User.findOne({email})
  if(foundEmail) throw new Error('El email ya está en uso')

  const foundUsername = await User.findOne({username})
  if(foundUsername) throw new Error('El nombre de usuario ya está en uso')

  //Encriptar contraseña
  const salt = bcryptjs.genSaltSync(10)
  newUser.password = await bcryptjs.hash(password, salt)

  try{
    const user = new User(newUser)
    user.save()
    return user

  }catch (error) {
    console.log(error)
  }


  return input
}

async function login(input) {
  const {email, password} = input

  const userFound = await User.findOne({email: email.toLowerCase()})
  if(!userFound) throw new Error('Contraseña y/o correo incorrectos')

  const passwordSucess = await bcryptjs.compare(password, userFound.password)
  if(!passwordSucess) throw new Error('Contraseña y/o correo incorrectos')

  const token = createToken(userFound, process.env.SECRET_KEY, '48h')

  return {
    ok: true,
    token
  }

}

async function getUser(id, username){
	let user = null;
	if(id) user = await User.findById(id);
	
	if(username) user = await User.findOne({username});
	
	if(!user) throw new Error('El usuario no existe')
	
	return user;
	
}


async function updateAvatar(avatar, ctx) {
  const { id } = ctx.user;

  await User.findByIdAndUpdate({_id: id}, {avatar})

	
	return {
    status: true,
    urlAvatar: avatar
  }
}

async function deleteAvatar(ctx) {
  const { id } = ctx.user;

  try {
    await User.findByIdAndUpdate({_id: id}, {avatar: ''})
    return true

  } catch(e) {
    return false
  }

}


async function updateUser(input, ctx) {
  const { id } = ctx.user

  try {

    // Change password
    if(input.currentPassword && input.newPassword) {

      const userFound = await User.findById(id);

      const passwordSuccess = await bcryptjs.compare(input.currentPassword, userFound.password);

      if(!passwordSuccess) throw new Error('Password is not correct')

      const salt = await bcryptjs.genSaltSync(10)
      const newPasswordCrypt = await bcryptjs.hash(input.newPassword. salt)

      await User.findByIdAndUpdate(id, { password: newPasswordCrypt })


    } else { // Change other any data
      console.log(input)
      await User.findByIdAndUpdate(id, input)
    }


  } catch (error) {
    return false
  }
}


async function search(search) {
  const users = await User.find({
    name: { $regex: search, $options: 'i'}
  })

  return users
}


module.exports = {
  register,
  login,
  getUser,
  updateAvatar,
  deleteAvatar,
  updateUser,
  search
}
