const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const File = require('../models/file')
const { v4: uuid4 } = require('uuid')


let storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/') },
    filename: (req, file, cd) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cd(null, uniqueName)
    }
})

let upload = multer({
    storage,
    limit: { fileSize: 1000000 * 100 }
}).single('myfile')

router.post('/', (req, res) => {


    // store file
    upload(req, res, async (err) => {

        // validate request
        if (req.files) {
            return res.json({ error: "All Fields are Required" })
        }

        if (err) {
            return res.status(500).send({ error: err.message })
        }
        // Store Into Database 
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        })
        const response = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` })
    })

    // Response -> Link
})

// router.post('/send', async (req, res) => {
//     const { uuid, emailTo, emailFrom } = req.body
//     if (!uuid || !emailTo || !emailFrom) {
//         return res.status(422).send({ error: "all fields required" })
//     }

//     // get data from database
//     const file = await File.findOne({ uuid: uuid })
//     if(file.sender){
//         return res.status(422).send({ error: "Email already sent." })
//     }

//     file.sender= emailFrom
//     file.receiver= emailTo
//     const response = await file.save()

//     // send email
//     const sendMail = require('../services/emailService')
//     sendMail({
//         from: emailFrom,
//         to: emailTo,
//         subject: 'InShare File Sharing',
//         text: `${emailFrom} shared a file with you`,
//         html: require('../services/emailTemplate')({
//             emailFrom: emailFrom,
//             downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
//             size: parseInt(file.size/1000) + ' KB',
//             expires: '24 hours'
//         })
//     })
//     return res.send({success: true})
// })

module.exports = router