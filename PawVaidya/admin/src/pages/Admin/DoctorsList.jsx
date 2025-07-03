import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { doctors, atoken, getalldoctors, changeavailablity, deleteDoctor } = useContext(AdminContext)
  const [deletingDoctorId, setDeletingDoctorId] = useState(null)
  
  // Separate available and not available doctors
  const getDoctorsByAvailability = (isAvailable) => {
    return doctors.filter((doctor) => doctor.available === isAvailable)
  }
  
  useEffect(() => {
    if (atoken) {
      getalldoctors()
    }
  }, [atoken])
  
  // Calculate counts
  const availableDoctors = getDoctorsByAvailability(true)
  const notAvailableDoctors = getDoctorsByAvailability(false)

  // Handle doctor deletion with loading state
  const handleDeleteDoctor = async (doctorId) => {
    setDeletingDoctorId(doctorId)
    await deleteDoctor(doctorId)
    setDeletingDoctorId(null)
  }
  
  // Loading animation component
  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-4 border-t-green-500 border-r-transparent border-b-emerald-500 border-l-transparent animate-spin"></div>
        <p className="mt-3 text-sm font-medium text-gray-700">Deleting...</p>
      </div>
    </div>
  )

  // Doctor card component to avoid repetition
  const DoctorCard = ({ doctor, isAvailable }) => {
    const isDeleting = deletingDoctorId === doctor._id
    
    return (
      <div className={`relative border ${isAvailable ? 'border-emerald-200' : 'border-red-200'} rounded-xl max-w-56 overflow-hidden cursor-pointer group`}>
        {isDeleting && <LoadingSpinner />}
        <img 
          className={`${isAvailable ? 'bg-green-50 group-hover:bg-green-100' : 'bg-red-50 group-hover:bg-red-100'} transition-all duration-500`} 
          src={doctor.image} 
          alt="" 
        />
        <div className='p-4'>
          <p className='text-neutral-800 text-lg font-medium'>{doctor.name}</p>
          <p className='text-zinc-600 text-sm'>{doctor.speciality}</p>
          <p className='text-zinc-600 text-xs'>{doctor.email}</p>
          <p className='text-zinc-600 text-xs'>+91 {doctor.docphone}</p>
          <div className='mt-2 flex items-center gap-1 text-sm'>
            <input 
              onChange={() => changeavailablity(doctor._id)} 
              type="checkbox" 
              checked={doctor.available} 
              disabled={isDeleting}
            />
            <p>Available</p>
          </div>
          <button
            onClick={() => handleDeleteDoctor(doctor._id)}
            disabled={isDeleting}
            className={`mt-2 w-full py-1 rounded transition-colors ${
              isDeleting 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors 🐿️</h1>
      <div className='pt-5'>
        <h2 className='text-md font-semibold'>
          Available Doctors ({availableDoctors.length})
        </h2>
        <div className='w-full flex flex-wrap gap-4 pt-2 gap-y-6'>
          {availableDoctors.map((doctor, index) => (
            <DoctorCard 
              key={doctor._id || index} 
              doctor={doctor} 
              isAvailable={true} 
            />
          ))}
        </div>
      </div>
      <div className='pt-5'>
        <h2 className='text-md font-semibold'>
          Not Available Doctors ({notAvailableDoctors.length})
        </h2>
        <div className='w-full flex flex-wrap gap-4 pt-2 gap-y-6'>
          {notAvailableDoctors.map((doctor, index) => (
            <DoctorCard 
              key={doctor._id || index} 
              doctor={doctor} 
              isAvailable={false} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorsList