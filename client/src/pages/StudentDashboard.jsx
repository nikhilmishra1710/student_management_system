import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContextProvider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function StudentDashboard() {
    const { authUser } = useAuthContext();
    const [perfSub, setPerfSub] = useState("");
    const [activePerf, setActivePerf] = useState("score");
    const [exam, setExam] = useState("");
    const [pastExam, setPastExam] = useState("");
    const [subject, setSubject] = useState("");
    const [loading, setLoading] = useState(false);
    const [perfloading, setPerfLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            // fetch exams
            await getSubjects();
            await getExams();
            await getPastExams();
            setLoading(false);
        }
        fetchData();
    }, []);

    const getSubjects = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/fetchSubject`, {
                method: "GET",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
            });
            if (response.status !== 200) {
                toast.error("Error fetching subjects");
                console.log("Error fetching subjects");
            } else {
                const data = await response.json();
                console.log(data);
                setSubject(data.subjects);
                console.log("subjects fetched");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getExams = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/fetchExam`, {
                method: "GET",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
            });
            if (response.status !== 200) {
                toast.error("Error fetching exams");
                console.log("Error fetching exams");
            } else {
                const data = await response.json();
                console.log(data);
                setExam(data.exams);
                console.log("exams fetched");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getPastExams = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/fetchPastExam`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
            });
            if (response.status !== 200) {
                toast.error("Error fetching past exams");
                console.log("Error fetching past exams");
            } else {
                const data = await response.json();
                console.log(data);
                setPastExam(data.pastexams);
                console.log("past exams fetched");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handlePerfSub = async (e) => {
        setPerfSub(e.target.value);
        console.log("Value:", e.target.value);
        setPerfLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/fetchPerf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authUser.token}`,
                },
                body: JSON.stringify({ subject: e.target.value }),
            });
            if (response.status !== 200) {
                toast.error("Error fetching performance");
                console.log("Error fetching performance");
            } else {
                const data = await response.json();
                console.log(data);
                setPerfSub(data.perf);
            }
        } catch (err) {
            console.log(err);
        }
        setPerfLoading(false);
    };

    if (loading) {
        return <div className="flex-1 bg-[#f5f5f5] p-8 md:p-12 lg:p-16">Loading...</div>;
    }
    return (
        <div className="flex-1 bg-[#f5f5f5] p-8 md:p-12 lg:p-16">
            <div className="max-w-[90%] mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-bold IBM_Plex_Mono">Enrolled Subjects</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">Manage enrolled subjects see their faulties and enroll in new subjects</p>
                        </div>
                        <div className="border-t px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold IBM_Plex_Mono">Subject List</h3>
                                <button className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">Add Subject</button>
                            </div>
                            <div className="overflow-x-auto max-h-[250px] mt-4">
                                <table className="w-full text-[0.8rem]">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Code</th>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Name</th>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Instructor</th>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Credits</th>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Dept.</th>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subject.length > 0 ? (
                                            subject.map((sub) => <SubjectRow key={sub[0]} subject={sub} />)
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    No subjects registered
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-bold IBM_Plex_Mono">Exam Schedule</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">View and manage the schedule of upcoming exams.</p>
                        </div>
                        <div className="border-t px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold IBM_Plex_Mono">Upcoming Exams</h3>
                            </div>
                            <div className="overflow-x-auto mt-4 max-h-[250px]">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Exam Id</th>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Date</th>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Time</th>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Subject</th>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exam.length > 0 ? (
                                            exam.map((ex) => <ExamRow key={ex[0]} exam={ex} />)
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    No upcoming exams
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-bold IBM_Plex_Mono">Past Exam</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">View your past attended exams and scores</p>
                        </div>
                        <div className="border-t px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold IBM_Plex_Mono">Past Exams</h3>
                            </div>
                            <div className="overflow-x-auto mt-4 max-h-[250px]">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Exam Id</th>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Date</th>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Time</th>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Subject</th>
                                            <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pastExam?.length > 0 ? (
                                            pastExam.map((pex) => <PastExamRow key={pex[0]} exam={pex} />)
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    No past exams
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-bold IBM_Plex_Mono">Subject Performance</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">View your past attended exams and scores</p>
                            <span className="text-sm text-gray-500 mt-2 IBM_Plex_Mono">
                                <select className=" p-1 mt-1 shadow-md" id="perfSub" name="perfSub" onChange={handlePerfSub} value={perfSub}>
                                    <option value="" default disabled hidden>
                                        Select a subject to view performance
                                    </option>
                                    {subject.length > 0 ? (
                                        subject.map((sub) => (
                                            <option key={sub[0]} value={sub[1]}>
                                                {sub[2]}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            No subjects registered
                                        </option>
                                    )}
                                </select>
                            </span>
                        </div>
                        <div className="border-t px-6 py-4">
                            {!perfloading && perfSub ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold IBM_Plex_Mono">
                                            <button
                                                onClick={() => setActivePerf("score")}
                                                className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors"
                                            >
                                                Scores
                                            </button>
                                            <button
                                                onClick={() => setActivePerf("graph")}
                                                className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors"
                                            >
                                                Graph
                                            </button>
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto mt-4">
                                        {activePerf === "score" ? (
                                            <table className="w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Date</th>
                                                        <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Time</th>

                                                        <th className="text-left px-4 py-2 font-bold IBM_Plex_Mono">Score</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {perfSub.length > 0 ? (
                                                        perfSub.map((pex) => <PastExamRow2 key={pex[0]} exam={pex} />)
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="text-center">
                                                                No scores found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <>
                                                <CustomBarChart exam={perfSub} />
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p className="text-center text-gray-500 mt-2 IBM_Plex_Mono">Select a subject to view performance</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const SubjectRow = ({ subject }) => {
    return (
        <tr key={subject[0]} className="border-b">
            <td className="px-4 py-3">{subject[1]}</td>
            <td className="px-4 py-3">{subject[2]}</td>
            <td className="px-4 py-3">{subject[6] + " " + subject[7]}</td>
            <td className="px-4 py-3">{subject[4]}</td>
            <td className="px-4 py-3">{subject[5]}</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <button className="bg-white text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-4 w-4">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
};

const ExamRow = ({ exam }) => {
    return (
        <tr className="border-b">
            <td className="px-4 py-3">{exam[0]}</td>
            <td className="px-4 py-3">{exam[2]}</td>
            <td className="px-4 py-3">{exam[3]}</td>
            <td className="px-4 py-3">{exam[4]}</td>
        </tr>
    );
};

const PastExamRow2 = ({ exam }) => {
    return (
        <tr className="border-b">
            <td className="px-4 py-3">{exam[0]}</td>
            <td className="px-4 py-3">{exam[1]}</td>
            <td className="px-4 py-3">{exam[2]}</td>
        </tr>
    );
};

const PastExamRow = ({ exam }) => {
    return (
        <tr className="border-b">
            <td className="px-4 py-3">{exam[0]}</td>
            <td className="px-4 py-3">{exam[2]}</td>
            <td className="px-4 py-3">{exam[3]}</td>
            <td className="px-4 py-3">{exam[1]}</td>
            <td className="px-4 py-3">{exam[4]}</td>
        </tr>
    );
};

const CustomBarChart = ({ exam }) => {
    // Format data
    const data = exam.map((ex) => ({
        date: ex[0], // Assuming ex[0] is the date
        score: ex[2], // Assuming ex[2] is the score
    }));

    if (data.length === 0) {
        return <p className="text-center text-gray-500 mt-2">No data available</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};
