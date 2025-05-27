import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  AlertCircle,
  Check,
  AlertTriangle,
  RotateCcw,
  FilePlus,
  Send,
} from "lucide-react";

const Diagnosis = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setDiagnosis(null);
      setError(null);
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setDiagnosis(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("Please select or capture an image first");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://localhost:8000/classify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      setDiagnosis(result);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImage(null);
    setPreview(null);
    setDiagnosis(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const getConfidenceColor = (score) => {
    if (score > 0.8) return "text-green-600";
    if (score > 0.5) return "text-yellow-600";
    return "text-red-600";
  };

  const reportDiagnosis = () => {
    // This would connect to a reporting system
    alert("Diagnosis report submitted. Thank you for your feedback!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-2xl font-bold text-green-700">
              Plant Disease Diagnosis
            </h1>
          </div>

          {!preview ? (
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                <p className="text-gray-500 mb-4 text-center">
                  Upload or capture a photo of a plant leaf for diagnosis
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center justify-center gap-2 bg-white text-green-700 px-4 py-2 rounded-md border border-green-700 hover:bg-green-50 transition-colors"
                  >
                    <Upload size={18} />
                    Upload Photo
                  </button>

                  <button
                    onClick={() => cameraInputRef.current.click()}
                    className="flex items-center justify-center gap-2 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
                  >
                    <Camera size={18} />
                    Take Photo
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <input
                  type="file"
                  ref={cameraInputRef}
                  onChange={handleCameraCapture}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={resetForm}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <RotateCcw size={16} className="text-gray-700" />
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 px-6 py-2 rounded-md ${
                    loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-700 text-white hover:bg-green-800"
                  } transition-colors`}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Send size={18} />
                      Diagnose Leaf
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-center">
                    <AlertCircle size={20} className="text-red-500 mr-2" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {diagnosis && (
                <div
                  className={`border-l-4 p-4 rounded ${
                    diagnosis.output === "Not a leaf"
                      ? "bg-yellow-50 border-yellow-500"
                      : "bg-green-50 border-green-500"
                  }`}
                >
                  {diagnosis.output === "Not a leaf" ? (
                    <div className="flex items-start">
                      <AlertTriangle
                        size={20}
                        className="text-yellow-500 mr-2 mt-1"
                      />
                      <div>
                        <p className="font-medium text-yellow-700">
                          This doesn't appear to be a plant leaf
                        </p>
                        <p className="text-yellow-600 text-sm mt-1">
                          Please upload a clear image of a plant leaf for
                          diagnosis
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Check size={20} className="text-green-500 mr-2 mt-1" />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Diagnosis Result
                          </h3>
                          <p className="text-gray-700 mt-1">
                            <span className="font-medium">Disease:</span>{" "}
                            {diagnosis.disease_name}
                          </p>
                          <p
                            className={`mt-1 ${getConfidenceColor(
                              diagnosis.confidence_score
                            )}`}
                          >
                            <span className="font-medium">Confidence:</span>{" "}
                            {(diagnosis.confidence_score * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={reportDiagnosis}
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <FilePlus size={16} className="mr-1" />
                          Report this diagnosis
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              This tool is for educational purposes only. For serious plant
              health concerns, please consult with a professional agronomist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
