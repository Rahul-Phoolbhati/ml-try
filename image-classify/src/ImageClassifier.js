import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from '@tensorflow-models/mobilenet'





function ImageClassifier(){

    const [model, setModel] = useState(null);
    const [file, setFile] = useState(null);
    const [pred, setPred] = useState([]);

    useEffect(()=>{
        async function loadModel(){
            const mobilenetModel = await mobilenet.load();
            setModel(mobilenetModel);
        }
        loadModel();
    },[]);

    const classifyImage = async (image)=>{
        const url = URL.createObjectURL(image);
        setFile(url);
        const img = new Image();
        img.onload = async () => {
            if(model){
                const tensor = tf.browser.fromPixels(img); // Passing HTMLImageElement
                const prediction = await model.classify(tensor);
                console.log(prediction);
                setPred(prediction);
            }
            
            // ...
        };
        img.src = url;
    }

    return (
        <div>
            <h1>Image Classifier</h1>
            <input type="file" onChange={(e)=> classifyImage(e.target.files[0])}></input>
            <img src={file} height={500} width={900} />
            <div className="predictions-container">
                {pred.length > 0 && (
                    <>
                    <h2>Predictions:</h2>
                    <ul>
                        {pred.map((fpred,index)=>{
                            <li key={index}>
                                {fpred.className} - {(fpred.probability*100).toFixed(4)}
                            </li>
                        })
                        }
                    </ul>
                    </>
                )}
            </div>
        </div>
    )
}

export default ImageClassifier