import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContextProvider";
import { toast } from "react-hot-toast";
import { IconEdit } from '@tabler/icons-react';

export default function AdminDashboard() {
    const [activeSubject, setActiveSubject] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [addSubjectModal, setAddSubjectModal] = useState(false);
    const [addDepartmentModal, setAddDepartmentModal] = useState(false);
    const { authUser } = useAuthContext();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await fetchStudent();
            await fetchInstructors();
            await fetchSubjects();
            await fetchDepartments();
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const fetchStudent = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/fetchStudents`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                setStudents(data.students);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchInstructors = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/fetchInstructors`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                setInstructors(data.teachers);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/fetchSubjects`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                setSubjects(data.subjects);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/fetchDepartments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                console.log("departments:", data.departments);
                setDepartments(data.departments);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (addSubjectModal) {
        return <AddSubjectModal fetchSubjects={fetchSubjects} authUser={authUser} setAddSubjectModal={setAddSubjectModal} />;
    }

    if (addDepartmentModal) {
        return <AddDepartmentModal fetchDepartments={fetchDepartments} authUser={authUser} setAddDepartmentModal={setAddDepartmentModal} />;
    }

    return (
        <div className="flex-1 bg-[#f5f5f5] p-8 md:p-12 lg:p-16">
            <div className="max-w-6xl mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold IBM_Plex_Mono">Welcome, {authUser.name}</h1>
                    <div className="flex items-center gap-4">
                        <button
                            className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors"
                            onClick={() => {
                                localStorage.removeItem("user-token");
                                toast.success("Logged out successfully");
                                setTimeout(() => {
                                    window.location.href = "/login";
                                }, 500);
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-1 gap-8">
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Enrolled Students</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">Manage enrolled students in your subjects</p>
                        </div>
                        <div className="border-t px-6 py-4 IBM_Plex_Mono">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Student List</h3>
                            </div>
                            <div className="overflow-x-auto max-h-[250px] mt-4">
                                <table className="w-full text-sm IBM_Plex_Mono">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2 font-bold">User ID</th>
                                            <th className="text-left px-4 py-2 font-bold">Student ID</th>
                                            <th className="text-left px-4 py-2 font-bold">Name</th>
                                            <th className="text-left px-4 py-2 font-bold">Email</th>
                                            <th className="text-left px-4 py-2 font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!fetchLoading && students.length === 0 && activeSubject !== "" ? (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    No students enrolled in this subject
                                                </td>
                                            </tr>
                                        ) : (
                                            students.map((student) => (
                                                <StudentRow student={student} fetchStudent={fetchStudent} activeSubject={activeSubject} authUser={authUser} />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Instructors</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">Manage Instructors</p>
                        </div>
                        <div className="border-t px-6 py-4 IBM_Plex_Mono">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Instructor List</h3>
                            </div>
                            <div className="overflow-x-auto max-h-[250px] mt-4">
                                <table className="w-full text-sm IBM_Plex_Mono">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2 font-bold">User ID</th>
                                            <th className="text-left px-4 py-2 font-bold">Instructor ID</th>
                                            <th className="text-left px-4 py-2 font-bold">Name</th>
                                            <th className="text-left px-4 py-2 font-bold">Email</th>
                                            <th className="text-left px-4 py-2 font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!fetchLoading && students.length === 0 && activeSubject !== "" ? (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    No students enrolled in this subject
                                                </td>
                                            </tr>
                                        ) : (
                                            instructors.map((student) => <TeacherRow teacher={student} fetchInstructors={fetchInstructors} authUser={authUser} />)
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Subjects</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">Manage Subjects</p>
                        </div>
                        <div className="border-t px-6 py-4 IBM_Plex_Mono">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Instructor List</h3>
                                <button onClick={() => setAddSubjectModal(true)} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                    Add Subject
                                </button>
                            </div>
                            <div className="overflow-x-auto max-h-[250px] mt-4">
                                <table className="w-full text-sm IBM_Plex_Mono">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2 font-bold">Course ID</th>
                                            <th className="text-left px-4 py-2 font-bold">Name</th>
                                            <th className="text-left px-4 py-2 font-bold">Description</th>
                                            <th className="text-left px-4 py-2 font-bold">Department</th>
                                            <th className="text-left px-4 py-2 font-bold">Faculty</th>
                                            <th className="text-left px-4 py-2 font-bold">Credits</th>
                                            <th className="text-left px-4 py-2 font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!fetchLoading && students.length === 0 && activeSubject !== "" ? (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    No students enrolled in this subject
                                                </td>
                                            </tr>
                                        ) : (
                                            subjects.map((student) => <SubjectRow subject={student} fetchSubjects={fetchSubjects} authUser={authUser} />)
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Departments</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">Manage Departments</p>
                        </div>
                        <div className="border-t px-6 py-4 IBM_Plex_Mono">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Department List</h3>
                                <button onClick={() => setAddDepartmentModal(true)} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                    Add Dept
                                </button>
                            </div>
                            <div className="overflow-x-auto max-h-[250px] mt-4">
                                <table className="w-full text-sm IBM_Plex_Mono">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2 font-bold">Dept ID</th>
                                            <th className="text-left px-4 py-2 font-bold">Name</th>
                                            <th className="text-left px-4 py-2 font-bold">HOD ID</th>
                                            <th className="text-left px-4 py-2 font-bold">HOD</th>
                                            <th className="text-left px-4 py-2 font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departments.map((student) => (
                                            <DeptRow department={student} fetchDepartments={fetchDepartments} authUser={authUser} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StudentRow = ({ student, fetchStudent, authUser }) => {
    const [loading, setLoading] = useState(false);
    const [editModal, setEditModal] = useState(false);

    if (editModal) {
        return <EditStudentModal fetchStudent={fetchStudent} student={student} authUser={authUser} setEditModal={setEditModal} />;
    }

    return (
        <tr className="border-b">
            <td className="px-4 py-3">{student[0]}</td>
            <td className="px-4 py-3">{student[1]}</td>
            <td className="px-4 py-3">{student[2] + " " + student[3]}</td>
            <td className="px-4 py-3">{student[4]}</td>

            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        {!loading ? (
                            <button onClick={() => setEditModal(true)} className="bg-white text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                                <IconEdit size={20} />
                                
                            </button>
                        ) : (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

const EditStudentModal = ({ student, fetchStudent, authUser, setEditModal }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        user_id: student[0],
        studentId: student[1],
        first_name: student[2],
        last_name: student[3],
        email: student[4],
    });

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setEditModal(false);
            }
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setEditModal(false);
                }
            });
        };
    }, []);

    const handleUpdateStudent = async () => {
        setLoading(true);
        console.log(formData);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/updateRoll`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                toast.success("Student updated successfully");
                fetchStudent();
            }
        } catch (error) {
            console.log(error);
        }
        setEditModal(false);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                {loading ? (
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                ) : (
                    <>
                        <h3 className="text-lg font-medium">Edit Student</h3>
                        <span className="block text-gray-700 font-bold mb-2">Student ID: {formData.studentId}</span>
                        <span className="block text-gray-700 font-bold mb-2">First name:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="first_name"
                            type="text"
                            placeholder="Enter first name"
                            onChange={handleInputChange}
                            value={formData.first_name}
                        />
                        <span className="block text-gray-700 font-bold mb-2">Last name:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="last_name"
                            type="text"
                            placeholder="Enter last name"
                            onChange={handleInputChange}
                            value={formData.last_name}
                        />
                        <span className="block text-gray-700 font-bold mb-2">Email:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="text"
                            placeholder="Enter email"
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={handleUpdateStudent} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Update Student
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const TeacherRow = ({ teacher, fetchInstructors, authUser }) => {
    const [loading, setLoading] = useState(false);
    const [editModal, setEditModal] = useState(false);

    if (editModal) {
        return <EditTeacherModal fetchInstructors={fetchInstructors} teacher={teacher} authUser={authUser} setEditModal={setEditModal} />;
    }

    return (
        <tr className="border-b">
            <td className="px-4 py-3">{teacher[0]}</td>
            <td className="px-4 py-3">{teacher[1]}</td>
            <td className="px-4 py-3">{teacher[2] + " " + teacher[3]}</td>
            <td className="px-4 py-3">{teacher[4]}</td>

            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        {!loading ? (
                            <button onClick={() => setEditModal(true)} className="bg-white text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                                <IconEdit size={20} />
                                
                            </button>
                        ) : (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

const EditTeacherModal = ({ teacher, fetchInstructors, authUser, setEditModal }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        user_id: teacher[0],
        teacherId: teacher[1],
        first_name: teacher[2],
        last_name: teacher[3],
        email: teacher[4],
    });

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setEditModal(false);
            }
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setEditModal(false);
                }
            });
        };
    }, []);

    const handleUpdateStudent = async () => {
        setLoading(true);
        console.log(formData);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/updateInst`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                toast.success("Instructor updated successfully");
                fetchInstructors();
            }
        } catch (error) {
            console.log(error);
        }
        setEditModal(false);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                {loading ? (
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                ) : (
                    <>
                        <h3 className="text-lg font-medium">Edit Teacher</h3>
                        <span className="block text-gray-700 font-bold mb-2">Teacher ID: {formData.studentId}</span>
                        <span className="block text-gray-700 font-bold mb-2">First name:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="first_name"
                            type="text"
                            placeholder="Enter first name"
                            onChange={handleInputChange}
                            value={formData.first_name}
                        />
                        <span className="block text-gray-700 font-bold mb-2">Last name:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="last_name"
                            type="text"
                            placeholder="Enter last name"
                            onChange={handleInputChange}
                            value={formData.last_name}
                        />
                        <span className="block text-gray-700 font-bold mb-2">Email:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="text"
                            placeholder="Enter email"
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={handleUpdateStudent} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Update Instructor
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const SubjectRow = ({ subject, fetchSubjects, authUser }) => {
    const [loading, setLoading] = useState(false);
    const [editModal, setEditModal] = useState(false);

    if (editModal) {
        return <EditSubjectModal fetchSubjects={fetchSubjects} subject={subject} authUser={authUser} setEditModal={setEditModal} />;
    }

    return (
        <tr className="border-b">
            <td className="px-4 py-3">{subject[0]}</td>
            <td className="px-4 py-3">{subject[1]}</td>
            <td className="px-4 py-3">{subject[2]}</td>
            <td className="px-4 py-3">{subject[8] ? subject[8] : "None"}</td>
            <td className="px-4 py-3">{subject[3] ? subject[4] + " " + subject[5] : "None assigned"}</td>
            <td className="px-4 py-3">{subject[6]}</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        {!loading ? (
                            <button onClick={() => setEditModal(true)} className="bg-white text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                                <IconEdit size={20} />
                                
                            </button>
                        ) : (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

const EditSubjectModal = ({ subject, fetchSubjects, authUser, setEditModal }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subjectId: subject[0],
        name: subject[1],
        description: subject[2],
        instructorId: subject[3],
        deptId: subject[7],
        credits: subject[6],
    });

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setEditModal(false);
            }
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setEditModal(false);
                }
            });
        };
    }, []);

    const handleUpdateSubject = async () => {
        setLoading(true);
        console.log(formData);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/updateSubject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                toast.success("Subject updated successfully");
                fetchSubjects();
            }
        } catch (error) {
            console.log(error);
        }
        setEditModal(false);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                {loading ? (
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                ) : (
                    <>
                        <h3 className="text-lg font-medium">Edit Subject</h3>
                        <span className="block text-gray-700 font-bold mb-2">Subject ID: {formData.subjectId}</span>
                        <span className="block text-gray-700 font-bold mb-2">Subject Name:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Enter subject name"
                            onChange={handleInputChange}
                            value={formData.name}
                        />
                        <span className="block text-gray-700 font-bold mb-2">Subject Code:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="description"
                            type="text"
                            placeholder="Enter subject description"
                            onChange={handleInputChange}
                            value={formData.description}
                        />
                        <span className="block text-gray-700 font-bold mb-2">Instructor ID:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="instructorId"
                            type="number"
                            placeholder="Enter instructor ID"
                            onChange={handleInputChange}
                            value={formData.instructorId}
                        />
                        <span className="block text-gray-700 font-bold mb-2">Department ID:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="deptId"
                            type="number"
                            placeholder="Enter department ID"
                            onChange={handleInputChange}
                            value={formData.deptId}
                        />
                        <span className="block text-gray-700 font-bold mb-2">Credits:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="credits"
                            type="number"
                            placeholder="Enter credits"
                            onChange={handleInputChange}
                            value={formData.credits}
                        />

                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={handleUpdateSubject} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Update Subject
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const AddSubjectModal = ({ authUser, fetchSubjects, setAddSubjectModal }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        credits: "",
        deptId: 0,
    });

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setAddSubjectModal(false);
            }
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setAddSubjectModal(false);
                }
            });
        };
    }, []);

    const handleAddSubject = async () => {
        setLoading(true);
        console.log(formData);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/addSubject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                toast.success("Subject added successfully");
                fetchSubjects();
            }
            if (response.status === 400 || response.status === 500) {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
        setAddSubjectModal(false);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                {loading ? (
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                ) : (
                    <>
                        <h3 className="text-lg font-medium">Add Subject</h3>
                        <span className="block text-gray-700 font-bold mb-2">Subject Name:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Enter subject name"
                            onChange={handleInputChange}
                            value={formData.name}
                        />
                        <span className="block text-gray-700 font-bold mb-2">Subject Description:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="description"
                            type="text"
                            placeholder="Enter subject description"
                            onChange={handleInputChange}
                            value={formData.description}
                        />
                        <span className="block text-gray-700 font-bold mb-2">Credits:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="credits"
                            type="number"
                            placeholder="Enter credits"
                            onChange={handleInputChange}
                            value={formData.credits}
                        />
                        <span className="block text-gray-700 font-bold mb-2">Department ID:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="deptId"
                            type="number"
                            placeholder="Enter department ID"
                            onChange={handleInputChange}
                            value={formData.deptId}
                        />

                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={handleAddSubject} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Add Subject
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const DeptRow = ({ department, fetchDepartments, authUser }) => {
    const [loading, setLoading] = useState(false);
    const [editModal, setEditModal] = useState(false);

    if (editModal) {
        return <EditDeptModal fetchDepartments={fetchDepartments} department={department} authUser={authUser} setEditModal={setEditModal} />;
    }

    return (
        <tr className="border-b">
            <td className="px-4 py-3">{department[0]}</td>
            <td className="px-4 py-3">{department[1]}</td>
            <td className="px-4 py-3">{department[2] ? department[2] : "None"}</td>
            <td className="px-4 py-3">{department[3] ? department[3] + " " + department[4] : "None assigned"}</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        {!loading ? (
                            <button onClick={() => setEditModal(true)} className="bg-white text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                                <IconEdit size={20} />
                                
                            </button>
                        ) : (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

const EditDeptModal = ({ department, fetchDepartments, authUser, setEditModal }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        deptId: department[0],
        name: department[1],
        hodId: department[2],
    });

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setEditModal(false);
            }
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setEditModal(false);
                }
            });
        };
    }, []);

    const handleUpdateDept = async () => {
        setLoading(true);
        console.log(formData);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/updateDepartment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                toast.success("Department updated successfully");
                fetchDepartments();
            }
        } catch (error) {
            console.log(error);
        }
        setEditModal(false);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                {loading ? (
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                ) : (
                    <>
                        <h3 className="text-lg font-medium">Edit Department</h3>
                        <span className="block text-gray-700 font-bold mb-2">Department ID: {formData.deptId}</span>
                        <span className="block text-gray-700 font-bold mb-2">Department Name:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Enter department name"
                            onChange={handleInputChange}
                            value={formData.name}
                        />
                        <span className="block text-gray-700 font-bold mb-2">HOD ID:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="hodId"
                            type="number"
                            placeholder="Enter HOD ID"
                            onChange={handleInputChange}
                            value={formData.hodId}
                        />
                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={handleUpdateDept} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Update Department
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const AddDepartmentModal = ({ authUser, fetchDepartments, setAddDepartmentModal }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        hodId: "",
    });

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setAddDepartmentModal(false);
            }
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setAddDepartmentModal(false);
                }
            });
        };
    }, []);

    const handleAddDepartment = async () => {
        setLoading(true);
        console.log(formData);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/addDepartment`, {
                method: "POST",


                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                toast.success("Department added successfully");
                fetchDepartments();
            }
            if (response.status === 400 || response.status === 500) {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
        setAddDepartmentModal(false);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                {loading ? (
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                ) : (
                    <>
                        <h3 className="text-lg font-medium">Add Department</h3>
                        <span className="block text-gray-700 font-bold mb-2">Department Name:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Enter department name"
                            onChange={handleInputChange}
                            value={formData.name}
                        />
                        <span className="block text-gray-700 font-bold mb-2">HOD ID:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="hodId"
                            type="number"
                            placeholder="Enter HOD ID"
                            onChange={handleInputChange}
                            value={formData.hodId}
                        />
                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={handleAddDepartment} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Add Department
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
