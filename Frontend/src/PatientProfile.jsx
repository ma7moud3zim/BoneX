import React, { useState, useRef, useEffect } from 'react';
import { Edit3, User, Calendar, Phone, Save, X, Heart, Pill, AlertTriangle, FileImage, Clock, CheckCircle, Plus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './pt.css';

export default function PatientProfile() {
  const [patientp, setPatient] = useState(JSON.parse(sessionStorage.getItem("userInfo")));
  const token = patientp?.token;
  const [xrayFiles, setXrayFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [personalInfo, setPersonalInfo] = useState(null);
  const navigate = useNavigate();

  const handlesch = () => {
    navigate("../doctorsv1");
  };

  // Mock data
  const mockPatient = {
    medicalHistory: {
      conditions: [
        'Asthma','Diabetes','Hypertension','Heart Disease','Arthritis','Cancer','Chronic Pain',
        'Epilepsy','Multiple Sclerosis','COPD','Stroke','Depression','Anxiety Disorders','Osteoporosis',
        "Ulcerative Colitis","Crohn's Disease","Parkinson's Disease","AIDS/HIV","Obesity",
        'Hyperthyroidism','Hypothyroidism','Chronic Kidney Disease',
      ],
      selectedConditions: ['Osteoporosis', 'Hypertension'],
    },
    medications: {
      list: [
        'Albuterol','Lisinopril','Metformin','Aspirin','Ibuprofen','Paracetamol','Atorvastatin',
        'Simvastatin','Omeprazole','Amoxicillin','Levothyroxine','Hydrochlorothiazide','Metoprolol',
        'Losartan','Sertraline','Furosemide','Gabapentin','Prednisone','Tramadol','Warfarin','Clopidogrel',
        'Ranitidine','Loratadine',
      ],
      onMeds: ['Metformin','Ibuprofen','Atorvastatin'],
    },
    allergies: [
      'Peanuts','Shellfish','Pollen','Dust','Latex','Milk','Eggs','Wheat','Soy','Fish','Cat Dander',
      'Dog Dander','Bee Stings','Insect Bites','Penicillin','Sulfa Drugs','Mold','Grass','Tree Nuts','Perfume','Nickel',
    ],
    appointments: [
      { 
        date: '2025-6-23', 
        summary: 'Initial consultation and X‑ray', 
        diagnosis: ' Closed, minimally displaced transverse mid-shaft tibial fracture of the right leg.',
        status: 'completed'
      },
    ],
  };

  // Fetch personal information from API
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const response = await fetch('https://bonex.runasp.net/Patient/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch personal information');
        }
        
        const data = await response.json();
        setPersonalInfo({
          firstName: data.firstName,
          lastName: data.lastName || '',
          dob: data.dateOfBirth,
          gender: data.gender === 1 ? 'Male' : 'Female',
          phone: data.phoneNumber,
          avatarUrl: `https://bonex.runasp.net/${data.profilePicture}`
        });
      } catch (error) {
        console.error('Error fetching personal info:', error);
        // Fallback to mock data if API fails
        setPersonalInfo({
          firstName: 'Emad Ahmed',
          lastName: '',
          dob: '1985-07-24',
          gender: 'Male',
          phone: '01155006348',
          avatarUrl: 'https://bonex.runasp.net/uploads/profile_pictures/1f6712f9-8df4-4a7f-a7b9-e3b8ccfb97f6.png'
        });
      }
    };

    if (token) {
      fetchPersonalInfo();
    }
  }, [token]);

  // Fetch X-ray data from API
  useEffect(() => {
    const fetchXrays = async () => {
      try {
        const response = await fetch('https://bonex.runasp.net/Xray/patient', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch X-rays');
        }
        
        const data = await response.json();
        setXrayFiles(data.map(file => ({
          name: file.fileName,
          url: `https://bonex.runasp.net/${file.filePath}`,
          aiAnalysis: file.aiAnalysisResult || "AI analysis pending"
        })));
      } catch (error) {
        console.error('Error fetching X-rays:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchXrays();
    }
  }, [token]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="mx-auto px-4 py-8 max-w-7xl">
        {/* Full Width Personal Info */}
        {personalInfo && (
          <div className="mb-8 w-full">
            <PersonalInfo info={personalInfo} />
          </div>
        )}
        
        {/* Medical Data Grid - Equal sizing for Medical History and Medications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <MedicalHistory data={mockPatient.medicalHistory} />
            <Medications meds={mockPatient.medications} />
          </div>
          <div className="space-y-8">
            <Allergies list={mockPatient.allergies} />
            {loading ? (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex justify-center items-center h-40">
                <p>Loading X-rays...</p>
              </div>
            ) : (
              <Xrays files={xrayFiles} />
            )}
          </div>
        </div>
        
        {/* Full Width Appointment Progress */}
        <div className="mt-8 w-full">
          <AppointmentProgress steps={mockPatient.appointments} onSchedule={handlesch} />
        </div>
      </div>
    </div>
  );
}

function PersonalInfo({ info }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(info);
  const [avatarPreview, setAvatarPreview] = useState(info.avatarUrl);
  const fileInputRef = useRef(null);

  const handleSave = () => {
    console.log('Saving:', editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(info);
    setAvatarPreview(info.avatarUrl);
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setEditData({...editData, avatarUrl: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <User className="text-indigo-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Personal Info</h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
          >
            <Edit3 size={20} />
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="text-center">
          <div className="relative inline-block">
            <img
              src={avatarPreview}
              alt={`${editData.firstName} ${editData.lastName}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
              <CheckCircle className="text-white" size={16} />
            </div>
            {isEditing && (
              <button
                onClick={triggerFileInput}
                className="absolute top-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 transition-all"
              >
                <Edit3 size={16} />
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {isEditing ? (
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={editData.firstName}
                  onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={editData.lastName}
                  onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={editData.dob}
                  onChange={(e) => setEditData({...editData, dob: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={editData.gender}
                  onChange={(e) => setEditData({...editData, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-indigo-300"
              >
                <Save size={18} />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-300 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-bold text-gray-800 text-center md:text-left">
              {editData.firstName} {editData.lastName}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm">
                <Calendar className="text-indigo-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-semibold text-gray-800">{calculateAge(editData.dob)} years old</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm">
                <User className="text-indigo-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-semibold text-gray-800">{editData.gender}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm md:col-span-2">
                <Phone className="text-indigo-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-800">{editData.phone}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MedicalHistory({ data }) {
  const [selected, setSelected] = useState(data.selectedConditions || []);
  
  const toggleCondition = (condition) => {
    setSelected(prev => {
      if (prev.includes(condition)) {
        return prev.filter(c => c !== condition);
      } else {
        return [...prev, condition];
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="text-red-500" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Medical History</h2>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-4">Select your current conditions:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
          {data.conditions.map((condition) => (
            <label
              key={condition}
              className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selected.includes(condition)
                  ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-md'
                  : 'border-gray-200 bg-white hover:border-red-300'
              }`}
            >
              <input
                type="checkbox"
                name="condition"
                value={condition}
                checked={selected.includes(condition)}
                onChange={() => toggleCondition(condition)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                selected.includes(condition) ? 'border-red-500 bg-red-500' : 'border-gray-300'
              }`}>
                {selected.includes(condition) && <CheckCircle className="text-white" size={14} />}
              </div>
              <span className={`text-sm font-medium ${
                selected.includes(condition) ? 'text-red-700' : 'text-gray-700'
              }`}>
                {condition}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
        <p className="text-sm text-red-700 font-medium">
          <strong>{selected.length}</strong> conditions selected
        </p>
      </div>
    </div>
  );
}

function Medications({ meds }) {
  const [checked, setChecked] = useState(new Set(meds.onMeds));
  
  const toggle = (med) => {
    const next = new Set(checked);
    next.has(med) ? next.delete(med) : next.add(med);
    setChecked(next);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Pill className="text-blue-500" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Medications</h2>
      </div>
      
      <p className="text-gray-600 mb-4">Select medications you are currently taking:</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
        {meds.list.map((med) => (
          <label
            key={med}
            className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              checked.has(med)
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <input
              type="checkbox"
              checked={checked.has(med)}
              onChange={() => toggle(med)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
              checked.has(med) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
            }`}>
              {checked.has(med) && (
                <CheckCircle className="text-white" size={14} />
              )}
            </div>
            <span className={`text-sm font-medium ${
              checked.has(med) ? 'text-blue-700' : 'text-gray-700'
            }`}>
              {med}
            </span>
          </label>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-700 font-medium">
          <strong>{checked.size}</strong> medications selected
        </p>
      </div>
    </div>
  );
}

function Allergies({ list }) {
  const [selected, setSelected] = useState([]);
  
  const toggleAllergy = (allergy) => {
    setSelected(prev => {
      if (prev.includes(allergy)) {
        return prev.filter(a => a !== allergy);
      } else {
        return [...prev, allergy];
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="text-orange-500" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Allergies</h2>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-4">Select your allergies:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
          {list.map((allergy) => (
            <label
              key={allergy}
              className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selected.includes(allergy)
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
            >
              <input
                type="checkbox"
                name="allergy"
                value={allergy}
                checked={selected.includes(allergy)}
                onChange={() => toggleAllergy(allergy)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                selected.includes(allergy) ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
              }`}>
                {selected.includes(allergy) && <CheckCircle className="text-white" size={14} />}
              </div>
              <span className={`text-sm font-medium ${
                selected.includes(allergy) ? 'text-orange-700' : 'text-gray-700'
              }`}>
                {allergy}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
        <p className="text-sm text-orange-700 font-medium">
          <strong>{selected.length}</strong> allergies selected
        </p>
      </div>
    </div>
  );
}

function Xrays({ files }) {
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Shorten long filenames for display (max 10 chars for base name)
  const shortenFileName = (name, maxBaseLength = 10) => {
    const extensionIndex = name.lastIndexOf('.');
    const hasExtension = extensionIndex !== -1;
    const baseName = hasExtension ? name.substring(0, extensionIndex) : name;
    const extension = hasExtension ? name.substring(extensionIndex) : '';
    
    // Shorten base name to max 10 characters
    const shortenedBase = baseName.length > maxBaseLength 
      ? `${baseName.substring(0, maxBaseLength)}...` 
      : baseName;
    
    return `${shortenedBase}${extension}`;
  };

  // Handle image download
  const handleDownload = (url, name) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch(error => console.error('Download failed:', error));
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <FileImage className="text-purple-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">X-Ray Records</h2>
        </div>
        
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No X-ray records found</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="group relative bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 
                        className="font-semibold text-gray-800 mb-1 truncate" 
                        title={file.name}
                      >
                        {shortenFileName(file.name)}
                      </h3>
                      <p className="text-sm text-gray-600">Click to view details</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-violet-200 transition-all duration-200">
                      <FileImage className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal for viewing X-rays */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 
                className="text-xl font-bold text-gray-800 truncate" 
                title={selectedFile.name}
              >
                {shortenFileName(selectedFile.name, 30)}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(selectedFile.url, selectedFile.name)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all flex items-center gap-1"
                  title="Download X-ray"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <img
                src={selectedFile.url}
                alt={selectedFile.name}
                className="w-full h-auto rounded-xl shadow-lg border border-gray-200 mb-4"
              />
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">AI Analysis Result:</h4>
                <p className="text-gray-700">{selectedFile.aiAnalysis}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AppointmentProgress({ steps, onSchedule }) {
  const today = new Date();
  const completed = steps.filter(a => a.status === 'completed');
  const upcoming = steps.filter(a => a.status === 'upcoming');
  
  const progress = completed.length / steps.length * 100;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 transition-all duration-300 hover:shadow-2xl w-full">
      <div className="flex items-center gap-3 mb-8">
        <Clock className="text-green-500" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Appointment Journey</h2>
      </div>
      
      {/* Progress Bar Section */}
      <div className="mb-10 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-700">Your Treatment Progress</span>
          <span className="text-xl font-bold text-green-600">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 shadow-inner">
          <div
            className="bg-gradient-to-r from-green-500 to-teal-600 h-4 rounded-full transition-all duration-500 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>{completed.length} Completed</span>
          <span>{upcoming.length} Upcoming</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Completed Appointments */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <CheckCircle className="text-green-500" size={24} />
            Completed Appointments
          </h3>
          <div className="space-y-6">
            {completed.map((step) => (
              <div key={step.date} className="flex items-start gap-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-green-300">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-gray-800">
                      {new Date(step.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h4>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      Completed
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{step.summary}</p>
                  {step.diagnosis && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-sm font-bold text-blue-700 mb-1">Doctor's Diagnosis:</p>
                      <p className="text-gray-700">{step.diagnosis}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Upcoming Appointments */}
        {upcoming.length > 0 ? (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Clock className="text-blue-500" size={24} />
              Upcoming Appointments
            </h3>
            <div className="space-y-6">
              {upcoming.map((step) => (
                <div key={step.date} className="flex items-start gap-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-gray-800">
                        {new Date(step.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h4>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        Scheduled
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{step.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      
      {upcoming.length === 0 && (
        <div className="mt-10 text-center py-10 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
          <h3 className="text-xl font-bold text-indigo-800 mb-2">All appointments completed!</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            You've completed all scheduled appointments. Schedule a new checkup to continue monitoring your health.
          </p>
          <button 
            className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-lg hover:shadow-indigo-300 flex items-center gap-2 mx-auto"
            onClick={onSchedule}
          >
            <Plus size={20} />
            Schedule New Appointment
          </button>
        </div>
      )}
    </div>
  );
}