// const Map = require('../models/map-model')
const Map = require('../db/schemas/map-schema')
const Account = require('../db/schemas/account-schema');

createMap = async (req, res) => {
    const {owner, mapData} = req.body;
    console.log(req.body);
    console.log("createMap body: " + JSON.stringify(mapData))

    //Find account first 
    Account.find({email: owner.email}).then((account) => {
        if (account) {
            //Add account found as the owner of the new map
            console.log("Found account");
            console.log(account[0]);
            console.log('Account id is ' + account[0]._id);

            let newMap = new Map({
                name: 'Untitled',
                owner: account[0]._id,
                mapData: mapData,
                published: false,
                comments: [],
                tags: []
            })

            //save map to the db
            newMap
            .save()
            .catch(error => { 
                console.log(error);
                return res.status(400).json({success:false, error: error})
            })

            account[0].mapsOwned.push(newMap.id);
            account[0]
                .save().then(() => {
                    return res.status(201).json({
                        success: true,
                        id: newMap.id,
                        name: 'Untitled'
                    })
                })
                // .catch(err => {
                //     console.log(err)
                //     return res.status(400).json({success:false, error: err});
                // })
            }        
    })
}

getMapById = async (req, res) => {
    console.log("loading map");
    console.log(req);
    // use bcrypt to check if the map is in the users owned list
    await Map.findById({ _id: req.params.id }).then((map) => {
        console.log("Found Map!")
        console.log(map);
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

deleteMap = async (req, res) => {
    // Delete the map from users list
    console.log(req.body);
    const {user, mapId} = req.body;
    console.log(user);
    console.log(mapId);
    await Account.find({email: user.email}).then((account) => {
        if(account[0]){
            account[0].mapsOwned = account[0].mapsOwned.filter(id => id != mapId);
            account[0]
                .save()
                .then(() => {
                    return res.status(200)
                            .json({success: true, message:'Map removed from account'})
                }).catch(err => {
                    console.log(err)
                    return res.status(400).json({success:false, error: err});
                })
        }
    }).catch(err => {
        console.log(err)
        return res.status(400).json({success:false, error: err});
    });
    // Delete the map from the database
    await Map.findOneAndRemove({_id: mapId }).then(() => {
        return res.status(200)
    }).catch(err => console.log(err))
}


getPublicMaps = async (req, res) => {
    console.log("Getting public maps");
    let data = []
    await Map.find({published:true}).then(async(maps) => {
        console.log(maps);

        for (const map of maps){
            await Account.find({_id: map.owner}).then((account) => {
                let mapEntry = {
                    id: map._id,
                    name: map.name,
                    owner: account[0].username,
                    createdAt: map.createdAt,
                    published: map.published
                };
                data.push(mapEntry);
            })
        }

        return res.status(200).json({success: true, maps: data})
    }).catch(err => console.log(err))
}

getMapsDataByAccount = async (req, res) => {
    console.log('req');
    console.log(req.body);
    const user = req.body;
    console.log('User')
    console.log(user);

    //below is wrong, returns array of ids
    //need to iterate through ids, get info for each one,
    //then return a big JSON of all the maps with things we need
    //for the map list like Name, Owner, createdAt for published, etc.
    let data = []
    await Account.find({email: user.email}).then(async (account) => {
        console.log('Username: ' + account[0].username);
        console.log("Maps: ")
        console.log(account[0].mapsOwned);
        for(const map of account[0].mapsOwned){
            console.log(map);
            await Map.findById(map).then((map) => {
                console.log("Map: ");
                console.log(map);
                let mapEntry = {
                    id: map._id,
                    name: map.name,
                    owner: account[0].username,
                    createdAt: map.createdAt,
                    published: map.published
                };
                console.log("Map Entry: ");
                console.log(mapEntry);

                data.push(mapEntry);

                console.log('data');
                console.log(data);
            }).catch(err => console.log(err));
        }
    }).then(() => {
        console.log('data at the end');
        console.log(data);
        return res.status(200).json({success: true, maps: data})
    })

    .catch(err => console.log(err))
}

/** TODO: try to add user authentication here i.e. check if the map belongs to
 * them
 */
renameMap = async (req,res) =>{
    const body = req.body
    console.log("new name: " + req.body.newName);
    console.log(req.params.id)

    if(!body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    Map.findOne({_id: req.params.id}).then((map) => {
        console.log("map found: " + JSON.stringify(map));
        map.name = body.newName;
        map
            .save()
            .then(() =>{
                console.log("successfully renamed!");
                return res.status(200).json({
                    success: true,
                    id: map._id,
                    name: map.name,
                    message: 'map name updated!',
                })
            })
            .catch(error =>{
                console.log("Failed to rename");
                return res.status(404).json({
                    error,
                    message: 'Map name not updated!',
                })
            })
    })
}

forkMap = async (req, res) => {
    const body = req.body
    const mapId = req.body.map
    const user = req.body.user
    console.log('Body V');
    console.log(body)
    if(!body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    // Find the map we want to fork
    Map.findOne({_id: mapId}).then((map) => {
        console.log("map found: " + JSON.stringify(map));
        Account.findOne({ email: user.email}).then((account) => {
            if (account){
                console.log("Found account");

                console.log("AWESOME!!!!!!")

                let newMap = new Map({
                    name: 'Copy of ' + map.name,
                    owner: account._id,
                    mapData: map.mapData,
                    published: false,
                    comments: [],
                    tags: []
                })
                newMap
                    .save()
                    .then(() => {
                        account.mapsOwned.push(newMap.id);
                        account
                            .save()
                            .catch(err => {
                                console.log(err)
                                return res.status(400).json({success:false, id: newMap._id, error: err});
                            })
                    return res.status(200).json({
                        success: true,
                        id: newMap._id,
                    });
                })
            }
        })
        })

}

publishMap = async(req,res) =>{
    const body=req.body;
    if(!body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    const id = body.id;
    let update={ published:true }
    Map.findOneAndUpdate({_id: id}, update).then((map)=>{
        return res.status(200).json({
            success: true,
            id: map._id,
        });
    }).catch(err => console.log(err));
}


editMapProperty = async(req,res) =>{
    const body = req.body;

    if(!body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    const id = body.id;
    const index = body.index;
    const property = body.property;
    const value = body.value;



    Map.findOneAndUpdate(
        {_id: id},
        {$set: {[`mapData.features.${index}.properties.${property}`]: value}},
        {new: true,
        upsert: true}
    ).then((map)=>{
        return res.status(200).json({
            success: true,
            id: map._id,
            name: map.name,
            indexChanged: index,
            propertyChanged: property,
            newPropertyValue: map.mapData.features[index].properties[property],
            message: 'map property updated!'
        });
    }).catch(err => console.log(err));

}

deleteMapProperty = async(req,res) =>{
    console.log("in delete map property")
    const body = req.body;
    console.log(body)

    if(!body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    const id = body.id;
    const index = body.index;
    const property = body.property;



    Map.findOneAndUpdate(
        {_id:id},
        {$unset: {[`mapData.features.${index}.properties`]: property}},
        {new: true}
    ).then((map)=>{
        return res.status(200).json({
            success: true,
            id: map._id,
            name: map.name,
            indexChanged: index,
            propertyDeleted: property,
            message: 'map property deleted!'
        });
    }).catch(err => console.log(err));


}

module.exports = {
    createMap,
    getMapById,
    deleteMapById,
    deleteMap,
    getPublicMaps,
    getMapsDataByAccount,
    renameMap,
    forkMap,
    publishMap,
    editMapProperty,
    deleteMapProperty
}