import { GeoJSON, MapContainer, TileLayer, Pane } from "react-leaflet";
import React, { createRef, useState, useEffect } from 'react'
import file from './NA.json';
import hash from 'object-hash';
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import L from 'leaflet';
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import {saveAs} from 'file-saver';
const snapshotOptions = {
    hideElementsWithSelectors: [
      ".leaflet-control-container",
      ".leaflet-dont-include-pane",
      "#snapshot-button"
    ],
    hidden: true
  };
  
const screenshotter = new SimpleMapScreenshoter(snapshotOptions);

export default function EditScreen(){
    const [mapref, setMapref] = useState();
    const geoJsonRef = React.createRef();
  
    useEffect(() => {
      if (mapref) {
        screenshotter.addTo(mapref);
      }
    }, [mapref]);
  
    const takeScreenShot = () => {
      // Get bounds of feature, pad ot a but too
      const featureBounds = geoJsonRef.current.getBounds().pad(0.1);
  
      // Get pixel position on screen of top left and bottom right
      // of the bounds of the feature
      const nw = featureBounds.getNorthWest();
      const se = featureBounds.getSouthEast();
      const topLeft = mapref.latLngToContainerPoint(nw);
      const bottomRight = mapref.latLngToContainerPoint(se);

      // Get the resulting image size that contains the feature
      const imageSize = bottomRight.subtract(topLeft);
  
      // console.log(
      //   "nw:\n",
      //   nw,
      //   "\nse:\n",
      //   se,
      //   "\ntopLeft:\n",
      //   topLeft,
      //   "\nbottomRight:\n",
      //   bottomRight,
      //   "\nsize:\n",
      //   imageSize
      // );
  
      // Set up screenshot function
      screenshotter
        .takeScreen("image")
        .then((image) => {
          // Create <img> element to render img data
          var img = new Image();
  
          // once the image loads, do the following:
          img.onload = () => {
            // Create canvas to process image data
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
  
            // Set canvas size to the size of your resultant image
            canvas.width = imageSize.x;
            canvas.height = imageSize.y;
  
            // Draw just the portion of the whole map image that contains
            // your feature to the canvas
            // from https://stackoverflow.com/questions/26015497/how-to-resize-then-crop-an-image-with-canvas
            ctx.drawImage(
              img,
              topLeft.x,
              topLeft.y,
              imageSize.x,
              imageSize.y,
              0,
              0,
              imageSize.x,
              imageSize.y
            );
  
            // Create URL for resultant png
            var imageurl = canvas.toDataURL("image/png");
            console.log(imageurl);
  
            const resultantImage = new Image();
            resultantImage.style = "border: 1px solid black";
            resultantImage.src = imageurl;
  
            document.getElementById("root").appendChild(canvas);
  
            canvas.toBlob(function (blob) {
              // saveAs function installed as part of leaflet snapshot package
              saveAs(blob, "greek_border.png");
            });
          };
  
          // set the image source to what the snapshotter captured
          // img.onload will fire AFTER this
          img.src = image;
        })
        .catch((e) => {
          alert(e.toString());
        });
    };

    return (
        <Box>
            <MapContainer center={[51.505, -0.09]} zoom={1} doubleClickZoom={false} ref={geoJsonRef}
                  id="mapId"
                  preferCanvas={true}
                  whenCreated={setMapref}>
                <Pane name="snapshot-pane">
                    <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                    <GeoJSON 
                        key={hash(file)} 
                        data={file} 
                        />
                </Pane>
            </MapContainer>
            <Button onClick = {takeScreenShot}>
                Take Picture
            </Button>
        </Box>

    )
}