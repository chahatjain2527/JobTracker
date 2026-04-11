import { useEffect, useState } from "react";
import api from "../services/api";

const GetPendingCompanies = () => {
    const [companyData, setCompanyData] = useState([]);
    const fetchPendingCompanies = async () => {
        try {
            const res = await api.get("/company/pending");
            console.log("PC List=>", res.data.data);
            setCompanyData(res.data.data);
        }
        catch (error) {
            console.log("PC fetch error=>", error);
        }
    };
    const updateStatus = async (id, status) => {
        try {
            const res = await api.put("/company/updateStatus/" + id, { status });
            console.log("update stauts res=>", res);
            fetchPendingCompanies();
        }
        catch (error) {
            console.log("update status error=>", error);
        }

    };
    useEffect(() => {
        fetchPendingCompanies();
    }, []);
    return (
        <div>
            <h2>Companies</h2>
            <table>
                <thead>
                    <tr>
                        <td>Sr.No</td>
                        <td>CompanyName</td>
                        <td>ContactName</td>
                        <td>ContactType</td>
                        <td>CreatedBy</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {companyData.length > 0 ? companyData.map((data, index) => (
                        <tr key={data._id}>
                            <td>{index + 1}</td>
                            <td>{data.companyName}</td>
                            <td>{data.contactName}</td>
                            <td>{data.contactType}</td>
                            <td>{data.createdBy?.name}</td>
                            <td>
                                <button onClick={() => updateStatus(data._id, "approved")}>Approved</button> /
                                <button onClick={() => updateStatus(data._id, "rejected")}>Reject</button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="6">No Data Found</td></tr>}
                </tbody>
            </table>
        </div>
    );
}

export default GetPendingCompanies;