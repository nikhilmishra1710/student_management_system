import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContextProvider";
import { toast } from "react-hot-toast";

export default function TeacherDashboard() {
    const [activeSubject, setActiveSubject] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [pastExams, setPastExams] = useState([]);
    const [pastExamValues, setPastExamValues] = useState("");
    const [pastExamScores, setPastExamScores] = useState([]);
    const [pastExamScoreLoading, setPastExamScoreLoading] = useState(false);
    const [editScore, setEditScore] = useState("");
    const [scoreModal, setScoreModal] = useState(false);
    const [addSubjectModal, setAddSubjectModal] = useState(false);
    const [addExamModal, setAddExamModal] = useState(false);
    const [addStudentModal, setAddStudentModal] = useState(false);
    const [removeSubjectModal, setRemoveSubjectModal] = useState(false);
    const [removeExamModal, setRemoveExamModal] = useState(false);
    const [updateExamModal, setUpdateExamModal] = useState(false);
    const [updateExam, setUpdateExam] = useState(false);
    const { authUser } = useAuthContext();

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/fetchSubject`, {
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
        setLoading(false);
    };

    const changeSubject = (e) => {
        setActiveSubject(e.target.value);
    };

    useEffect(() => {
        console.log("activeSubject", activeSubject);
        if (!activeSubject) return;
        fetchData();
    }, [activeSubject]);

    const fetchData = async () => {
        setFetchLoading(true);
        try {
            await fetchStudent();
            await fetchExams();
            await fetchPastExams();
        } catch (error) {
            console.log(error);
        }
        setFetchLoading(false);
    };

    const fetchStudent = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/fetchStudents`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify({ subject: activeSubject }),
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

    const fetchExams = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/fetchExams`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify({ subject: activeSubject }),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                setExams(data.exams);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePastExamScores = (e) => {
        console.log("Selected Exam", e.target.value);
        fetchPastExamsScores(e.target.value);
        setPastExamValues(e.target.value);
    };

    const fetchPastExamsScores = async (exam) => {
        setPastExamScoreLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/fetchPastExamScores`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify({ examId: exam }),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                setPastExamScores(data.scores);
            }
        } catch (error) {
            console.log(error);
        }
        setPastExamScoreLoading(false);
    };

    const fetchPastExams = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/fetchPastExams`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify({ subject: activeSubject }),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                setPastExams(data.pastexams);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (scoreModal) {
        return <EditScoreModal fetchPastExamsScores={fetchPastExamsScores} authUser={authUser} exam={editScore} setScoreModal={setScoreModal} />;
    }

    if (addSubjectModal) {
        return <AddSubjectModal fetchSubjects={fetchSubjects} authUser={authUser} setAddSubjectModal={setAddSubjectModal} />;
    }

    if (addExamModal) {
        return <AddExamModal fetchExams={fetchExams} authUser={authUser} activeSubject={activeSubject} setAddExamModal={setAddExamModal} />;
    }

    if (addStudentModal) {
        return <AddStudentModel fetchStudent={fetchStudent} authUser={authUser} activeSubject={activeSubject} setAddStudentModal={setAddStudentModal} />;
    }

    if (removeSubjectModal) {
        if (!subjects) {
            toast.error("No subjects to remove");
            setRemoveSubjectModal(false);
        } else {
            console.log("Remove Subject Modal", subjects);
            return <RemoveSubjectModal fetchSubjects={fetchSubjects} subjects={subjects} authUser={authUser} setRemoveSubjectModal={setRemoveSubjectModal} />;
        }
    }

    if (removeExamModal) {
        if (!exams) {
            toast.error("No exams to remove");
            setRemoveExamModal(false);
        } else {
            console.log("Remove Exam Modal", exams);
            return <DeleteExamModel fetchExams={fetchExams} exams={exams} authUser={authUser} setRemoveExamModal={setRemoveExamModal} />;
        }
    }

    if (updateExamModal) {
        if (!exams) {
            toast.error("No exams to update");
            setUpdateExamModal(false);
        } else {
            console.log("Update Exam Modal", exams);
            return <UpdateExamModal fetchExams={fetchExams} exams={updateExam} authUser={authUser} setUpdateExamModal={setUpdateExamModal} />;
        }
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
                <div className="flex items-center justify-start gap-4">
                    <select value={activeSubject} onChange={changeSubject} name="subject" className="p-2 rounded-md">
                        <option value="">Select Subject</option>
                        {subjects?.map((sub) => (
                            <option value={sub[0]}>{sub[1]}</option>
                        ))}
                    </select>
                    <button onClick={() => setAddSubjectModal(true)} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                        Add Subject
                    </button>
                    <button onClick={() => setRemoveSubjectModal(true)} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                        Remove Subject
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Enrolled Students</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">Manage enrolled students in your subjects</p>
                        </div>
                        <div className="border-t px-6 py-4 IBM_Plex_Mono">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Student List</h3>
                                {activeSubject ? (
                                    <button className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors" onClick={() => setAddStudentModal(true)}>
                                        Add Student
                                    </button>
                                ) : (
                                    <button className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors" disabled>
                                        Select subject
                                    </button>
                                )}
                            </div>
                            <div className="overflow-x-auto max-h-[250px] mt-4">
                                <table className="w-full text-sm IBM_Plex_Mono">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2 font-bold">Student ID</th>
                                            <th className="text-left px-4 py-2 font-bold">Course ID</th>
                                            <th className="text-left px-4 py-2 font-bold">Name</th>
                                            <th className="text-left px-4 py-2 font-bold">Email</th>
                                            <th className="text-left px-4 py-2 font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!fetchLoading && activeSubject === "" ? (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    Select a subject
                                                </td>
                                            </tr>
                                        ) : students.length === 0 && activeSubject !== "" ? (
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
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Exam Schedule</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">View and manage the schedule of upcoming exams.</p>
                        </div>
                        <div className="border-t px-6 py-4 IBM_Plex_Mono">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Upcoming Exams</h3>
                                {activeSubject ? (
                                    <button onClick={() => setAddExamModal(true)} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                        Add Exam
                                    </button>
                                ) : (
                                    <button className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors" disabled>
                                        Select Subject
                                    </button>
                                )}
                            </div>
                            <div className="overflow-x-auto mt-4">
                                <table className="w-full IBM_Plex_Mono">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2 font-medium">Exam code</th>
                                            <th className="text-left px-4 py-2 font-medium">Date</th>
                                            <th className="text-left px-4 py-2 font-medium">Time</th>
                                            <th className="text-left px-4 py-2 font-medium">Subject</th>
                                            <th className="text-left px-4 py-2 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!fetchLoading && activeSubject === "" ? (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    Select a subject
                                                </td>
                                            </tr>
                                        ) : exams.length === 0 && activeSubject !== "" ? (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    No exams scheduled in this subject
                                                </td>
                                            </tr>
                                        ) : (
                                            exams.map((exam) => (
                                                <tr className="border-b">
                                                    <td className="px-4 py-3">{exam[0]}</td>
                                                    <td className="px-4 py-3">{exam[1]}</td>
                                                    <td className="px-4 py-3">{exam[2]}</td>
                                                    <td className="px-4 py-3">{exam[3]}</td>

                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    className="bg-white text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                                                                    onClick={() => {
                                                                        setUpdateExam(exam);
                                                                        setUpdateExamModal(true);
                                                                    }}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke-width="1.5"
                                                                        stroke="currentColor"
                                                                        className="h-4 w-4"
                                                                    >
                                                                        <path
                                                                            d="M11 4L4 11l-1 6 6-1 7-7-5-5zm2 2l5 5M3 21h18"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            stroke-width="2"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    className="bg-white text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                                                                    onClick={() => setRemoveExamModal(true)}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke-width="1.5"
                                                                        stroke="currentColor"
                                                                        className="h-4 w-4"
                                                                    >
                                                                        <path
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Past Exam</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">View the past attended exams and scores</p>
                        </div>
                        <div className="border-t px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Past Exams</h3>
                            </div>
                            <div className="overflow-x-auto mt-4">
                                <select onChange={handlePastExamScores} value={pastExamValues} name="exam" className="p-2 rounded-md">
                                    <option value="">Select Exam</option>
                                    {pastExams.map((exam) => (
                                        <option value={exam[0]}>{exam[0] + ": " + exam[3] + ": " + new Date(exam[1]).toISOString().split("T")[0]}</option>
                                    ))}
                                </select>
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2 font-medium">Student ID</th>
                                            <th className="text-left px-4 py-2 font-medium">Name</th>
                                            <th className="text-left px-4 py-2 font-medium">Exam Code</th>
                                            <th className="text-left px-4 py-2 font-medium">Score</th>
                                            <th className="text-left px-4 py-2 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!fetchLoading && activeSubject === "" ? (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    Select a subject
                                                </td>
                                            </tr>
                                        ) : pastExams.length === 0 && activeSubject !== "" ? (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    No past exams in this subject
                                                </td>
                                            </tr>
                                        ) : pastExamScores.length === 0 && activeSubject !== "" ? (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    No scores available for this exam
                                                </td>
                                            </tr>
                                        ) : !pastExamScoreLoading ? (
                                            pastExamScores.map((pastExam) => (
                                                <tr className="border-b">
                                                    <td className={`px-4 py-3`}>{pastExam[0]}</td>
                                                    <td className="px-4 py-3">{pastExam[1] + " " + pastExam[2]}</td>
                                                    <td className="px-4 py-3">{pastExam[4]}</td>
                                                    <td className="px-4 py-3">{pastExam[7] ? pastExam[7] : "No Score"}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => (console.log("update score id"), setEditScore(pastExam), setScoreModal(true))}
                                                                    className="bg-white text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke-width="1.5"
                                                                        stroke="currentColor"
                                                                        className="h-4 w-4"
                                                                    >
                                                                        <path
                                                                            d="M11 4L4 11l-1 6 6-1 7-7-5-5zm2 2l5 5M3 21h18"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            stroke-width="2"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    Loading...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Student Performance</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">View your past attended exams and scores</p>
                        </div>
                        <div className="border-t px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Upcoming Exams</h3>
                                <button className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">Add Exam</button>
                            </div>
                            <div className="overflow-x-auto mt-4">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2 font-medium">Date</th>
                                            <th className="text-left px-4 py-2 font-medium">Time</th>
                                            <th className="text-left px-4 py-2 font-medium">Subject</th>
                                            <th className="text-left px-4 py-2 font-medium">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <PastExamRow />
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

const StudentRow = ({ student, fetchStudent, activeSubject, authUser }) => {
    const [loading, setLoading] = useState(false);

    const handleDeleteStudent = async (studentId) => {
        setLoading(true);
        console.log("Student ID", studentId, { studentId, subject: activeSubject });
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/unenroll`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify({ enrollmentId: student[5] }),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                toast.success("Student removed successfully");
                fetchStudent();
            }
        } catch (error) {
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
                            <button onClick={() => handleDeleteStudent(student[0])} className="bg-white text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-4 w-4">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                </svg>
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

const PastExamRow = ({ date, time, subject, score }) => {
    return (
        <tr className="border-b">
            <td className="px-4 py-3">2023-05-15</td>
            <td className="px-4 py-3">9:00 AM - 11:00 AM</td>
            <td className="px-4 py-3">Mathematics</td>
            <td className="px-4 py-3">A</td>
        </tr>
    );
};

const EditScoreModal = ({ authUser, fetchPastExamsScores, exam, setScoreModal }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Edit Score", exam);
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setScoreModal(false);
            }
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setScoreModal(false);
                }
            });
        };
    }, []);

    const udpateScore = async () => {
        setLoading(true);
        console.log("Update Score");
        const score = document.getElementById("score").value ? document.getElementById("score").value : 0;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/updateScore`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify({ studentId: exam[0], examId: exam[4], score: score }),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                toast.success("Score updated successfully");
                setScoreModal(false);
            } else {
                toast.error("Failed to update score");
                setScoreModal(false);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        fetchPastExamsScores(exam[4]);
    };

    if (loading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium">Edit Score</h3>
                <span className="block text-gray-700 font-bold mb-2">Student ID: {exam[0]}</span>
                <span className="block text-gray-700 font-bold mb-2">Exam Code: {exam[4]}</span>
                <div className="mt-4">
                    <label className="block text-gray-700 font-bold mb-2" for="score">
                        Score
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="score"
                        type="text"
                        placeholder="Enter score"
                        value={exam[7]}
                    />
                </div>
                <div className="mt-4 flex items-center justify-center">
                    <button onClick={udpateScore} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                        Update Score
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddSubjectModal = ({ authUser, fetchSubjects, setAddSubjectModal }) => {
    const [loading, setLoading] = useState(false);
    const [leftSubjects, setLeftSubjects] = useState([]);
    const [subjectID, setSubjectID] = useState("");

    useEffect(() => {
        fetchLeftSubjects();
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

    const fetchLeftSubjects = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/fetchLeftSubjects`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                setLeftSubjects(data.subjects);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const addSubject = async () => {
        setLoading(true);
        console.log(subjectID);
        const formData = { subjectID: subjectID };
        if (!subjectID) {
            toast.error("Please select a subject");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/addSubject`, {
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
                setAddSubjectModal(false);
            } else {
                toast.error("Failed to add subject");
                setAddSubjectModal(false);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        setAddSubjectModal(false);
        fetchSubjects();
    };

    const handleSubjectChange = (e) => {
        setSubjectID(e.target.value);
    };

    if (loading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium">Add Subject</h3>
                {leftSubjects.length === 0 ? (
                    <p className="text-gray-500 mt-2">No subjects left to add</p>
                ) : (
                    <>
                        <p className="text-gray-500 mt-2">Select a subject to add</p>

                        <div className="mt-4">
                            <label className="block text-gray-700 font-bold mb-2" for="subject">
                                Subject
                            </label>
                            <select
                                value={subjectID}
                                onChange={handleSubjectChange}
                                className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="subject"
                            >
                                <option default value="">
                                    Select Subject
                                </option>
                                {leftSubjects.map((subject) => (
                                    <option value={subject[0]}>{subject[1]}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={addSubject} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Add Subject
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const AddExamModal = ({ authUser, fetchExams, activeSubject, setAddExamModal }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const today = new Date().toISOString().split("T")[0];
    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setAddExamModal(false);
            }
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setAddExamModal(false);
                }
            });
        };
    }, []);

    const addExam = async () => {
        // setLoading(true);
        console.log(formData);
        if (!formData.name || !formData.date || !formData.stime || !formData.ftime) {
            toast.error("Please fill all the fields");
            setLoading(false);
            return;
        }
        const subjectID = activeSubject;
        const time =
            formData.stime +
            (parseInt(formData.stime.substring(0, 2)) < 12 ? " AM - " : " PM - ") +
            formData.ftime +
            (parseInt(formData.ftime.substring(0, 2)) < 12 ? " AM" : " PM");

        console.log(time, subjectID, formData);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/addExam`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify({
                    subject: subjectID,
                    name: formData.name,
                    date: formData.date,
                    time: time,
                }),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                toast.success("Exam added successfully");
                setAddExamModal(false);
            } else {
                toast.error("Failed to add exam");
                setAddExamModal(false);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        setAddExamModal(false);
        fetchExams();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    if (loading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="fixed top-0 backdrop-blur-md left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium">Add Exam</h3>
                <div className="mt-4">
                    <label className="block text-gray-700 font-bold mb-2" for="subject">
                        Subject ID: {activeSubject}
                    </label>
                </div>
                <div className="mt-4">
                    <label className="block text-gray-700 font-bold mb-2" for="subject">
                        Exam Name
                    </label>
                    <input
                        placeholder="Enter exam name"
                        className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-gray-700 font-bold mb-2" for="date">
                        Date
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="date"
                        type="date"
                        placeholder="Enter date"
                        onChange={handleChange}
                        min={today}
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-gray-700 font-bold mb-2" for="time">
                        Start Time
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="stime"
                        type="time"
                        placeholder="Enter start time"
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-gray-700 font-bold mb-2" for="time">
                        Finish Time
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="ftime"
                        type="time"
                        placeholder="Enter final time"
                        onChange={handleChange}
                    />
                </div>

                <div className="mt-4 flex items-center justify-center">
                    <button onClick={addExam} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                        Add Exam
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddStudentModel = ({ authUser, fetchStudent, activeSubject, setAddStudentModal }) => {
    const [loading, setLoading] = useState(false);
    const [studentId, setStudentId] = useState("");
    const [data, setData] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setAddStudentModal(false);
            }
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setAddStudentModal(false);
                }
            });
        };
    }, []);

    const getStudent = async () => {
        if (!studentId) {
            toast.error("Please enter student ID");
            setLoading(false);
            return;
        }
        console.log(studentId);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/checkStudent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify({ studentId: studentId, subjectId: activeSubject }),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                // setPastExams(data.pastexams);
                // if (data.student) {
                setData(data.data);
                // }
                setMessage(data.enrolled);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addStudent = async () => {
        setLoading(true);
        console.log(studentId);
        const formData = { studentId: studentId, subjectId: activeSubject };
        if (!studentId) {
            toast.error("Please enter student ID");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/addStudent`, {
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
                toast.success("Student added successfully");
                fetchStudent();
                setAddStudentModal(false);
            } else {
                toast.error("Failed to add student");
                setAddStudentModal(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="fixed top-0 backdrop-blur-md left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium">Add Student</h3>
                <div className="mt-4">
                    <label className="block text-gray-700 font-bold mb-2" for="subject">
                        Subject ID: {activeSubject}
                    </label>
                </div>
                <div className="mt-4">
                    <label className="block text-gray-700 font-bold mb-2" for="subject">
                        Student ID
                    </label>
                    <input
                        placeholder="Enter student ID"
                        className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="studentId"
                        type="text"
                        onInput={(e) => setStudentId(e.target.value)}
                    />
                </div>
                <div className="mt-4 flex items-center justify-center">
                    <button onClick={getStudent} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                        Get Student Data
                    </button>
                </div>
                {data &&
                    (data.exists ? (
                        message ? (
                            <>
                                <div className="mt-4">
                                    <p className="IBM_Plex_Mono">Enrollment Date: </p>
                                    <p>{data.data[3]}</p>
                                </div>
                            </>
                        ) : (
                            <div className="mt-4">
                                <p className="IbM_Plex_Mono">Student name: </p>
                                <p>{data.data[1] + " " + data.data[2]}</p>
                                <p className="IbM_Plex_Mono">Email: </p>
                                <p>{data.data[3]}</p>
                                <button onClick={addStudent} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                    Add Student
                                </button>
                            </div>
                        )
                    ) : (
                        <p className="text-red-500">Student not found</p>
                    ))}
            </div>
        </div>
    );
};

const RemoveSubjectModal = ({ authUser, subjects, fetchSubjects, setRemoveSubjectModal }) => {
    const [loading, setLoading] = useState(false);
    const [subjectID, setSubjectID] = useState("");
    console.log(subjects);
    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setRemoveSubjectModal(false);
            }
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setRemoveSubjectModal(false);
                }
            });
        };
    }, []);

    const removeSubject = async () => {
        setLoading(true);
        console.log(subjectID);
        const formData = { subjectId: subjectID };
        if (!subjectID) {
            toast.error("Please select a subject");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/removeSubject`, {
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
                toast.success("Subject removed successfully");
                setRemoveSubjectModal(false);
            } else {
                toast.error("Failed to remove subject");
                setRemoveSubjectModal(false);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        fetchSubjects();
    };

    const handleSubjectChange = (e) => {
        setSubjectID(e.target.value);
    };

    if (loading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium">Remove Subject</h3>
                {subjects.length === 0 ? (
                    <p className="text-gray-500 mt-2">No subjects left to remove</p>
                ) : (
                    <>
                        <p className="text-gray-500 mt-2">Select a subject to remove</p>

                        <div className="mt-4">
                            <label className="block text-gray-700 font-bold mb-2" for="subject">
                                Subject
                            </label>
                            <select
                                value={subjectID}
                                onChange={handleSubjectChange}
                                className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="subject"
                            >
                                <option default value="">
                                    Select Subject
                                </option>
                                {subjects.map((subject) => (
                                    <option value={subject[0]}>{subject[1]}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={removeSubject} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Remove Subject
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const DeleteExamModel = ({ authUser, exams, fetchExams, setRemoveExamModal }) => {
    const [loading, setLoading] = useState(false);
    const [examID, setExamID] = useState("");
    console.log(exams);
    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setRemoveExamModal(false);
            }
        });
        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setRemoveExamModal(false);
                }
            });
        };
    }, []);

    const deleteExam = async () => {
        setLoading(true);
        console.log(examID);
        const formData = { examId: examID };
        if (!examID) {
            toast.error("Please select an exam");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/deleteExam`, {
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
                toast.success("Exam removed successfully");
                setRemoveExamModal(false);
            } else {
                toast.error("Failed to remove exam");
                setRemoveExamModal(false);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        fetchExams();
    };

    const handleExamChange = (e) => {
        setExamID(e.target.value);
    };

    if (loading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium">Delete Exam</h3>
                {exams.length === 0 ? (
                    <p className="text-gray-500 mt-2">No exams left to delete</p>
                ) : (
                    <>
                        <p className="text-gray-500 mt-2">Select an exam to delete</p>

                        <div className="mt-4">
                            <label className="block text-gray-700 font-bold mb-2" for="exam">
                                Exam
                            </label>
                            <select
                                value={examID}
                                onChange={handleExamChange}
                                className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="exam"
                            >
                                <option default value="">
                                    Select Exam
                                </option>
                                {exams.map((exam) => (
                                    <option value={exam[0]}>{exam[2] + " " + exam[3]}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={deleteExam} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Delete Exam
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const UpdateExamModal = ({ authUser, exams, fetchExams, setUpdateExamModal }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    let date = new Date(exams[1]).toISOString().split("T")[0];
    date = convertDateFormat(date);
    const today = new Date().toISOString().split("T")[0];
    console.log(exams, date);
    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("fixed")) {
                setUpdateExamModal(false);
            }
        });

        // Extract values from the array
        const examName = exams[3];
        const examDate = new Date(exams[1]).toISOString().split("T")[0]; // Convert to yyyy-mm-dd format
        const [startTime, finishTime] = exams[2].split(" - ").map(convertTo24HourFormat);
        // Set default values in the form state
        setFormData({
            name: examName,
            date: examDate,
            stime: startTime,

            ftime: finishTime,
        });

        return () => {
            document.removeEventListener("click", (e) => {
                if (e.target.classList.contains("fixed")) {
                    setUpdateExamModal(false);
                }
            });
        };
    }, []);

    const updateExam = async () => {
        setLoading(true);
        console.log(exams[0]);
        const time =
            formData.stime +
            (parseInt(formData.stime.substring(0, 2)) < 12 ? " AM - " : " PM - ") +
            formData.ftime +
            (parseInt(formData.ftime.substring(0, 2)) < 12 ? " AM" : " PM");
        const formData2 = { examId: exams[0], time: time, ...formData };

        if (!exams[0]) {
            toast.error("Please select an exam");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/updateExam`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify(formData2),
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                toast.success("Exam updated successfully");
                setUpdateExamModal(false);
            } else {
                toast.error("Failed to update exam");
                setUpdateExamModal(false);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        fetchExams();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    if (loading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium">Update Exam</h3>
                {exams.length === 0 ? (
                    <p className="text-gray-500 mt-2">No exams left to update</p>
                ) : (
                    <>
                        <p className="text-gray-500 mt-2">Exam ID: {exams[0]}</p>
                        <div className="mt-4">
                            <label className="block text-gray-700 font-bold mb-2" for="name">
                                Exam Name
                            </label>
                            <input
                                placeholder="Enter exam name"
                                className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                onChange={handleChange}
                                value={formData.name}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 font-bold mb-2" for="date">
                                Date
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="date"
                                type="date"
                                placeholder="Enter date"
                                onChange={handleChange}
                                min={today}
                                value={formData.date}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 font-bold mb-2" for="time">
                                Start Time
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="stime"
                                type="time"
                                placeholder="Enter start time"
                                onChange={handleChange}
                                value={formData.stime}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 font-bold mb-2" for="time">
                                Finish Time
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="ftime"
                                type="time"
                                placeholder="Enter final time"
                                onChange={handleChange}
                                value={formData.ftime}
                            />
                        </div>
                        <div className="mt-4 flex items-center justify-center">
                            <button onClick={updateExam} className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">
                                Update Exam
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

function convertDateFormat(dateStr) {
    // Split the input date string into an array [yyyy, mm, dd]
    const [year, month, day] = dateStr.split("-");

    // Rearrange to dd-mm-yyyy format
    return `${day}-${month}-${year}`;
}

const convertTo24HourFormat = (time) => {
    // Parse the time string and extract hours, minutes, and period (AM/PM)
    const [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":");

    // Convert hours to a number and adjust based on AM/PM
    hours = parseInt(hours, 10);
    if (period === "PM" && hours < 12) hours += 12; // Convert PM hour to 24-hour format
    if (period === "AM" && hours === 12) hours = 0; // Convert 12 AM to 00:00

    // Format hours and minutes as two digits
    return `${String(hours).padStart(2, "0")}:${minutes}`;
};
