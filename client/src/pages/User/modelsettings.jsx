import { useState, useEffect } from 'react';

export default function Settings() {
  const [modelFile, setModelFile] = useState(null);
  const [modelName, setModelName] = useState('');
  const [uploadedModels, setUploadedModels] = useState([]);

  useEffect(() => {
    // Fetch the uploaded models from the server when the component mounts
    // Update the 'uploadedModels' state with the fetched data
    fetchUploadedModels();
  }, []);

  const fetchUploadedModels = async () => {
    try {
      const response = await fetch('/api/model/models');
      if (response.ok) {
        const data = await response.json();
        setUploadedModels(data.models);
      } else {
        console.error('Failed to fetch uploaded models');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setModelFile(file);
  };

  const handleModelNameChange = (event) => {
    const name = event.target.value;
    setModelName(name);
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('modelName', modelName);
  formData.append('file', modelFile);

  try {
    const response = await fetch('/api/model/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('File uploaded successfully. Filename:', data.filename);
      
      // Update the list of uploaded models
      fetchUploadedModels();

      // Clear the form after successful upload
      setModelName('');
      setModelFile(null);
    } else {
      console.error('File upload failed');
      // Handle error, e.g., show an error message
    }
  } catch (error) {
    console.error('Error during file upload:', error);
  }
};


  return (
    <div className="container mx-auto mt-10 mb-10">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7">Model</h2>
            <p className="mt-1 text-sm leading-6 mt-4">List of uploaded models:</p>
            <select
              className="select select-bordered w-full max-w-xs mt-2"
              onChange={(e) => setModelName(e.target.value)}
              value={modelName}
            >
              <option disabled value="">
                Select Uploaded Model
              </option>
              {uploadedModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
          <div className="divider"></div>
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <p className="mt-1 text-sm leading-6">Upload your machine learning model here. Only files .h5 are allowed.</p>
                <label>
                  <span className="label mt-4">Model name</span>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs mb-2"
                    onChange={handleModelNameChange}
                  />
                </label>
                <label>
                  <span className="label mt-4">Choose Model File</span>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full max-w-xs"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
