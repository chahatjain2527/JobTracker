import React, { useState, useEffect } from "react"
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import Loader from "../components/Loader";

const Dashboard = () => {
    const [statusCount, setStatusCount] = useState({});
    const [applications, setApplications] = useState([]);
    const [decodedData, setdecodedData] = useState();
    const [compName, setCompName] = useState("");
    const [status, setstatus] = useState("All");
    const [loginRole, setLoginRole] = useState("User");
    const [loginName, setLoginName] = useState("");
    const [loader, setLoader] = useState(false);

    const fetchMyDashboardData = async (userId, status = "All", companyName = "") => {
        try {
            if (!userId) return;
            setLoader(true);
            const data = await api.get("/application/get", { params: { Status: status, Name: companyName } });
            setApplications(data.data.data);
            const count = {
                applied: 0,
                interview: 0,
                rejected: 0,
                offer: 0
            };
            data.data.data.forEach((item) => {
                const itemStatus = item.Status?.toLowerCase();
                if (count.hasOwnProperty(itemStatus)) {
                    count[itemStatus] += 1;
                }
            });
            setStatusCount(count);
        }
        catch (error) {
            console.log("Dashboard load error", error);
        }
        finally {
            setLoader(false);
        }
    };
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        const decoded = jwtDecode(token);
        setdecodedData(decoded);
        setLoginRole(decoded.role || "User");
        setLoginName(decoded.userName || "User");
        fetchMyDashboardData(decoded.userId);
    }, []);

    const statusChangeHandle = async (Id, e) => {
        try {
            const changeStatus = e.target.value;
            await api.put("/application/updateStatus/" + Id, { status: changeStatus });
            fetchMyDashboardData(decodedData.userId, status, compName);
        }
        catch (error) {
            console.log("Update status error", error?.response || error);
        }
    };

    const handleClick = async (e) => {
        setstatus(e.target.value);
        fetchMyDashboardData(decodedData.userId, e.target.value, compName);
    };
    const handleBlur = async (e) => {
        fetchMyDashboardData(decodedData.userId, status, e.target.value);
    };

    if (loader) return <Loader />;
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6">
            <div className="mx-auto max-w-6xl space-y-6">
                <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div style={{ "display": "none" }}>
                            <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
                            <p className="text-sm text-slate-500">{loginName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {['Applied', 'Interview', 'Rejected', 'Offer'].map((label) => (
                                <div key={label} className="rounded-2xl bg-slate-50 p-4 text-center">
                                    <div className="text-sm text-slate-500">{label}</div>
                                    <div className="mt-2 text-2xl font-semibold text-slate-900">{statusCount[label.toLowerCase()] || 0}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-3 items-center">
                            {['All', 'applied', 'interview', 'rejected', 'offer'].map((item) => (
                                <label key={item} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                                    <input
                                        type="radio"
                                        className="h-4 w-4 text-slate-900"
                                        name="statusFilter"
                                        value={item}
                                        checked={status === item}
                                        onChange={handleClick}
                                    />
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </label>
                            ))}
                        </div>
                        <div className="max-w-xs">
                            <input
                                type="text"
                                onBlur={handleBlur}
                                onChange={(e) => setCompName(e.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-700 focus:outline-none"
                                value={compName}
                                placeholder="Filter by company name"
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl bg-white shadow-sm border border-slate-200">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    {['#', 'Company', 'Contact', 'Status', 'Updated On', 'Action'].map((label) => (
                                        <th key={label} className="px-4 py-3 text-center font-medium">{label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {applications.length > 0 ? applications.map((company, index) => (
                                    <tr key={company._id} className="hover:bg-slate-50">
                                        <td className="px-4 py-4 text-center">{index + 1}</td>
                                        <td className="px-4 py-4 text-center">{company.CompanyId.companyName}</td>
                                        <td className="px-4 py-4 text-center">{company.CompanyId.contactName}</td>
                                        <td className="px-4 py-4 text-center">{company.Status}</td>
                                        <td className="px-4 py-4 text-center">{company.AppliedDate}</td>
                                        <td className="px-4 py-4 text-center">
                                            <select
                                                value={company.Status.toLowerCase()}
                                                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900"
                                                onChange={(e) => statusChangeHandle(company._id, e)}
                                            >
                                                <option value="applied">Applied</option>
                                                <option value="interview">Interviewed</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="offer">Offer</option>
                                            </select>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-slate-500">No data found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden p-6">
                        {applications.length > 0 ? (
                            <div className="space-y-4">
                                {applications.map((company, index) => (
                                    <div key={company._id} className="rounded-2xl border border-slate-300 bg-slate-50 p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-slate-900">{company.CompanyId.companyName}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${company.Status.toLowerCase() === 'applied' ? 'bg-blue-100 text-blue-800' :
                                                company.Status.toLowerCase() === 'interview' ? 'bg-purple-100 text-purple-800' :
                                                    company.Status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {company.Status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-slate-600 space-y-1">
                                            <p><span className="font-medium">Contact:</span> {company.CompanyId.contactName}</p>
                                            <p><span className="font-medium">Applied:</span> {company.AppliedDate}</p>
                                        </div>
                                        <select
                                            value={company.Status.toLowerCase()}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 text-sm"
                                            onChange={(e) => statusChangeHandle(company._id, e)}
                                        >
                                            <option value="applied">Applied</option>
                                            <option value="interview">Interviewed</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="offer">Offer</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">No data found.</div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;
