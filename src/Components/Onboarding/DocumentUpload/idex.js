import React, { useState } from 'react';
import { storage, db } from '../../../firebase/firebaseconfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import './DocumentSubmission.css';

const DocumentSubmission = () => {
  const [files, setFiles] = useState({
    resume: null,
    offerLetter: null,
    idProof: null,
    addressProof: null,
  });
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');

  // Use the dummy user data for testing
  const currentUser = { id: 1, name: 'John Doe', position: 'Software Engineer', department: 'IT', status: 'Pending' };

  const handleFileChange = (e, fileType) => {
    if (e.target.files.length > 0) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [fileType]: e.target.files[0], // Save the selected file for the specific type
      }));
      setProgress(0);
      setUploadStatus('');
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError('No logged-in user found');
      return;
    }

    const documentTypes = ['resume', 'offerLetter', 'idProof', 'addressProof'];
    const uploadPromises = [];

    try {
      // Ensure the Firestore document exists for the user, create if not
      const userDocRef = doc(db, 'users', currentUser.id.toString()); // Convert ID to string
      await setDoc(userDocRef, { documents: {} }, { merge: true });

      for (const docType of documentTypes) {
        const file = files[docType];
        
        console.log('Processing file:', file);

        if (file && file.name) {
          const storageRef = ref(storage, `documents/${currentUser.id}/${docType}/${file.name}`);

          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadPromises.push(
            new Promise((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setProgress(progressValue);
                },
                (error) => {
                  setError(`File upload failed for ${docType}: ${error.message}`);
                  reject(error);
                },
                async () => {
                  try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await updateDoc(userDocRef, {
                      [`documents.${docType}`]: downloadURL, // Save each document type separately
                    });
                    resolve();
                  } catch (error) {
                    setError(`Failed to update Firestore for ${docType}: ${error.message}`);
                    reject(error);
                  }
                }
              );
            })
          );
        } else {
          // Handle case where no file is selected
          setError(`No file selected for ${docType}`);
        }
      }

      // Ensure all uploads are successful
      await Promise.all(uploadPromises);
      setUploadStatus('All documents uploaded successfully!');
    } catch (error) {
      setError('Error occurred during document submission: ' + error.message);
    }
  };

  return (
    <div className="document-submission-container">
      <h2>Document Submission</h2>
      <form onSubmit={handleSubmit}>
        <div className="document-upload-section">
          <label>Resume (PDF):</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, 'resume')}
          />
        </div>
        <div className="document-upload-section">
          <label>Offer Letter (PDF):</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, 'offerLetter')}
          />
        </div>
        <div className="document-upload-section">
          <label>ID Proof (PDF/Images):</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, 'idProof')}
          />
        </div>
        <div className="document-upload-section">
          <label>Address Proof (PDF/Images):</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, 'addressProof')}
          />
        </div>

        <button type="submit" className="upload-button">
          Submit Documents
        </button>
      </form>

      {uploadStatus && <p>{uploadStatus}</p>}
      {error && <p className="error">{error}</p>}

      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default DocumentSubmission;