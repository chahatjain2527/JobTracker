import React, { useState, useEffect } from "react"
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
    const [statusCount, setStatusCount] = useState({});
    const [applications, setApplications] = useState([]);
    const [decodedData, setdecodedData] = useState();
    const [compName, setCompName] = useState("");
    const [status, setstatus] = useState("All");
    const fetchMyDashboardData = async (userId, status = "All", companyName = "") => {
        try {
            if (!userId) {
                console.log("User Id Not Found");
                return;
            }
            var data = await api.get("/application/get", { params: { Status: status, Name: companyName } });
            setApplications(data.data.data)
            const count = {
                applied: 0,
                interview: 0,
                rejected: 0,
                offer: 0
            };
            data.data.data.forEach((item) => {
                const status = item.Status?.toLowerCase();
                if (count.hasOwnProperty(status)) {
                    count[status] += 1;
                }
            });
            setStatusCount(count);
        }
        catch (error) {
            return;
        }
    };
    const [loginRole, setLoginRole] = useState("User");
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        const decoded = jwtDecode(token);
        setdecodedData(decoded);
        setLoginRole(decoded.role);
        fetchMyDashboardData(decoded.userId);

    }, []);
    const statusChangeHandle = async (Id, e) => {
        try {
            const changeStatus = e.target.value;
            var data = await api.put("/application/updateStatus/" + Id, { status:changeStatus });
            fetchMyDashboardData(decodedData.userId, status, compName);
        }
        catch (error) {
            console.log("Update status Error=>", error.response.data);
        }
    };

    const handleClick = async (e) => {
        setstatus(e.target.value);
        fetchMyDashboardData(decodedData.userId, e.target.value, compName);
    };
    const handleBlur = async (e) => {
        fetchMyDashboardData(decodedData.userId, status, e.target.value);
    };
    return (
        <div>
            <h2>Welcome {loginRole}</h2>
            <div>
                <label> Applied: {statusCount.applied}</label>
                <label> Interview: {statusCount.interview}</label>
                <label> Rejected: {statusCount.rejected}</label>
                <label> Offer: {statusCount.offer}</label>
            </div>
            <br></br>
            <div>
                <label><input className="statusCls" type="radio" defaultChecked name="statusFilter" value="All" onClick={handleClick} />All</label>
                <label><input className="statusCls" type="radio" name="statusFilter" value="applied" onClick={handleClick} />Applied</label>
                <label><input className="statusCls" type="radio" name="statusFilter" value="interview" onClick={handleClick} />Interview</label>
                <label><input className="statusCls" type="radio" name="statusFilter" value="rejected" onClick={handleClick} />Rejected</label>
                <label><input className="statusCls" type="radio" name="statusFilter" value="offer" onClick={handleClick} />Offer</label>
                &nbsp;&nbsp;&nbsp;<input type="text" onBlur={handleBlur} onChange={(e) => setCompName(e.target.value)} className="nameCls" value={compName} placeholder="Enter Company Name" />
            </div>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>Company</td>
                        <td>Contact</td>
                        <td>Status</td>
                        <td>Updated On</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {applications.length > 0 ? applications.map((company, index) => {
                        return (
                            <tr key={company._id}>
                                <td>{index + 1}</td>
                                <td>{company.CompanyId.companyName}</td>
                                <td>{company.CompanyId.contactName}</td>
                                <td>{company.Status}</td>
                                <td>{company.AppliedDate}</td>
                                <td>
                                    <select value={company.Status.toLowerCase()} className="appliStatusCls" onChange={(e) => statusChangeHandle(company._id, e)}>
                                        <option value="applied">Applied</option>
                                        <option value="interview">Interviewed</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="offer">Offer</option>
                                    </select>
                                </td>
                            </tr>);
                    }) : <tr><td colSpan="6">No Data Found</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;