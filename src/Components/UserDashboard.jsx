import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../redux/actions';
import { useNavigate } from 'react-router-dom';

const UserDashoard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.userData);
    console.log(userData);
    let token = userData.token;
    let userId = userData.userId;
    console.log(token, userId);

    //==========================instructor create================================
    const [createInstructorBox, setCreateInstructorBox] = useState(false);

    const [instructor, setInstructor] = useState({
        name: '',
        email: '',
        password: ''
    });
    console.log(instructor);

    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        password: ''
    });

    function validateForm() {
        let valid = true;
        const errors = {};
        console.log(errors)

        if (!instructor.name.trim() || /\d/.test(instructor.name)) {
            errors.name = 'Name is required and should not contain numbers';
            valid = false;
        }

        if (!instructor.email.trim()) {
            errors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(instructor.email)) {
            errors.email = 'Invalid email address';
            valid = false;
        }

        if (!instructor.password.trim()) {
            errors.password = 'Password is required';
            valid = false;
        } else if (
            !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}/.test(instructor.password)) {
            errors.password = 'Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character';
            valid = false;
        }


        setFormErrors(errors);
        return valid;
    }

    function createAccount() {

        if (!validateForm()) {
            return;
        }

        console.log(instructor);
        localStorage.setItem('instructor', JSON.stringify(instructor));

        fetch(`http://localhost:3000/signupInstructor/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(instructor),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                if (result.status === true) {
                    setErrorMessage('');
                    setTimeout(() => {
                        setSuccessMessage(`${result.data.name} Registered successfully!`);
                    }, 3000);
                }
                else {
                    setErrorMessage('this is already registered. Please choose a different.');
                    setSuccessMessage('');
                }
            })
            .catch((error) => {
                console.error('error', error);
            });
    }

    const handleInputChangeToCreate = (e) => {
        const { name, value } = e.target;
        setInstructor((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log(name, value);
    };

    const createInstructor = () => {
        setCreateInstructorBox(true)
        setShowBox(false);
        setShowAllLectures(false)
        setShowAllLectures(false)
        setShowMeetings(false);
        setShowEditModal(false);
        setDefaultScreen(false)

    }


    //=====================================================================================


    const [showBox, setShowBox] = useState(false);
    const [showMeetings, setShowMeetings] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showAllLectures, setShowAllLectures] = useState('');


    const [allCourseData, setAllCourseData] = useState([]);
    const [allInstructorData, setAllInstructorData] = useState([]);
    const [showingAllLectures, setShowingAllLectures] = useState([]);


    const [showEditModal, setShowEditModal] = useState(false);
    const [editMeetingId, setEditMeetingId] = useState('');
    const [defaultScreen, setDefaultScreen] = useState(true);

    console.log(allInstructorData)

    const [editFormData, setEditFormData] = useState({
        name: "",
        email: "",
        time: "",
        date: "",
        topic: ""
    });

    const [formData, setFormData] = useState({
        name: "",
        level: "",
        description: "",
        image: null
    })
    console.log("formData ", formData)


    useEffect(() => {

        fetch(`http://localhost:3001/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === true) {
                    const allData = result.data;
                    setAllCourseData(allData);
                    setErrorMessage('')
                } else {
                    setErrorMessage('Failed to fetch UserData data');
                }
            })
            .catch((error) => {
                console.error('error', error);
            });

        fetch(`http://localhost:3001/meetings/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === true) {
                    const allData = result.data;
                    setAllInstructorData(allData);
                    setErrorMessage('')
                }
                if (result.status === false) {
                    console.log("data deleted ")
                    setAllInstructorData([])
                }
            })
            .catch((error) => {
                console.error('error', error);
            });

    }, [userId, token]);

    const addedNewCourse = () => {
        console.log("formData", formData);
    
        const formData2 = new FormData();
        formData2.append('name', formData.name);
        formData2.append('level', formData.level);
        formData2.append('description', formData.description);
        formData2.append('image', formData.image);
    
        console.log("some         ", formData.name);
        console.log("some         ", formData.level);
        console.log("some         ", formData.description);
        console.log("some         ", formData.image);
    
        console.log("some         ", formData2);
    
        fetch(`http://localhost:3000/course/${userId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData2,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((result) => {
            console.log("result ", result);
            if (result.status === true) {
                console.log("course added");
                setFormData({
                    name: "",
                    level: "",
                    description: "",
                    image: null,
                });
                setErrorMessage('');
                setSuccessMessage("Course Added !!!");
            } else {
                setErrorMessage('Course Cannot be added !!!');
                setSuccessMessage('');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    
    
    
    

    const showInstructors = () => {
        setShowMeetings(true);
        setShowBox(false);
        setShowAllLectures(false)
        setCreateInstructorBox(false);
        setShowEditModal(false);
        setDefaultScreen(false)


        fetch(`http://localhost:3000/instructors/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === true) {
                    console.log("instructors    ",result)
                    const allData = result.data;
                    setAllInstructorData(allData);
                    setErrorMessage('')
                }
                if (result.status === false) {
                    console.log("data")
                    setAllInstructorData([])
                }
            })
            .catch((error) => {
                console.error('error', error);
            });

    }

    const showLectures = () => {
        setShowAllLectures(true)
        setShowMeetings(false);
        setShowBox(false);
        setCreateInstructorBox(false);
        setShowEditModal(false);
        setDefaultScreen(false)


        fetch(`http://localhost:3000/lectures/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === true) {
                    const allData = result.data;
                    setShowingAllLectures(allData);
                    setErrorMessage('')
                }
                if (result.status === false) {
                    console.log("data deleted ")
                    setShowingAllLectures([])
                }
            })
            .catch((error) => {
                console.error('error', error);
            });

    }

    const Assign = (lecturerId) => {
        fetch(`http://localhost:3000/assignLecture/${userId}/${lecturerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editFormData),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log("result ", result)
                if (result.status === true) {
                    console.log(" Updated")
                    setEditFormData({
                        name: "",
                        email: "",
                        time: "",
                        date: "",
                        topic: ""
                    });
                    setErrorMessage('');
                    setSuccessMessage(" Updated !!!");
                }
                else {
                    setErrorMessage(' Already Scheduled');
                    setSuccessMessage('');
                }
            })
            .catch((error) => {
                console.error('error', error);
            });
    }

    const deleteMeet = (meetingId) => {
        console.log("meeting", meetingId);
        fetch(`http://localhost:3001/meetings/${userId}/${meetingId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((result) => {
                console.log("result", result);
                if (result.status === true) {
                    setErrorMessage('');
                    setSuccessMessage("Meeting Deleted !!!");
                    setAllInstructorData((prevData) =>
                        prevData.filter((meet) => meet._id !== meetingId)
                    );
                } else {
                    setSuccessMessage('');
                }
            })
            .catch((error) => {
                console.error("error", error);
            });
    };

    const AddMeeting = () => {
        setShowBox(true);
        setShowAllLectures(false)
        setCreateInstructorBox(false)
        setShowMeetings(false);
        setShowEditModal(false);
        setDefaultScreen(false)

    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log(name, value);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;

        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const openEditModal = (lecturerId, user) => {
        setShowEditModal(true);
        setShowMeetings(false);
        setDefaultScreen(false);
        setShowBox(false);
        setShowAllLectures(false)
        setCreateInstructorBox(false);

        fetch(`http://localhost:3000/course/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === true) {
                    const allData = result.data;
                    setAllCourseData(allData);
                    setErrorMessage('')
                } else {
                    setErrorMessage('Failed to fetch UserData data');
                }
            })
            .catch((error) => {
                console.error('error', error);
            });


        setEditMeetingId(lecturerId);
        setEditFormData({
            name: user.name,
            email: user.email,
            time: user.time,
            date: user.date,
            topic: ''
        });
    };

    const logout = () => {
        console.log("logout")
        dispatch(logoutAction());
        navigate('/');
    }

    const closeEditModal = () => {
        setShowEditModal(false);
        setShowMeetings(true);
        setEditMeetingId('');
        setEditFormData({
            time: '',
            date: '',
        });
    };

    const handleImageChange = (files) => {
        console.log("Selected image:", files[0]);
        setFormData((prevData) => ({
            ...prevData,
            image: files[0],
        }), () => {
            console.log("Updated formData:", formData);
        });
    };
    
    
    


    return (
        <div>
            <div className='flex'>

                <div className='ml-20 mt-20 w-1/5 flex flex-col h-screen m-3 border-blue-100 rounded-md border-2 shadow-xl'>

                    <button className='m-10 ml-10 p-3 text-center rounded-md rouded-md border-2 border-green-200  shadow-xl text-xl font-bold' onClick={createInstructor} >createInstructor </button>
                    <button className='m-10 ml-10 p-3 text-center rounded-md rouded-md border-2 border-green-200  shadow-xl text-xl font-bold' onClick={AddMeeting} >Add Courses + </button>
                    <button className='m-10 ml-10 p-3 text-center rounded-md rouded-md border-2 border-green-200  shadow-xl text-xl font-bold' onClick={showInstructors} >All Instructors </button>
                    <button className='m-10 ml-10 p-3 text-center rounded-md rouded-md border-2 border-green-200  shadow-xl text-xl font-bold' onClick={showLectures} >All Lectures </button>
                    <button className='m-10 ml-10 p-3 text-center rounded-md rouded-md border-2 border-green-200  shadow-xl text-xl font-bold' onClick={logout} >Logout </button>

                </div>


                <div className='m-3 border-blue-100 rounded-md ml-20 mt-20'>
                    <div className="flex justify-center ml-20 h-screen">

                        {defaultScreen && (
                            <div className="m-5 w-full  rounded-md  shadow-lg ">
                                {allInstructorData.map((meet) => (
                                    <div key={meet._id} className="p-3 bg-white border-2 border-blue-200  shadow-xl m-5 rounded-md  w-full">
                                        <div className='flex'>
                                            <div>
                                                <p className="text-2xl font-extrabold mb-2 text-blue-600">Meet Title: {meet.title}</p>
                                                <p className="text-lg font-bold mb-2">Meet Organized By: {meet.conductedBy}</p>
                                                <p className="text-lg font-bold mb-2">Meet with: {meet.meetWith}</p>
                                                <p className="text-lg font-bold mb-2">Meet Date: {meet.date}</p>
                                                <p className="text-lg font-bold mb-2">Meet Time: {meet.time}</p>
                                            </div>
                                            <button
                                                className="mt-20 ml-20 h-10 w-1/6 text-white border-2 rounded-full bg-green-600"
                                                onClick={() => openEditModal(meet._id, meet)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className='w-1/6 h-10 mt-20 ml-10 rounded-full bg-red-500 border-2 text-white'
                                                onClick={() => deleteMeet(meet._id)}
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {showBox && (
                            <div className='p-3 bg-white  m-5 text-center rounded-md'>
                                <div>{errorMessage && (
                                    <div className="mt-10 mb-10 text-red-500 font-bold text-center">{errorMessage}</div>
                                )}</div>
                                <div>{successMessage && (
                                    <div className="mt-10 mb-10 text-green-500 font-bold text-center">{successMessage}</div>
                                )}</div>
                                <div className='border-2 border-blue-200 rounded-md shadow-xl'>
                                    <p className='font-bold text-2xl mt-5 mb-5 text-blue-600 underline shadow-lg p-3 bg-white rounded-md'>  Add New Course</p>
                                    <hr />
                                    <input type="text"
                                        name="name"
                                        value={formData.name}
                                        className='mt-10 box-content h-1 w-1/2 p-4 border-2 border-black rounded-md '
                                        placeholder='Course Name'
                                        onChange={handleInputChange}
                                    />

                                    <input type="text"
                                        name="level"
                                        value={formData.level}
                                        className='mt-5 box-content h-1 w-1/2 p-4 border-2 border-black rounded-md'
                                        placeholder='Level'
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        className='mt-5 box-content h-1 w-1/2 p-4 border-2 border-black rounded-md'
                                        placeholder='Description'
                                        onChange={handleInputChange}
                                    />


                                    <input
                                        type="file"
                                        accept="image/*"
                                        name="image"
                                        onChange={(e) => handleImageChange(e.target.files)}
                                        className='mt-5 box-content h-1 w-1/2 p-4 mb-20  rounded-md'
                                    />
                                    {formData.image && (
                                        <div className="font-bold font-xl mt-3 box-content h-1 p-4 border-2 rounded-md mb-20">
                                            Selected Image: {formData.image.name}
                                        </div>
                                    )}




                                    <button className='box-content w-1/2 p-4 border-2 rounded-md mb-10 text-center font-bold bg-green-500' onClick={addedNewCourse}>
                                        Add Course
                                    </button>
                                </div>

                            </div>

                        )}

                        {createInstructorBox && (
                            <div>
                                <div className='text-center'>
                                    <h1 className='text-center mt-10 text-3xl font-extrabold '>Create Sign Up for Instructor</h1>


                                    <input
                                        type="text"
                                        name="name"
                                        className='mt-5 box-content h-1 w-1/2 p-4 border-2 '
                                        placeholder='Name'
                                        onChange={handleInputChangeToCreate}
                                        value={instructor.name}
                                        required
                                    />
                                    {formErrors.name && <div className="text-red-500 mt-2">{formErrors.name}</div>}


                                    <input
                                        type="text"
                                        name="email"
                                        className='mt-5 box-content h-1 w-1/2 p-4 border-2 '
                                        placeholder='Email'
                                        value={instructor.email}
                                        onChange={handleInputChangeToCreate}
                                        required
                                    />

                                    <input
                                        type='password'
                                        name="password"
                                        className='mt-5 box-content h-1 w-1/2 p-4 border-2 '
                                        placeholder='Password'
                                        value={instructor.password}
                                        onChange={handleInputChangeToCreate}
                                        required
                                    />

                                    {formErrors.password && <div className="text-red-500 mt-2">{formErrors.password}</div>}

                                    {formErrors.email && <div className="text-red-500 mt-2">{formErrors.email}</div>}

                                    <button className='mt-10 h-10 w-1/2 text-white border-2 rounded-full bg-blue-900' onClick={createAccount}>Create Account</button>

                                    {errorMessage && (
                                        <div className="text-red-500 mt-2">
                                            {errorMessage}
                                        </div>
                                    )}
                                    {successMessage && (
                                        <h1 className="text-green-500 mt-2 font-bold text-m">
                                            {successMessage}
                                        </h1>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className=" min-h-screen">

                            {showAllLectures && (
                                <div className="m-5 w-full  rounded-md  shadow-lg ">
                                {showingAllLectures.map((user) => (
                                    <div key={user._id} className="p-3 bg-white border-2 border-blue-200 shadow-xl m-5 rounded-md w-full">
                                        <div className='flex'>
                                            <div>
                                                <p className="text-lg font-bold mb-2">Name: {user.name}</p>
                                                <p className="text-lg font-bold mb-2">Email: {user.email}</p>


                                                {user.topic !== undefined && (
                                                    <>
                                                        {user.topic && <p className="text-lg font-bold mb-2">Topic: {user.topic}</p>}
                                                        {user.time !== 'NaN' && <p className="text-lg font-bold mb-2">Time: {user.time}</p>}
                                                        {user.date && <p className="text-lg font-bold mb-2">Date: {user.date}</p>}
                                                    </>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                ))}


                            </div>
                            )}            

                            {showMeetings && (
                                <div className="m-5 w-full  rounded-md  shadow-lg ">
                                    {allInstructorData.map((user) => (
                                        <div key={user._id} className="p-3 bg-white border-2 border-blue-200 shadow-xl m-5 rounded-md w-full">
                                            <div className='flex'>
                                                <div>
                                                    <p className="text-lg font-bold mb-2">Name: {user.name}</p>
                                                    <p className="text-lg font-bold mb-2">Email: {user.email}</p>

                                                </div>
                                                <button
                                                    className="mt-20 ml-20 h-10 w-1/3 text-white border-2 rounded-full bg-green-600"
                                                    onClick={() => openEditModal(user._id, user)}
                                                >
                                                    Assign Lecture
                                                </button>
                                            </div>
                                        </div>
                                    ))}


                                </div>
                            )}

                            {showEditModal && (
                                <div className='p-3 bg-white  m-5 text-center rounded-md'>
                                    <div>{errorMessage && (
                                        <div className="mt-10 mb-10 text-red-500 font-bold text-center">{errorMessage}</div>
                                    )}</div>
                                    <div>{successMessage && (
                                        <div className="mt-10 mb-10 text-green-500 font-bold text-center">{successMessage}</div>
                                    )}</div>
                                    <div className='border-2 border-blue-200 rounded-md shadow-xl'>
                                        <p className='font-bold text-2xl mt-5 mb-5 text-blue-600 underline shadow-lg p-3 bg-white rounded-md'>  Assign</p>
                                        <hr />
                                        <input type="text"
                                            name="name"
                                            value={editFormData.name}
                                            className='mt-10 box-content h-1 w-1/2 p-4 border-2 border-black rounded-md '
                                            placeholder='name'
                                            onChange={handleEditInputChange}
                                            disabled
                                        />
                                        <input
                                            type="text"
                                            name="email"
                                            value={editFormData.email}
                                            className='mt-5 box-content h-1 w-1/2 p-4 border-2 border-black rounded-md'
                                            placeholder='email'
                                            onChange={handleEditInputChange}
                                            disabled
                                        />

                                        <input type="time"
                                            name="time"
                                            value={editFormData.time}
                                            className='mt-5 box-content h-1 w-1/2 p-4 border-2 border-black rounded-md'
                                            placeholder='Meeting Time'
                                            onChange={handleEditInputChange}
                                        />
                                        <input
                                            type="date"
                                            name="date"
                                            value={editFormData.date}
                                            className='mt-5 box-content h-1 w-1/2 p-4 border-2 border-black rounded-md'
                                            placeholder='Meeting Date'
                                            onChange={handleEditInputChange}
                                        />

                                        <select
                                            className='mt-5 box-content h-1 w-1/2 p-4 border-2 border-black rounded-md '
                                            name="topic"
                                            value={editFormData.topic}
                                            onChange={handleEditInputChange}
                                        >
                                            <option value="" >Select an email</option>
                                            {allCourseData.map((user) =>
                                                user._id !== userId ? (
                                                    <option key={user._id} value={user.name}>
                                                        {user.name}
                                                    </option>
                                                ) : null
                                            )}
                                        </select>

                                        <div>
                                            {editFormData.topic && (
                                                <div className="font-bold font-xl mt-3 box-content h-1  p-4 border-2 rounded-md mb-20">
                                                    Selected Topic: {editFormData.topic}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-center mt-20">

                                            <button className='mr-10 box-content w-1/5 p-2 border-2 rounded-md mb-10 text-center font-bold bg-green-500' onClick={() => Assign(editMeetingId)}>
                                                Assign
                                            </button>
                                            <button className='box-content w-1/5 p-2 border-2 rounded-md mb-10 text-center font-bold bg-green-500' onClick={closeEditModal}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                    <p className='mt-10 text-red-500 '>( Meeting time is 1 hour Default )</p>
                                </div>

                            )}
                        </div>
                    </div>
                </div>





            </div>
        </div>


    )

}
export default UserDashoard;
