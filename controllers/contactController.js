
const nodemailer = require("nodemailer")


const sanitizeHtml = require("sanitize-html")
const { ObjectId } = require("mongodb")
const petsCollection = require("../db").db().collection("pets")

const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {}
}

exports.submitContact = async function (req, res) {
  if (req.body.secret.toUpperCase() !== "PUPPY") {
    console.log("spam detected")
    return res.json({ message: "Sorry!" })
  }



  if (!ObjectId.isValid(req.body.petId)) {
    console.log("invalid id detected")
    return res.json({ message: "Sorry!" })

  }

  const doesPetExist = await petsCollection.findOne({ _id: new ObjectId(req.body.petId) })

  if (!doesPetExist) {
    console.log("pet does not exist")
    return res.json({ message: "Sorry!" })

  }
  const ourObject = {
    name: sanitizeHtml(req.body.name, sanitizeOptions),
    email: sanitizeHtml(req.body.email, sanitizeOptions),
    comment: sanitizeHtml(req.body.comment, sanitizeOptions),
  }

  console.log(ourObject)

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAPUSERNAME,
      pass: process.env.MAILTRAPPASSWORD
    }
  })

  transport.sendMail({
    to: "hello@gmail.com",
    from: "petadoption@gmail.com",
    subject: "Thank your interset in this pet",
    html: "<p>Thank You</p>"
  })

  res.send("Thanks for sending data to us")
}  