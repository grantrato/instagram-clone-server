const firebase = require('./firebase')



function uploadImage(file, filename, type) {



  console.log("1asddassda")
  const storageRef = firebase.storage().ref(`${type}/${filename}`)

  console.log("1asddassda1")

  const task = storageRef.put(file);

  console.log("2asddassda")

  console.log(file)

  console.log("3asddassda")



}

module.exports = {
  uploadImage
}