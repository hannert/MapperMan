const express = require('express')
const router = express.Router()
const MapController = require('../controllers/map-controller')

router.post('/newmap', MapController.createMap)
router.get('/map/:id', MapController.getMapById)
router.delete('/map/:id', MapController.deleteMapById)
// router.put('/map/', MapController.editMap)

module.exports = router