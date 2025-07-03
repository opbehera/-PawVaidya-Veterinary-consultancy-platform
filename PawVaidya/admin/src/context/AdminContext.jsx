import { createContext, useCallback, useState } from "react";
import axios  from "axios";
import { toast } from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [atoken , setatoken] = useState(localStorage.getItem('atoken') ? localStorage.getItem('atoken') : '')
    const [doctors , setdoctors] = useState([])
    const [users , setusers] = useState([])
    const [appointments , setappointments] = useState([])
    const [dashdata , setdashdata] = useState(false)

    const backendurl = import.meta.env.VITE_BACKEND_URL

    const getalldoctors = async () => {
        try {
            const {data} = await axios.post(backendurl + '/api/admin/all-doctors' , {} , {headers:{atoken}})
            if(data.success){
                setdoctors(data.doctors)
                console.log(data.doctors)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const getallusers = async () => {
        try {
            const {data} = await axios.get(backendurl + '/api/admin/all-users' , {headers:{atoken}})
            if(data.success){
                setusers(data.users)
                console.log(data.users)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeavailablity = async (docId) => {
        try {
            const { data } = await axios.post(backendurl + '/api/admin/change-availablity' , {docId} , {headers:{atoken}})
            if(data.success){
                toast.success(data.message)
                getalldoctors()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getallappointments = useCallback(async () => {
        try {
            const { data } = await axios.get(`${backendurl}/api/admin/appointments`, {
                headers: { atoken },
            });
            if (data.success) {
                setappointments(data.appointments);
                console.log(data.appointments)
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [atoken, setappointments]);

    const cancelappointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendurl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { atoken } })

            if (data.success) {
                toast.success(data.message)
                getallappointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }
    const getdashdata = async () => {
        try {
            const { data } = await axios.get(backendurl + '/api/admin/dashboard' , {headers : {atoken}})
            if(data.success){
                setdashdata(data.dashdata)
                console.log(data.dashdata)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    // Edit user function
    const editUser = async (userId, userData, userImage = null) => {
        try {
            // Create form data if there's an image
            let formData;
            if (userImage) {
                formData = new FormData();
                // Add all user data to form data
                Object.keys(userData).forEach(key => {
                    formData.append(key, userData[key]);
                });
                // Add image to form data
                formData.append('image', userImage);
            }
            
            const { data } = await axios.put(
                `${backendurl}/api/admin/users/${userId}`,
                userImage ? formData : userData,
                {
                    headers: { 
                        atoken,
                        ...(userImage ? { 'Content-Type': 'multipart/form-data' } : {})
                    }
                }
            );
            
            if (data.success) {
                toast.success(data.message);
                // Update users state by replacing the edited user
                setusers(users.map(user => 
                    user._id === userId ? data.user : user
                ));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update user');
            console.error(error);
        }
    };

        // Delete user function
        const deleteUser = async (userId) => {
            try {
                // Confirmation before deleting
                if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                    return;
                }
                
                const { data } = await axios.delete(`${backendurl}/api/admin/users/${userId}`, {
                    headers: { atoken }
                });
                
                if (data.success) {
                    toast.success(data.message);
                    // Update users state by removing the deleted user
                    setusers(users.filter(user => user._id !== userId));
                    // Update dashboard data if needed
                    getdashdata();
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message || 'Failed to delete user');
                console.error(error);
            }
        };
        const deleteDoctor = async (doctorId) => {
            try {
                // Confirmation before deleting
                if (!window.confirm('Are you sure you want to delete this doctor? This will also remove all associated appointments.')) {
                    return;
                }
                
                const { data } = await axios.delete(`${backendurl}/api/admin/doctors/${doctorId}`, {
                    headers: { atoken }
                });
                
                if (data.success) {
                    toast.success(data.message);
                    // Update doctors state by removing the deleted doctor
                    setdoctors(doctors.filter(doctor => doctor._id !== doctorId));
                    // Update dashboard data since doctor count and appointments may have changed
                    getdashdata();
                    // Refresh appointments list since some may have been deleted
                    getallappointments();
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message || 'Failed to delete doctor');
                console.error(error);
            }
        };
    
    

    const value = {
        atoken , setatoken , 
        backendurl , doctors,
        getalldoctors,changeavailablity,
        appointments,setappointments,
        getallappointments,cancelappointment,
        dashdata , getdashdata , getallusers , setusers,
        users , deleteUser, editUser , deleteDoctor
    }

    return (
        <AdminContext.Provider value = {value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider