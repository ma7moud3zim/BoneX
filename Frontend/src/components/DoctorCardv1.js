import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalComponent from './ModalComponent';
function DoctorCardv1({ doctor }) {
  const rating = doctor.rating !== undefined ? doctor.rating : 0;
const [isModalopen, setIsModalOpen] = useState(false);

  const renderStars = () => {
    const fullStars = Math.round(rating);
    return Array(5)
      .fill(0)
      .map((_, i) => {
        const starClass = i < fullStars ? 'text-yellow-400' : 'text-gray-300';
        return (
          <svg
            key={i}
            className={`w-4 h-4 ${starClass}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.463a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.351 2.52c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.642 9.397c-.783-.57-.38-1.81.589-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
          </svg>
        );
      });
  };
const handleBook=()=>{
setIsModalOpen(true);


}
const handleClose = () => setIsModalOpen(false);
  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
      <img
        src={`http://bonex.runasp.net${doctor.profilePicture}`}
        alt={doctor.fullName}
        className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-gray-200"
      />
      <div className="text-center flex-grow">
        <h3 className="text-lg font-semibold text-black-700">{doctor.fullName}</h3>
        <p className="text-sm text-gray-600">{doctor.speciality}</p>
        <div className="flex items-center justify-center mt-2">
          {renderStars()}
          <span className="text-xs text-gray-500 ml-2">{rating.toFixed(1)}</span>
        </div>
        <p className="text-sm text-gray-700 mt-2 line-clamp-2">{doctor.brief}</p>
      </div>
      <div className="mt-auto flex items-center justify-around pt-4 border-t border-gray-200">
        <Link
          to={`/doctorprofile/${doctor.id}`}
          className="bg-[#287DA5] text-white px-6 py-3 text-sm rounded hover:bg-[#071952] transition duration-300"
        >
          View Detail
        </Link>
        <button
          className="bg-[#37B7C3] text-white px-6 py-3 text-sm rounded hover:bg-[#287DA5] transition duration-300"
          onClick={ handleBook}
        >
          Book Only
        </button>
      </div>
      {(<ModalComponent isopen={isModalopen} handleClose={handleClose} doctorid={doctor.id}/>)}
      
    </div>
  );
}

export default DoctorCardv1;