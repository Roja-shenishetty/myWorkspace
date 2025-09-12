// import { Document, Page ,pdfjs} from 'react-pdf'; // For PDF viewing
import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './MediaViewer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();


const MediaViewer = ({ fileUrl }) => {
  const [fileType, setFileType] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function isURL(str) {
    try {
      new URL(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  function getFileExtension(url) {
    // Get the last part of the URL after the last "/"
    const filename = url.substring(url.lastIndexOf('/') + 1);
  
    // Get the file extension by splitting the filename at the last "."
    const parts = filename.split('.');
    if (parts.length > 1) {
      const fileExtension = parts[parts.length - 1];
      return fileExtension;
    } else {
      return null;
    }
  }

  useEffect(() => {
    // Get the file extension from the fileUrl
    var extension = "";
    if(isURL(fileUrl)){
      extension = getFileExtension(fileUrl);
      if(extension!=null){
        setFileType(extension);
      }
    }     
   }, [fileUrl]);

  // Render different components based on the file extension
  if (fileType === 'pdf') {
    console.log("fileUrl", fileUrl)
    return (
      <div>
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    );
  } else if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'gif' || fileType ==='bmp') {
    return <div className="image-container">
      <img src={fileUrl} alt={""} style={{ width: '100%', objectFit: "scale-down" }} height="250" text-align="left" />
      <a href={fileUrl} download className="download-button">Download</a>
    </div>
  }  else{
    return <div className="image-container">
      <img src={fileUrl} alt={""} style={{ width: '100%', objectFit: "scale-down" }} height="250" text-align="left" />
      {/* <a href={fileUrl} download className="download-button">Download</a> */}
    </div>
  }
};

export default MediaViewer;