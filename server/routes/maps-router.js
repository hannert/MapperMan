const express = require('express')
const router = express.Router()
const MapController = require('../controllers/map-controller')

router.post('/newmap', MapController.createMap)
router.get('/map/:id', MapController.getMapById)
router.delete('/map/:id', MapController.deleteMapById)
router.get('/publicmaps', MapController.getPublicMaps)
router.get('/maps', MapController.getMapsDataByAccount)

/**might have to convert rename to another method (like update), but its here for 
 * build 2 for now
 */
router.put('/map/:id', MapController.renameMap)
// router.put('/map/', MapController.editMap)

module.exports = router