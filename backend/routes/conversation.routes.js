const express = require('express')
const router = express.Router()
const conversationController = require('../Controllers/Converstation.Controler')
const tokenAuth = require('../middlawear/tokenAuth')

router.get('/',tokenAuth,conversationController.getConversation)
router.post('/add',tokenAuth,conversationController.startConversation)
router.put('/:id',tokenAuth,conversationController.readItConversation)
module.exports = router