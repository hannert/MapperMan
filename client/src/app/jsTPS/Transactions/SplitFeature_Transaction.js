import * as turf from '@turf/turf';
import { jsTPS_Transaction } from "../jsTPS";

export default class SplitFeature_Transaction extends jsTPS_Transaction {

    constructor(layerGroup, featureIndex, subPolyIndex, startPos, endPos, socket, mapId) {
        super();
        this.layerGroup = layerGroup;
        this.featureIndex = featureIndex;
        this.subPolyIndex = subPolyIndex;
        this.startPos = startPos;
        this.endPos = endPos;
        this.dontDo = true;
        this.socket = socket;
        this.mapId = mapId;
    }

    doTransaction() {


        /**SEND TO OTHER CLIENTS */
        let room = this.mapId;
        console.log("emitting")
        this.socket.emit('create move vertex transaction', room, this.featureIndex, this.startPos.lat, this.startPos.lng, this.endPos.lat, this.endPos.lng, "move vertex" );





    }

    /**
     *  Need to add the vertex to whatever shape had it
     */
    undoTransaction() {

        let room = this.mapId;
        console.log("emitting")
        this.socket.emit('create move vertex transaction', room, this.featureIndex, this.startPos.lat, this.startPos.lng, this.endPos.lat, this.endPos.lng, "undo move vertex" );

        console.log("SubPolyIndex is ", this.subPolyIndex)



        for(let layer of this.layerGroup.getLayers()){
        }

    }

    polygonCut(polygon, line, idPrefix) {
        // Old one should be deleted here?
        const THICK_LINE_UNITS = 'kilometers';
        const THICK_LINE_WIDTH = 0.001;
        var i, j, id, intersectPoints, lineCoords, forCut, forSelect;
        var thickLineString, thickLinePolygon, clipped, polyg, intersect;
        var polyCoords = [];
        var cutPolyGeoms = [];
        var cutFeatures = [];
        var offsetLine = [];
        var retVal = null;
        // console.log('polygon shape', polygon.shape)
        // console.log('line type', line.type)

        // if (((polygon.shape != 'polygon') && (polygon.shape != 'MultiPolygon')) || (line.type != 'LineString')) {
        //     // console.log("return ")
        //     return retVal;
        // }
        // if(polygon.instanceOf(L.Polygon) ){
        //     console.log("INSTACNE OF POLYGON")
        // }
        if((line.type != 'LineString')){
            return retVal;
        }
        if (typeof(idPrefix) === 'undefined') {
            idPrefix = '';
        }
        let newPolygon = polygon.toGeoJSON().geometry
        // console.log(newPolygon)
        intersectPoints = turf.lineIntersect(newPolygon, line);
        if (intersectPoints.features.length == 0) {
            // console.log("return ")
            return retVal;
        }
        
        var lineCoords = turf.getCoords(line);
        if ((turf.booleanWithin(turf.point(lineCoords[0]), newPolygon) ||
            (turf.booleanWithin(turf.point(lineCoords[lineCoords.length - 1]), newPolygon)))) {
            console.log("return ")
            return retVal;
        }

        offsetLine[0] = turf.lineOffset(line, THICK_LINE_WIDTH, {units: THICK_LINE_UNITS});
        offsetLine[1] = turf.lineOffset(line, -THICK_LINE_WIDTH, {units: THICK_LINE_UNITS});

        for (i = 0; i <= 1; i++) {
            forCut = i; 
            forSelect = (i + 1) % 2; 
            polyCoords = [];
            for (j = 0; j < line.coordinates.length; j++) {
                polyCoords.push(line.coordinates[j]);
            }
            for (j = (offsetLine[forCut].geometry.coordinates.length - 1); j >= 0; j--) {
                polyCoords.push(offsetLine[forCut].geometry.coordinates[j]);
            }
            polyCoords.push(line.coordinates[0]);

            thickLineString = turf.lineString(polyCoords);
            thickLinePolygon = turf.lineToPolygon(thickLineString);
            clipped = turf.difference(newPolygon, thickLinePolygon);
            console.log(clipped)
            cutPolyGeoms = [];
            
            for (j = 0; j < clipped.geometry.coordinates.length; j++) {
                polyg = turf.polygon(clipped.geometry.coordinates[j]);
                intersect = turf.lineIntersect(polyg, offsetLine[forSelect]);
                if (intersect.features.length > 0) {
                    cutPolyGeoms.push(polyg.geometry.coordinates);
                };
            };

            cutPolyGeoms.forEach(function (geometry, index) {
            id = idPrefix + (i + 1) + '.' +  (index + 1);
            cutFeatures.push(turf.polygon(geometry, {id: id}));
                });
        }
        console.log('End', line ,line.type)
        console.log('End',polygon, polygon.type)
        layerGroup.removeLayer(polygon._leaflet_id)
        if (cutFeatures.length > 0) retVal = turf.featureCollection(cutFeatures);

        return retVal;
    }
}