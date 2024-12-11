import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContextProvider";
import { toast } from "react-hot-toast";
import { IconEdit, IconPlus } from "@tabler/icons-react";

export default function AdminDashboard() {
    const [activeSubject, setActiveSubject] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [adminGroups, setAdminGroups] = useState([]);
    const [addSubjectModal, setAddSubjectModal] = useState(false);
    const [addDepartmentModal, setAddDepartmentModal] = useState(false);
    const [addAdminGroupModal, setAddAdminGroupModal] = useState(false);
    const [accessError, setAccessError] = useState({
        adminGroup: false,
        student: false,
        instructor: false,
        courses: false,
        department: false,
    });
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
            await fetchAdminGroups();
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
            if (response.status === 403) {
                setAccessError({
                    ...accessError,
                    student: true,
                });
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
            if (response.status === 403) {
                setAccessError({
                    ...accessError,
                    instructor: true,
                });
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
            if (response.status === 403) {
                setAccessError({
                    ...accessError,
                    courses: true,
                });
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
            if (response.status === 403) {
                setAccessError({
                    ...accessError,
                    department: true,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAdminGroups = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/fetchAdminGroups`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                console.log("admin groups:", data.adminGroups);
                setAdminGroups(data.adminGroups);
            }
            if (response.status === 403) {
                setAccessError({
                    ...accessError,
                    adminGroup: true,
                });
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

    if (addAdminGroupModal) {
        return <AddAdminGroupModal fetchAdminGroups={fetchAdminGroups} authUser={authUser} setAddAdminGroupModal={setAddAdminGroupModal} />;
    }

    return (
        <div className="flex-1 bg-[#f5f5f5] p-8 md:p-12 lg:p-16">
            <div className="max-w-6xl mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold IBM_Plex_Mono">Welcome admin, {authUser.name}</h1>
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
                        {accessError.student ? (
                            <p className=" text-center text-red-500">You do not have access to view this section</p>
                        ) : (
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
                        )}
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Instructors</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">Manage Instructors</p>
                        </div>
                        {accessError.instructor ? (
                            <p className=" text-center text-red-500">You do not have access to view this section</p>
                        ) : (
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
                        )}
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Subjects</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">Manage Subjects</p>
                        </div>
                        {accessError.courses ? (
                            <p className=" text-center text-red-500">You do not have access to view this section</p>
                        ) : (
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
                        )}
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Departments</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">Manage Departments</p>
                        </div>
                        {accessError.department ? (
                            <p className=" text-center text-red-500">You do not have access to view this section</p>
                        ) : (
                            <div className="border-t px-6 py-4 IBM_Plex_Mono">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Department List</h3>
                                    <button
                                        onClick={() => setAddDepartmentModal(true)}
                                        className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors"
                                    >
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
                        )}
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Admin Groups</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">Manage Admin groups and their permissions</p>
                        </div>
                        {accessError?.adminGroup === false ? (
                            <div className="border-t px-6 py-4 IBM_Plex_Mono">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Group List</h3>
                                    <button
                                        onClick={() => setAddAdminGroupModal(true)}
                                        className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors"
                                    >
                                        Add Group
                                    </button>
                                </div>
                                <div className="overflow-x-auto max-h-[250px] mt-4">
                                    <table className="w-full text-sm IBM_Plex_Mono">
                                        <thead>
                                            <tr>
                                                <th className="text-left px-4 py-2 font-bold">Group ID</th>
                                                <th className="text-left px-4 py-2 font-bold">Name</th>
                                                <th className="text-left px-4 py-2 font-bold">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {adminGroups.map((student) => (
                                                <AdminGroupRow group={student} fetchAdminGroups={fetchAdminGroups} authUser={authUser} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className=" text-center text-red-500">You do not have access to view this section</p>
                        )}
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

    const handleDeleteStudent = async () => {
        setLoading(true);
        console.log(student);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/deleteRoll`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify({ studentId: student[1] }),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                toast.success("Student deleted successfully");
                fetchStudent();
            }
            if (response.status === 403) {
                toast.error("Access denied");
            }
        } catch (error) {
            toast.error("Error deleting student");
            console.log(error);
        }
        setLoading(false);
    };

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
            if (response.status === 403) {
                toast.error("Access denied");
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
            if (response.status === 403) {
                toast.error("Access denied");
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
            if (response.status === 403) {
                toast.error("Access denied");
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
            if (response.status === 403) {
                toast.error("Access denied");
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
            if (response.status === 403) {
                toast.error("Access denied");
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
            if (response.status === 403) {
                toast.error("Access denied");
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

const AdminGroupRow = ({ group, fetchAdminGroups, authUser }) => {
    const [loading, setLoading] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [permissionModal, setPermissionModal] = useState(false);
    const [adminGroupUsersModal, setAdminGroupUsersModal] = useState(false);

    if (editModal) {
        return <EditAdminGroupModal fetchAdminGroups={fetchAdminGroups} group={group} authUser={authUser} setEditModal={setEditModal} />;
    }

    if (permissionModal) {
        return <PermissionModal fetchAdminGroups={fetchAdminGroups} group={group} authUser={authUser} setPermissionModal={setPermissionModal} />;
    }

    if (adminGroupUsersModal) {
        return <AdminGroupUsersModal fetchAdminGroups={fetchAdminGroups} group={group} authUser={authUser} setAdminGroupUsersModal={setAdminGroupUsersModal} />;
    }

    return (
        <tr className="border-b">
            <td className="px-4 py-3">{group[0]}</td>
            <td className="px-4 py-3">{group[1]}</td>
            <td className="px-4 py-3">{group[2]}</td>
            <td className="px-4 py-3">
                <button onClick={() => setPermissionModal(true)}>View Permissions</button>
            </td>
            <td className="px-4 py-3">
                <button onClick={() => setAdminGroupUsersModal(true)}>View Users</button>
            </td>
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

const EditAdminGroupModal = ({ group, fetchAdminGroups, authUser, setEditModal }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        groupId: group[0],
        name: group[1],
        description: group[2],
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

    const handleUpdateGroup = async () => {
        setLoading(true);
        console.log(formData);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/updateGroup`, {
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
                toast.success("Group updated successfully");
                fetchAdminGroups();
            }
            if (response.status === 403) {
                toast.error("Access denied");
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
                        <h3 className="text-lg font-medium">Edit Admin Group</h3>
                        <span className="block text-gray-700 font-bold mb-2">Group ID: {formData.groupId}</span>
                        <span className="block text-gray-700 font-bold mb-2">Group Name:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Enter group name"
                            onChange={handleInputChange}
                            value={formData.name}
                        />
                        <span className="block text-gray-700 font-bold mb-2">Group Description:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="description"
                            type="text"
                            placeholder="Enter group description"
                            onChange={handleInputChange}
                            value={formData.description}
                        />
                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={handleUpdateGroup} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Update Group
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const AddAdminGroupModal = ({ authUser, fetchAdminGroups, setAddAdminGroupModal }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setAddAdminGroupModal(false);
            }
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setAddAdminGroupModal(false);
                }
            });
        };
    }, []);

    const handleAddAdminGroup = async () => {
        setLoading(true);
        console.log(formData);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/addGroup`, {
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
                toast.success("Group added successfully");
                fetchAdminGroups();
            }
            if (response.status === 400 || response.status === 500) {
                toast.error(data.message);
            }
            if (response.status === 403) {
                toast.error("Access denied");
            }
        } catch (error) {
            console.log(error);
        }
        setAddAdminGroupModal(false);
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
                        <h3 className="text-lg font-medium">Add Admin Group</h3>
                        <span className="block text-gray-700 font-bold mb-2">Group Name:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Enter group name"
                            onChange={handleInputChange}
                            value={formData.name}
                        />
                        <span className="block text-gray-700 font-bold mb-2">Group Description:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="description"
                            type="text"
                            placeholder="Enter group description"
                            onChange={handleInputChange}
                            value={formData.description}
                        />
                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={handleAddAdminGroup} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Add Group
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const PermissionModal = ({ group, authUser, fetchAdminGroups, setPermissionModal }) => {
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const [allPermissions, setAllPermissions] = useState([]);
    const [updatePermissionModal, setUpdatePermissionModal] = useState(false);
    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/fetchGroupPermissions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify({ groupId: group[0] }),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                setPermissions(data.permission);
                setAllPermissions(data.allPermissions);
            }
            if (response.status === 403) {
                toast.error("Access denied");
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setPermissionModal(false);
            }
        });
        fetchPermissions();
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setPermissionModal(false);
                }
            });
        };
    }, [group]);

    if (loading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (updatePermissionModal) {
        return (
            <UpdatePermissionModal
                group={group}
                authUser={authUser}
                fetchAdminGroups={fetchAdminGroups}
                permissions={permissions}
                allPermissions={allPermissions}
                setUpdatePermissionModal={setUpdatePermissionModal}
            />
        );
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Permissions</h3>
                    <button className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors" onClick={() => setUpdatePermissionModal(true)}>
                        Refresh
                    </button>
                </div>
                <table className="w-full mt-4">
                    <thead>
                        <tr>
                            <th className="text-left pr-4">Permission ID</th>
                            <th className="text-left pr-4">Permission Name</th>
                            <th className="text-left pr-4">Permission Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.map((permission) => (
                            <tr key={permission[0]} className="border-b">
                                <td className="px-4 py-3">{permission[0]}</td>
                                <td className="px-4 py-3">{permission[1]}</td>
                                <td className="px-4 py-3">{permission[2]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UpdatePermissionModal = ({ group, authUser, fetchAdminGroups, permissions, allPermissions, setUpdatePermissionModal }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        groupId: group[0],
        permissions: [],
    });

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setUpdatePermissionModal(false);
            }
        });

        permissions.map((permission) => {
            setFormData({ ...formData, permissions: [...formData.permissions, permission[0]] });
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setUpdatePermissionModal(false);
                }
            });
        };
    }, [authUser]);

    const handleUpdatePermissions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/updateGroupPermissions`, {
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
                toast.success("Permissions updated successfully");
                fetchAdminGroups();
            }
            if (response.status === 403) {
                toast.error("Access denied");
            }
        } catch (error) {
            console.log(error);
        }
        setUpdatePermissionModal(false);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        console.log(e.target.checked, e.target.value);
        if (e.target.checked) {
            setFormData({ ...formData, permissions: [...formData.permissions, e.target.value] });
        } else {
            setFormData({ ...formData, permissions: formData.permissions.filter((permission) => permission !== e.target.value) });
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 overflow-scroll h-3/4">
                {loading ? (
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                ) : (
                    <>
                        <h3 className="text-lg font-medium">Update Permissions</h3>
                        <table className="w-full mt-4">
                            <thead>
                                <tr>
                                    <th className="text-left pr-4">Permission ID</th>
                                    <th className="text-left pr-4">Permission Name</th>
                                    <th className="text-left pr-4">Permission Description</th>
                                    <th className="text-left pr-4">Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPermissions.map((permission) => (
                                    <tr key={permission[0]} className="border-b">
                                        <td className="px-4 py-3">{permission[0]}</td>
                                        <td className="px-4 py-3">{permission[1]}</td>
                                        <td className="px-4 py-3">{permission[2]}</td>
                                        <td className="px-4 py-3">
                                            <input type="checkbox" value={permission[0]} onChange={handleInputChange} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={handleUpdatePermissions} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Update Permissions
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const AdminGroupUsersModal = ({ group, authUser, fetchAdminGroups, setAdminGroupUsersModal }) => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/fetchGroupUsers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify({ groupId: group[0] }),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                setUsers(data.users);
            }
            if (response.status === 403) {
                toast.error("Access denied");
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setAdminGroupUsersModal(false);
            }
        });
        fetchUsers();
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setAdminGroupUsersModal(false);
                }
            });
        };
    }, [group]);

    if (loading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium">Users</h3>
                <table className="w-full mt-4">
                    <thead>
                        <tr>
                            <th className="text-left pr-4">User ID</th>
                            <th className="text-left pr-4">First Name</th>
                            <th className="text-left pr-4">Last Name</th>
                            <th className="text-left pr-4">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user[0]} className="border-b">
                                <td className="px-4 py-3">{user[0]}</td>
                                <td className="px-4 py-3">{user[1]}</td>
                                <td className="px-4 py-3">{user[2]}</td>
                                <td className="px-4 py-3">{user[3]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AddAdminGroupUsersModal = ({ group, authUser, fetchAdminGroups, setAddAdminGroupUsersModal }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        groupId: group[0],
        userId: "",
    });

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setAddAdminGroupUsersModal(false);
            }
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setAddAdminGroupUsersModal(false);
                }
            });
        };
    }, []);

    const handleAddAdminGroupUser = async () => {
        setLoading(true);
        console.log(formData);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/addGroupUsers`, {
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
                toast.success("User added to group successfully");
                fetchAdminGroups();
            }
            if (response.status === 400 || response.status === 500) {
                toast.error(data.message);
            }
            if (response.status === 403) {
                toast.error("Access denied");
            }
        } catch (error) {
            console.log(error);
        }
        setAddAdminGroupUsersModal(false);
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
                        <h3 className="text-lg font-medium">Add User to Group</h3>
                        <span className="block text-gray-700 font-bold mb-2">User ID:</span>
                        <input
                            className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="userId"
                            type="number"
                            placeholder="Enter user ID"
                            onChange={handleInputChange}
                            value={formData.userId}
                        />
                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={handleAddAdminGroupUser} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Add User
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
