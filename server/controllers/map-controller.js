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
    const body = res.body;
    console.log("loading map");
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No maps were selected to load',
        })
    }
    await Map.findById({ _id: req.params.id }, (err, map) => {
        console.log("Found Map!")
        if (err) {
            return res.status(400).json({ success: false, error: err})
        }
        return res.status(200).json({success: true, map: map})

        

    }).catch(err => console.log(err))

}

deleteMapById = async (req, res) => {

    await Map.findOneAndRemove({ _id: req.params.id }).then(() => {
        return res.status(200)
    })

}

module.exports = {
    createMap,
    getMapById,
    deleteMapById

}