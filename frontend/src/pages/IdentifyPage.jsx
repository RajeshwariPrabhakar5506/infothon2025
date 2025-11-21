import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UploadCloud, Loader, Camera } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ResultCard from '../components/ResultCard';
import { Link } from 'react-router-dom';

const IdentifyPage = () => {
  const { user } = useContext(AuthContext);
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected)); // Create a preview URL
      setResult(null); // Reset previous results
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image first');

    if (!user) return toast.error('You must be logged in to identify waste');

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`, // Attach token!
        },
      };

      const { data } = await axios.post('/api/identify', formData, config);
      setResult(data);
      toast.success('Analysis Complete!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Identification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-heading text-charcoal mb-4">Identify Your Waste</h1>
          <p className="text-gray-600">Upload a photo to instantly get sorting instructions.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          
          {!user ? (
            <div className="text-center py-10">
              <p className="mb-4 text-gray-600">Please login to use the AI tool.</p>
              <Link to="/login" className="bg-recycle-green text-white px-6 py-2 rounded-full font-bold">Login Now</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Upload Area */}
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-recycle-green transition bg-gray-50">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                    <p className="mt-2 text-sm text-gray-500">Click to change image</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-700">Click or Drag to Upload</p>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG supported</p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                disabled={loading || !file}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition ${
                  loading || !file 
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                    : 'bg-recycle-green text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <> <Loader className="animate-spin" /> Analyzing... </>
                ) : (
                  <> <Camera /> Analyze Waste </>
                )}
              </button>
            </form>
          )}

          {/* Result Display */}
          {result && <ResultCard result={result} />}
          
        </div>
      </div>
    </div>
  );
};

export default IdentifyPage;