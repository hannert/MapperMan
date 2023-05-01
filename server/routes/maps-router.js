const express = require('express')
const router = express.Router()
const MapController = require('../controllers/map-controller')

router.post('/newmap', MapController.createMap)
router.get('/map/:id', MapController.getMapById)
router.get('/publicmaps', MapController.getPublicMaps)
router.get('/publicmapsByName/:name', MapController.getPublicMapsByName)
router.post('/maps', MapController.getMapsDataByAccount)
router.post('/sharedMaps', MapController.getSharedMapsDataByAccount)

router.post('/map', MapController.deleteMap)
router.post('/map/:id', MapController.saveMap)

/**might have to convert rename to another method (like update), but its here for 
 * build 2 for now
 */
router.put('/map/:id', MapController.renameMap)
// router.put('/map/', MapController.editMap)
router.post('/fork', MapController.forkMap)

router.put('/map/:id/publish', MapController.publishMap)

router.put('/map/:id/editProperty', MapController.editMapProperty)
router.put('/map/:id/deleteProperty', MapController.deleteMapProperty)


router.put('/map/:id/addComment', MapController.addComment)

router.put('/updateCollaborator', MapController.updateCollaborator)
router.put('/isValidEmail/:email', MapController.isValidEmail)


module.exports = router