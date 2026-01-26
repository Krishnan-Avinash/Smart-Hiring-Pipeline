import { useEffect, useState } from "react";
import api from "../../api/axios";

const AppliedJobs = () => {
  const [apps, setApps] = useState([]);

  async function getAllAppliedJobs() {
    const res = await api.get("/application/myApplications");
    console.log(res.data);
    setApps(res.data);
  }

  useEffect(() => {
    getAllAppliedJobs();
  }, []);

  return (
    <div>
      <h1>Hlo</h1>
      {apps?.map((item, index) => (
        <div key={index}>{item.status}</div>
      ))}
    </div>
  );
};

export default AppliedJobs;
