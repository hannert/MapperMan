const Map = require('../models/map-model')

createMap = (req, res) => {
    // Temporary method to add some map to the database, not attached to a specific user yet
    const body = req.body;
    console.log("createMap body: " + JSON.stringify(body))


    let newMap = new Map(body)
    newMap
        .save()
        .then(() => {
            return res.status(201).json({
                success: true
            })
        }).catch(error => { return res.status(400).json({success:false, error: error})}) 


}



getMapById = async (req, res) => {
    console.log("loading map");

    await Map.findById({ _id: req.params.id }).then((map) => {
        console.log("Found Map!")
        if (map) {
            return res.status(200).json({ success: true, map: map})
        }
        return res.status(400).json({success: false})
    }).catch(err => {
        console.log(err)
        return res.status(400).json({success:false, error: err});
    })

}

deleteMapById = async (req, res) => {

    await Map.findOneAndRemove({ _id: req.params.id }).then(() => {
        return res.status(200)
    }).catch(err => console.log(err))

}

getPublicMaps = async (req, res) => {
    await Map.find({}, '_id').then((maps) => {
        return res.status(200).json({success: true, maps: maps})
    }).catch(err => console.log(err))
}

module.exports = {
    createMap,
    getMapById,
    deleteMapById,
    getPublicMaps
}