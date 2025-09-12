import { useEffect, useState } from 'react'
import { MediaAPI } from '../../services/apis/MediaApiClient';
import useToast from "../../useToast";
import { ToastVariants } from "../../../utils/constants";
import MediaViewer from '../MediaViewer/MediaViewer';
import './ImageUploadViewer.css'
const ImageUploadViewer = (props) => {

    const { setValue, name , showProvideUrl = false} = props;
 //   console.log("SetValue and name", name, setValue)
    const [imageUrl, setImageUrl] = useState(props.value ? props.value : "No image url");
    const [image, setImage] = useState("");
    const [id] = useState("fileInput" + Date.now())
    const { showToast } = useToast();
    const [urlInputVisible, setUrlInputVisible] = useState(false);


    const rightButtonStyle = {
        _position: 'absolute',
        top: '10px',
        right: '40px',
        display: "flex",
        flexDirection: "row"
    }

    const handleButtonClick = () => {
        setUrlInputVisible(true);
    };

    const handleInputChange = (event) => {
        setImageUrl(event.target.value);
        setUrlInputVisible(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Do something with the entered URL, e.g., make an API request
     //   console.log('Submitted URL:', url);
        // Reset the input and hide it
        // setImageUrl('');
        setUrlInputVisible(false);
    };


    useEffect(() => {
        // saveImage();
    }, [])
    const fileChangedHandler = event => {
        console.log("FILE CHANGEDDDDDDDd")
        let file = event.target.files[0];
        //let reader = new FileReader();    
        console.log("File upload", "->", file.type, "<-");
        //reader.onload = function(e) {
        // setFile(e.target.result);
        // };
        //reader.readAsDataURL(event.target.files[0]);     
        if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/x-icon" && file.type !== 'image/svg+xml') {
            // window.alert("File does not support. You must use .png or .jpg or .svg ");
            //return false;
        }
        if (file.size > 5e6) {
            window.alert("Please upload a file smaller than 5 MB");
            return false;
        }
        saveImage(file);


    };
    const saveImage = (newImage) => {
        console.log("uploading image.")
        console.log(URL.createObjectURL(newImage))
        // setImageUrl(URL.createObjectURL(file));
        const formData = new FormData();
        formData.append('img', newImage)
        console.log("FormData", formData, props)
        MediaAPI.uploadImage(formData)
            .then((res) => {
                console.log("Successful", res.data);
                setImageUrl(res.data.data.url);
                showToast(
                    "Image Uploaded Successfully. ",
                    ToastVariants.success
                );
                setValue(name, res.data.data.url);

            }).catch((err) => {
                console.error("Error:", err)
                showToast(
                    "Image Upload failed. ",
                    ToastVariants.error
                );
            });
        return false;
    }
    return (
        <>
            <div className='image-card' style={{ position: "relative" }}>              

                <div className="url-container">
                    <input
                        className="url-input"
                        type="text"
                        value={imageUrl}
                        readOnly
                        style={{ width: "100%" }}
                    />
                    <i className="fas fa-upload link-icon"></i>
                </div>
                <label for={id}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <br />
                        {imageUrl.length > 20 ? <MediaViewer fileUrl={imageUrl}></MediaViewer> : <></>}
                        {/* <ScrollingMessage message="Click here to upload new"></ScrollingMessage> */}
                        <br />
                        <a className='btn btn-secondary' style={{fontSize:"0.8rem"}}>Upload Image</a>
                    </div>
                    <br />
                </label>
                {/* <input value={imageUrl} className="m-1" disabled style={{ width: '100%', display: '' }} placeholder='Current Image URL'></input> <br /> */}
                <input className="btn btn-secondary "
                    id={id}
                    name="file" type="file"
                    placeholder='Choose a file'
                    onChange={fileChangedHandler}
                    style={{ width: '100%', display: "none" }}
                />
                {showProvideUrl? 
                <div style={{backgroundColor:'lightgray',padding:"25px", borderRadius:"10px"}}>
                    <p>* Provide Image Url </p>
                    <div className='url-container'>
                        <input onChange={handleInputChange}
                            className="url-input"
                            type="text"
                            //value={imageUrl}
                            style={{ width: "100%" }}
                        />
                        <i className="fas fa-link link-icon"></i>
                    </div>
                </div>
                :<></>
                }
                <br />
                {/* <button className='btn btn-secondary' style={{ width: "50%" }} onClick={handleButtonClick} type="button">Upload Url</button> */}
            </div>
        </>
    )
}
export default ImageUploadViewer;