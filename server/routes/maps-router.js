const express = require('express')
const router = express.Router()
const MapController = require('../controllers/map-controller')

router.post('/newmap', MapController.createMap)
router.get('/map/:id', MapController.getMapById)
router.get('/publicmaps', MapController.getPublicMaps)
router.post('/maps', MapController.getMapsDataByAccount)

router.post('/map', MapController.deleteMap)

/**might have to convert rename to another method (like update), but its here for 
 * build 2 for now
 */
router.put('/map/:id', MapController.renameMap)
// router.put('/map/', MapController.editMap)
router.post('/fork', MapController.forkMap)

module.exports = router