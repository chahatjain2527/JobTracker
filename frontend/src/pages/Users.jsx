import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader"

const GetAllUsers = () => {
    const [userData, setUserData] = useState([]);
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        fetchAllUsers();
    }, []);
    const fetchAllUsers = async () => {
        try {
            setLoader(true);
            const res = await api.get("/users/getAll");
            setUserData(res.data.data);
        } catch (error) {
            console.log("Error in feteching users=>", error);
        }
        finally {
            setLoader(false);
        }
    }
    if (loader) return <Loader />;

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6">
            <div className="mx-auto max-w-6xl space-y-6">
                <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
                    <p className="mt-2 text-sm text-slate-600">All users registered to application.</p>
                </section>
                <section className="rounded-3xl bg-white shadow-sm border border-slate-200">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    {['Sr.No', 'Name', 'Email', 'Subscription'].map((label) => (
                                        <th key={label} className="px-4 py-3 text-center font-medium">{label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {userData.length > 0 ? userData.map((data, index) => (
                                    <tr key={data._id} className="hover:bg-slate-50">
                                        <td className="px-4 py-4 text-center">{index + 1}</td>
                                        <td className="px-4 py-4 text-center">{data.name}</td>
                                        <td className="px-4 py-4 text-center">{data.email}</td>
                                        <td className="px-4 py-4 text-center">{data.subscriptionStatus}</td>
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
                        {userData.length > 0 ? (
                            <div className="space-y-4">
                                {userData.map((data, index) => (
                                    <div key={data._id} className="rounded-2xl border border-slate-300 bg-slate-50 p-4 space-y-3">
                                        <h3 className="font-semibold text-slate-900">{data.name}</h3>
                                        <div className="text-sm text-slate-600 space-y-2">
                                            <p><span className="font-medium">Email:</span> {data.email}</p>
                                            <p><span className="font-medium">Subscription:</span> {data.subscriptionStatus}</p>
                                        </div>
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

export default GetAllUsers;