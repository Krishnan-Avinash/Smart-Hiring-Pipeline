import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/recruiterApplicants.scss";

import {
  DndContext,
  closestCorners,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";

const statuses = ["APPLIED", "SHORTLISTED", "INTERVIEW"];

const RecruiterJobApplicants = () => {

  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications,setApplications] = useState([]);
  const [jobTitle,setJobTitle] = useState("");
  const [loading,setLoading] = useState(true);

  const fetchJobTitle = async () => {
    const res = await api.get(`/jobs/getJobById/${jobId}`);
    setJobTitle(res.data.title);
  };

  const generateScore = async (applicationId)=>{
    try{
      await api.post(`/resumeScore/createNew/${applicationId}`);
    }catch{}
  };

  const fetchScore = async (applicationId)=>{
    try{
      const res = await api.get(`/resumeScore/getScore/${applicationId}`);
      return res.data;
    }catch{
      return null;
    }
  };

  const fetchApplicants = async ()=>{
    const res = await api.get(`/application/getApplicationsForAJob/${jobId}`);
    const apps = res.data;

    const updated = await Promise.all(
      apps.map(async(app)=>{

        let score = await fetchScore(app.applicationId);

        if(!score){
          await generateScore(app.applicationId);
          score = await fetchScore(app.applicationId);
        }

        return{
          ...app,
          aiScore:score?.aiScore ?? null,
          keywordScore:score?.keywordScore ?? null,
          finalScore:score?.finalScore ?? null
        };

      })
    );

    setApplications(updated);
    setLoading(false);
  };

  useEffect(()=>{
    fetchJobTitle();
    fetchApplicants();
  },[]);

  // 🔥 IMPORTANT: backend update
  const updateStatus = async (applicationId, newStatus) => {
    return api.patch(
      `/application/updateStatus/${applicationId}`,
      { status: newStatus }
    );
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const applicationId = active.id;
    const newStatus = over.id;

    const oldApp = applications.find(a => a.applicationId === applicationId);
    const oldStatus = oldApp.status;

    if (oldStatus === newStatus) return;

    // ✅ Optimistic UI update
    const updatedApps = applications.map(a =>
      a.applicationId === applicationId
        ? { ...a, status: newStatus }
        : a
    );

    setApplications(updatedApps);

    try {
      await updateStatus(applicationId, newStatus);
    } catch (err) {
      console.error("Backend failed, reverting...", err);

      // ❌ revert if backend fails
      const reverted = applications.map(a =>
        a.applicationId === applicationId
          ? { ...a, status: oldStatus }
          : a
      );
      setApplications(reverted);
    }
  };

  if(loading) return <p className="loading">Loading Applicants...</p>;

  return(

    <div className="pipeline">

      <button
        className="back-btn"
        onClick={()=>navigate("/recruiterLanding")}
      >
        ← Back
      </button>

      <h1>
        Applicants for <span>{jobTitle}</span>
      </h1>

      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >

        <div className="board">

          {statuses.map(status=>{

            const apps = applications
            .filter(a => a.status === status)
            .sort((a,b)=>(b.finalScore||0)-(a.finalScore||0));

            return(
              <Column
                key={status}
                status={status}
                apps={apps}
              />
            );
          })}

        </div>

      </DndContext>

    </div>

  );

};

const Column = ({status,apps})=>{

  const {setNodeRef} = useDroppable({
    id:status
  });

  return(

    <div ref={setNodeRef} className={`column ${status.toLowerCase()}`}>

      <h2>
        {status} ({apps.length})
      </h2>

      {apps.map(app=>(
        <CandidateCard key={app.applicationId} app={app}/>
      ))}

    </div>

  );

};

const CandidateCard = ({app})=>{

  const {attributes,listeners,setNodeRef,transform} = useDraggable({
    id:app.applicationId
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px,${transform.y}px,0)`
      : undefined
  };

  return(

    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="candidate-card"
    >

      <h3>{app.name}</h3>

      <p className="email">{app.email}</p>

      <a
        href={app.resumeUrl}
        target="_blank"
        rel="noreferrer"
        className="resume-link"
      >
        View Resume
      </a>

      <div className="scores">

        <div className="score">
          <span>AI Score: {app.aiScore ?? "..."}</span>
          <div className="bar">
            <div style={{width:`${app.aiScore || 0}%`}}/>
          </div>
        </div>

        <div className="score">
          <span>Keyword Score: {app.keywordScore ?? "..."}</span>
          <div className="bar">
            <div style={{width:`${app.keywordScore || 0}%`}}/>
          </div>
        </div>

        <div className="final">
          Final Score: {app.finalScore ?? "..."}
        </div>

      </div>

    </div>

  );

};

export default RecruiterJobApplicants;