export default function TeacherDashboard() {
    return (
        <div className="flex-1 bg-[#f5f5f5] p-8 md:p-12 lg:p-16">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Enrolled Subjects</h3>
                            <p className="text-gray-500 mt-2 IBM_Plex_Mono">Manage enrolled subjects see their faulties and enroll in new subjects</p>
                        </div>
                        <div className="border-t px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Subject List</h3>
                                <button className="bg-[#0070f3] text-white px-4 py-2 rounded-md hover:bg-[#0060d3] transition-colors">Add Subject</button>
                            </div>
                            <div className="overflow-x-auto max-h-[250px] mt-4">
                                <table className="w-full ">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2 font-medium">Code</th>
                                            <th className="text-left px-4 py-2 font-medium">Name</th>
                                            <th className="text-left px-4 py-2 font-medium">Instructor</th>
                                            <th className="text-left px-4 py-2 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <SubjectRow subject="Mathematics" />
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <ExamRow />
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Past Exam</h3>
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
                    </div>
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium IBM_Plex_Mono">Past Exam</h3>
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
                    </div>
                </div>
            </div>
        </div>
    );
}

const SubjectRow = ({ subject }) => {
    return (
        <tr className="border-b">
            <td className="px-4 py-3">John Doe</td>
            <td className="px-4 py-3">12345</td>
            <td className="px-4 py-3">A</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <button className="bg-white text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-4 w-4">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
};

const ExamRow = ({ date, time, subject }) => {
    return (
        <tr className="border-b">
            <td className="px-4 py-3">2023-05-15</td>
            <td className="px-4 py-3">9:00 AM - 11:00 AM</td>
            <td className="px-4 py-3">Mathematics</td>
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
