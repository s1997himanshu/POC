import React from 'react';
import axios from 'axios';
import './App.css';
import Webcam from "react-webcam";
function App_live() {
  const [file, setFile] = React.useState(null);
  const [similarity, setSimilarity] = React.useState(0);

  const fileChangedHandler = event => setFile(event.target.files[0]);
  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
function dataURLtoFile(dataurl, filename) {
 
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
      
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, {type:mime});
}
  const uploadHandler = async (img) => {
    let imagefile = dataURLtoFile(img, "test.png")
   axios.post('https://aq9mlslujf.execute-api.us-east-1.amazonaws.com/FaceSimilarityPOC', imagefile)
      .then((res) => {
      if (res?.data?.[0]?.Similarity)setSimilarity(res.data[0].Similarity)
     console.log('Similarity :', res.data[0].Similarity)

    })
      .catch((e) => window.alert(e))
  }
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  }
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      //console.log(imageSrc)
      uploadHandler(imageSrc)   // calling uploadHanlder fundction to trigger backend API
    },[webcamRef]);

  React.useEffect(() => {
   setInterval(() => {
     capture()
   }, 60000);   // 3000 means, capture function will be triggered after each 3 seconds
  });
  React.useEffect(() => {
    if (similarity && similarity<80) window.alert(`Unknown Face Detected`)
    }, [similarity]);
  
  return (
    <div className= 'body App'>
	  <h1 className= 'Mpp'>Face Similarity Score</h1>
    {/* <input type="file" onChange={fileChangedHandler} /> */}
    <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />
    <button onClick={capture}>Capture photo</button>
    {/* <button onClick={uploadHandler}>Upload</button> */}
      <div>{ similarity}</div>
    </div>
  );
}

export default App_live;