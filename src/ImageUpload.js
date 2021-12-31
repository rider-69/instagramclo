import { Button } from "@mui/material";
import React, { useState } from "react";
import { db, storage } from "./firebase";
import firebase from "firebase/compat";
import './ImageUpload.css'

function ImageUpload({username}) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on("state_changed", 
    (snapshot) => {
      // progress function
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      setProgress(progress);
    } ,
     (erron) => {
         //error function. ....
         alert(erron.message);
     },
     ()=> {
       //complete function...
 storage
 .ref("images")
 .child(image.name)
 .getDownloadURL()
 .then(url => {
     // post image inside db
     db.collection("posts").add({
         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
         caption: caption,
         imageUrl: url,
         username: username 
     })
     setProgress(0);
     setCaption("");
     setImage(null)
 })


     }
      
    
    
    );
  };

  return (
    <div className="imageupload">
      
      <progress className="imageupload__progress" value={progress} max="100" />
      <input
      className="imageupload__captionText"
        type="text"
        placeholder="Enter a caption.."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input className="imageupload__file" type="file" onChange={handleChange} />
      <Button className="imageupload__button" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
