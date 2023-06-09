// const Map = require('../models/map-model')
const Map = require('../db/schemas/map-schema')
const Account = require('../db/schemas/account-schema');
const Comment = require('../db/schemas/comment-schema')


createMap = async (req, res) => {

    const {owner, mapData} = req.body;

    // console.log("createMap body: " + JSON.stringify(mapData))

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
    }).catch((error) => {
        console.log(error)
        return res.status(400).json({success:false, error: error})
    })
}

getMapById = async (req, res) => {
    console.log("loading map");
    // console.log(req);
    // use bcrypt to check if the map is in the users owned list
    await Map.findById({ _id: req.params.id }).then((map) => {
        console.log("Found Map!")
        // console.log(map);
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
        // console.log(maps);

        for (const map of maps){
            await Account.find({_id: map.owner}).then((account) => {
                let mapEntry = {
                    id: map._id,
                    name: map.name,
                    owner: account[0].username,
                    createdAt: map.createdAt,
                    published: map.published,
                    tags: map.tags
                };
                data.push(mapEntry);
            })
        }

        return res.status(200).json({success: true, maps: data})
    }).catch(err => console.log(err))
}
addComment = async(req, res) => {
    console.log("adding comment")
    if(!req.body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    let comment = req.body.comment;
    let id = req.body.id
    let username = req.body.username
    console.log(id)
    console.log(comment)
    let response = await Map.findByIdAndUpdate(
        id,
        {$push: {"comments": {owner: username, content: comment}}}
    );
    console.log("adding done!")
    return res.status(200).json({
        success: true
    })
}
updateTags = async(req,res) =>{
    console.log("Updating tags")
    const body = req.body;

    if(!body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    const id = body.id;
    const tags = body.tags;


    Map.findOne({_id: id}).then((map) => { 

            // Update the maps tags array and then save
            map.tags = tags;
            map
                .save()
                .then(() => {
                    return res.status(200).json({success: true, message:'Map collaborators updated!'})
                })

    })
}
getMapsDataByAccount = async (req, res) => {
    const user = req.body;
    // console.log('User')
    // console.log(user);

    //below is wrong, returns array of ids
    //need to iterate through ids, get info for each one,
    //then return a big JSON of all the maps with things we need
    //for the map list like Name, Owner, createdAt for published, etc.
    let data = []
    await Account.find({email: user.email}).then(async (account) => {
        // console.log('Username: ' + account[0].username);
        // console.log("Maps: ")
        // console.log(account[0].mapsOwned);
        for(const map of account[0].mapsOwned){
            // console.log(map);
            await Map.findById(map).then((map) => {
                // console.log("Map: ");
                // console.log(map);
                let mapEntry = {
                    id: map._id,
                    name: map.name,
                    owner: account[0].username,
                    createdAt: map.createdAt,
                    published: map.published,
                    tags: map.tags
                };
                // console.log("Map Entry: ");
                // console.log(mapEntry);

                data.push(mapEntry);

                // console.log('data');
                // console.log(data);
            }).catch(err => console.log(err));
        }
    }).then(() => {
        // console.log('data at the end');
        // console.log(data);
        return res.status(200).json({success: true, maps: data})
    })

    .catch(err => console.log(err))
}

getSharedMapsDataByAccount = async (req, res) => {
    console.log('-------------------', req.body);
    console.log("Getting shared maps")
    const user = req.body;
    console.log(user)

    //below is wrong, returns array of ids
    //need to iterate through ids, get info for each one,
    //then return a big JSON of all the maps with things we need
    //for the map list like Name, Owner, createdAt for published, etc.
    let data = []
    await Account.find({email: user.email}).then(async (account) => {
        console.log("account found!", account)
        if(account[0].mapAccess.length === 0){
            return res.status(200).json({success: true, maps: data})
        }
        for(const map of account[0].mapAccess){
            await Map.findById(map).then((map) => {
                console.log(map.name)
                let mapEntry = {
                    id: map._id,
                    name: map.name,
                    owner: account[0].username,
                    createdAt: map.createdAt,
                    published: map.published,
                    tags: map.tags
                };
                data.push(mapEntry);
            }).catch(err => console.log(err));
        }
    }).then(() => {
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

saveMap = async (req, res) => {
    const body = req.body
    console.log("Body: ");
    console.log(body);
    if(!body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    Map.findOne({_id: body.id}).then((map) => {
        // console.log("map found: " + JSON.stringify(map));
        map.mapData = body.mapData;
        map
            .save()
            .then(() =>{
                console.log("successfully saved!");
                return res.status(200).json({
                    success: true,
                    id: map._id,
                    name: map.name,
                    message: 'map updated!',
                })
            })
            .catch(error =>{
                console.log("Failed to save");
                return res.status(404).json({
                    error,
                    message: 'Map not updated!',
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
        {$unset: {[`mapData.features.${index}.properties.${property}`]: ""}},
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


isValidEmail = async(req,res) => {
    const body = req.body;
    if(!body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    const email = body.email;

    Account.find({email: email}).then((account) => {
        if(account[0]?.email){
            return res.status(200).json({
                success: true,
                message: 'email exists'
            })
        }
        else {
            return res.status(204).json({success:false, message: 'email does not exist'});
        }  
    }).catch((err) => {return res.status(400).json({error: err})})

}

updateCollaborator = async(req,res) =>{
    console.log("Updating collaborators")
    const body = req.body;

    if(!body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    const id = body.id;
    const user = body.user;
    const collaborators = body.collaborators;

    // console.log(id, user, collaborators)

    // Currently just adds unique collaborators, Does not remove them!
    // ! To remove, we must have a copy of the original sharedWith Array and then compare to see what is missing
    // ! based on the missing items, iterate through them and update the accounts owned maps respectively

    Map.findOne({_id: id}).then((map) => { 
        if(map){
            // console.log('original share', map.sharedWith)
            let originalShare = map.sharedWith

            // Keep an array of booleans to check which of the original array still remains
            let findCheck = new Array(originalShare?.length).fill(false)


            // Loop through the new array and find new ones
            for(var i = 0; i < collaborators?.length; i++){
                // console.log(collaborators[i])
                let email = collaborators[i];
                let index = originalShare.indexOf(email)
                if(index !== -1){
                    console.log("Found duplicate of ", email, " with index of ", i)
                    findCheck[index] = true
                } 
                else {
                    Account.find({email: email}).then((account) => {
                        if(account[0]){
                            // console.log(account[0].username)
                            account[0].mapAccess.push(id)
                            account[0]
                            .save()
                            .catch(err => {
                                console.log(err)
                                return res.status(400).json({success:false, error: err});
                            })
                        }
                    })
                }

            }

            // Then loop through the boolean array to see if any are false, Means that 
            // The new sharedWith array doesnt include them ( Remove them )
            for(var i = 0; i < findCheck?.length; i++){
                if(findCheck[i] === true){
                    continue
                }
                // False value -> Go and remove it from that users map access list
                Account.find({email: originalShare[i]}).then((account) => {
                    if(account[0]){
                        // console.log(account[0].username)
                        account[0].mapAccess = account[0].mapAccess.filter(x => x !== id)
                        account[0]
                        .save()
                        .catch(err => {
                            console.log(err)
                            return res.status(400).json({success:false, error: err});
                        })
                    }
                })

            }

            // Update the maps shared array and then save
            map.sharedWith = collaborators;
            map
                .save()
                .then(() => {
                    return res.status(200).json({success: true, message:'Map collaborators updated!'})
                })

        }



    })
    

}
module.exports = {
    createMap,
    getMapById,
    deleteMapById,
    deleteMap,
    getPublicMaps,
    getMapsDataByAccount,
    getSharedMapsDataByAccount,
    renameMap,
    forkMap,
    publishMap,
    editMapProperty,
    saveMap,
    deleteMapProperty,
    addComment,
    updateTags,
    updateCollaborator,
    isValidEmail

}