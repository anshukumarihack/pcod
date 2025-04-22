import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, X } from 'lucide-react';

interface ProfilePictureUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ onImageSelect, currentImage }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onImageSelect(imageSrc);
      setShowCamera(false);
    }
  };

  return (
    <div className="relative">
      {showCamera ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="relative">
              <button
                onClick={() => setShowCamera(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded-lg"
              />
            </div>
            <button
              onClick={capturePhoto}
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
            >
              Take Photo
            </button>
          </div>
        </div>
      ) : null}

      <div className="relative group">
        <div
          className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 cursor-pointer"
          onClick={() => setShowOptions(!showOptions)}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-purple-100 flex items-center justify-center">
              <Camera className="w-8 h-8 text-purple-400" />
            </div>
          )}
        </div>

        {showOptions && (
          <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
            <button
              onClick={() => {
                setShowOptions(false);
                setShowCamera(true);
              }}
              className="w-full px-4 py-2 text-left hover:bg-purple-50 flex items-center"
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </button>
            <button
              onClick={() => {
                fileInputRef.current?.click();
                setShowOptions(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-purple-50 flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfilePictureUpload;