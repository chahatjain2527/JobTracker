import { useEffect, useState } from "react";
import api from "../services/api";

// Popup Component
const ApplyAtCompany = ({ id, onClose,refresh }) => {
    const [applyDate, setApplyDate] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!applyDate) {
                alert("Enter Date");
                return;
            }
            var data = {
                companyId: id,
                date: applyDate
            }
            const res = await api.post("/application/create", data);
            console.log("Applied,", res);
            refresh();
            onClose();
        }
        catch (error) {
            console.log("Apply error=>", error.response);
            onClose();
        }
    }
    return (
        <div style={{
            position: "fixed", top: "0", left: "0",
            width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <div style={{
                background: "#fff", padding: "20px", borderRadius: "8px", minWidth: "300px"
            }}>
                <h3>Apply</h3>
                <div>
                    <label>Applied Date </label>
                    <input type="date" placeholder="Enter Date" name="AppliedDate" value={applyDate} onChange={(e) => setApplyDate(e.target.value)} />
                </div>
                <button onClick={onClose}>Close</button>
                <button onClick={handleSubmit} disabled={!applyDate}>Apply</button>
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
            console.log("Com res=>", allCompanyList.data.data);
            console.log("MyCom res=>", myAppliedList.data.data);
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
        <div>
            <h2>Companies</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>Company</td>
                        <td>Contact Name</td>
                        <td>Contact Email</td>
                        <td>Contact Phone</td>
                        <td>Contact Type</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {companies.map((company, index) => {
                         const hasApplied = applicationsMap[company._id];
                         return (
                        <tr key={company._id}>
                            <td>{index + 1}</td>
                            <td>{company.companyName}</td>
                            <td>{company.contactName}</td>
                            <td>{company.contactEmail}</td>
                            <td>{company.contactPhone}</td>
                            <td>{company.contactType}</td>
                            <td>
                                {hasApplied ? hasApplied.Status : <button onClick={() => {
                                    setSelectedCompanyId(company._id);
                                    setShowPopup(true);
                                }}>
                                    Apply
                                </button>}
                            </td>
                        </tr>
                         )
                    })}
                </tbody>
            </table>

            {/* Popup */}
            {showPopup && (
                <ApplyAtCompany
                    id={selectedCompanyId}
                    onClose={() => setShowPopup(false)}
                    refresh={fetchCompanies}
                />
            )}
        </div>
    );
};

export default GetCompanies;