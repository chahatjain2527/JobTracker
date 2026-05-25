import { useEffect, useState } from "react";
import api from "../services/api";

const ApplyAtCompany = ({ id, onClose, refresh }) => {
    const [applyDate, setApplyDate] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!applyDate) return;
            await api.post("/application/create", { companyId: id, date: applyDate });
            refresh();
            onClose();
        }
        catch (error) {
            console.log("Apply error=>", error?.response || error);
            onClose();
        }
    }
    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Applied to company</h3>
                <label className="block text-sm text-slate-700 mb-2">Applied Date</label>
                <input
                    type="date"
                    value={applyDate}
                    onChange={(e) => setApplyDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-700 focus:outline-none"
                />
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50">Close</button>
                    <button onClick={handleSubmit} disabled={!applyDate} className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">Submit</button>
                </div>
            </div>
        </div>
    );
};

const GetCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [applications, setApplications] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);

    const fetchCompanies = async () => {
        try {
            const allCompanyList = await api.get("/company/get");
            const myAppliedList = await api.get("/application/get");
            setCompanies(allCompanyList.data.data);
            setApplications(myAppliedList.data.data);
        } catch (error) {
            console.log("getcompanies error", error);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const applicationsMap = applications.reduce((acc, app) => {
        acc[app.CompanyId._id] = app;
        return acc;
    }, {});

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6">
            <div className="mx-auto max-w-6xl space-y-6">
                <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-semibold text-slate-900">Companies</h2>
                    <p className="mt-2 text-sm text-slate-600">Browse companies and contact details.</p>
                </section>
                <section className="rounded-3xl bg-white shadow-sm border border-slate-200">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    {['#', 'Company', 'Contact Name', 'Contact Email', 'Contact Phone', 'Type', 'Action'].map((label) => (
                                        <th key={label} className="px-4 py-3 text-center font-medium">{label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {companies.length > 0 ? (companies.map((company, index) => {
                                    const hasApplied = applicationsMap[company._id];
                                    return (
                                        <tr key={company._id} className="hover:bg-slate-50">
                                            <td className="px-4 py-4 text-center">{index + 1}</td>
                                            <td className="px-4 py-4 text-center">{company.companyName}</td>
                                            <td className="px-4 py-4 text-center">{company.contactName}</td>
                                            <td className="px-4 py-4 text-center">{company.contactEmail}</td>
                                            <td className="px-4 py-4 text-center">{company.contactPhone}</td>
                                            <td className="px-4 py-4 text-center">{company.contactType}</td>
                                            <td className="px-4 py-4 text-center">
                                                {hasApplied ? (
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{hasApplied.Status}</span>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCompanyId(company._id);
                                                            setShowPopup(true);
                                                        }}
                                                        className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
                                                    >
                                                        Applied
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-slate-500">No data found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden p-6">
                        {companies.length > 0 ? (
                            <div className="space-y-4">
                                {companies.map((company, index) => {
                                    const hasApplied = applicationsMap[company._id];
                                    return (
                                        <div key={company._id} className="rounded-2xl border border-slate-300 bg-slate-50 p-4 space-y-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-semibold text-slate-900 flex-1">{company.companyName}</h3>
                                                {hasApplied && (
                                                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 whitespace-nowrap">{hasApplied.Status}</span>
                                                )}
                                            </div>
                                            <div className="text-sm text-slate-600 space-y-2">
                                                <p><span className="font-medium">Contact:</span> {company.contactName}</p>
                                                <p className="break-all"><span className="font-medium">Email:</span> {company.contactEmail}</p>
                                                <p><span className="font-medium">Phone:</span> {company.contactPhone}</p>
                                                {company.contactType && <p><span className="font-medium">Type:</span> {company.contactType}</p>}
                                            </div>
                                            {!hasApplied ? (
                                                <button
                                                    onClick={() => {
                                                        setSelectedCompanyId(company._id);
                                                        setShowPopup(true);
                                                    }}
                                                    className="w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-700 transition"
                                                >
                                                    Apply Now
                                                </button>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">No data found.</div>
                        )}
                    </div>
                </section>
            </div>
            {showPopup && (
                <ApplyAtCompany
                    id={selectedCompanyId}
                    onClose={() => setShowPopup(false)}
                    refresh={fetchCompanies}
                />
            )}
        </main>
    );
};

export default GetCompanies;
