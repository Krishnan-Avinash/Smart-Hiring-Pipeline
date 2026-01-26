import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const CandidateLanding = () => {
  const [jobs, setJobs] = useState([]);
  async function getJobs() {
    console.log("in");
    const res = await api.get("/jobs/getAllJobs");
    console.log(res);
    setJobs(res.data);
  }
  useEffect(() => {
    getJobs();
  }, []);
  return (
    <div>
      <h1>Hlo</h1>
      {jobs?.map((item, index) => (
        <div map={index}>{item.companyName}</div>
      ))}
    </div>
  );
};

export default CandidateLanding;

//WE WILL SHOW ALL AVAILABLE JOBS HERE AND GIVE OPTION FOR USER TO APPLY
// [
//     {
//         "jobId": 1,
//         "title": "JOB IN ASTOR",
//         "location": "A",
//         "status": "A",
//         "companyName": "ASTOR",
//         "description": "A",
//         "employmentType": "A",
//         "experienceMin": 1,
//         "experienceMax": 2,
//         "requiredSkills": "C++, Python",
//         "prioritySkills": "Mongodb, MySQL, Java"
//     },
//     {
//         "jobId": 2,
//         "title": "JOB IN ASTOR",
//         "location": "A",
//         "status": "A",
//         "companyName": "ASTOR",
//         "description": "Aryan JOB",
//         "employmentType": "A",
//         "experienceMin": 1,
//         "experienceMax": 2,
//         "requiredSkills": "C++, Python",
//         "prioritySkills": "Mongodb, MySQL, Java"
//     },
//     {
//         "jobId": 3,
//         "title": "ARYAN JOB IN ASTOR",
//         "location": "A",
//         "status": "A",
//         "companyName": "OREON COMPANYs",
//         "description": "NEW JOB",
//         "employmentType": "A",
//         "experienceMin": 1,
//         "experienceMax": 2,
//         "requiredSkills": "C++, Python",
//         "prioritySkills": "Mongodb, MySQL, Java"
//     }
// ]
