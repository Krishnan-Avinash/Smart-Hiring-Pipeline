import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/recruiterApplicants.scss";
import { useSnackbar } from "../../context/SnackbarContext";

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
  const { showSnackbar } = useSnackbar();

  const [applications,setApplications] = useState([]);
  const [jobTitle,setJobTitle] = useState("");
  const [loading,setLoading] = useState(true);

  const [bulkMode,setBulkMode] = useState(false);
  const [selectedIds,setSelectedIds] = useState([]);

  const fetchJobTitle = async () => {
  try {
    const res = await api.get(`/jobs/getJobById/${jobId}`);
    setJobTitle(res.data.title);
  } catch (err) {
    console.error(err);

    if (![401, 403].includes(err.response?.status)) {
      showSnackbar("Failed to load job details");
    }
  }
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

  const fetchApplicants = async () => {
  try {
    const res = await api.get(
      `/application/getApplicationsForAJob/${jobId}`
    );

    const apps = res.data;

    const updated = await Promise.all(
      apps.map(async (app) => {
        let score = await fetchScore(app.applicationId);

        if (!score) {
          await generateScore(app.applicationId);
          score = await fetchScore(app.applicationId);
        }

        return {
          ...app,
          aiScore: score?.aiScore ?? null,
          keywordScore: score?.keywordScore ?? null,
          finalScore: score?.finalScore ?? null,
        };
      })
    );

    setApplications(updated);

  } catch (err) {
    console.error(err);

    if (![401, 403].includes(err.response?.status)) {
      showSnackbar("Failed to load applicants");
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(()=>{
    const saved = localStorage.getItem(`apps_${jobId}`);

    if(saved){
      setApplications(JSON.parse(saved));
      setLoading(false);
      fetchJobTitle();
    } else {
      fetchJobTitle();
      fetchApplicants();
    }
  },[]);

  useEffect(()=>{
    if(applications.length){
      localStorage.setItem(`apps_${jobId}`, JSON.stringify(applications));
    }
  },[applications]);

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
    if (oldApp.status === newStatus) return;

    const updatedApps = applications.map(a =>
      a.applicationId === applicationId
        ? { ...a, status: newStatus }
        : a
    );

    setApplications(updatedApps);

    try {
      await updateStatus(applicationId, newStatus);
    } catch {
      setApplications(applications);
      if (![401, 403].includes(err.response?.status)) {
    showSnackbar("Failed to update candidate status");
  }
    }
  };

  const toggleSelect = (id)=>{
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x=>x!==id)
        : [...prev,id]
    );
  };

  const handleBulkMove = async (newStatus)=>{
    if(!selectedIds.length) return;

    const updated = applications.map(app =>
      selectedIds.includes(app.applicationId)
        ? { ...app, status:newStatus }
        : app
    );

    setApplications(updated);
    setSelectedIds([]);
    setBulkMode(false);

    try {
  await Promise.all(
    selectedIds.map(id => updateStatus(id, newStatus))
  );
} catch (err) {
  console.error(err);

  if (![401, 403].includes(err.response?.status)) {
    showSnackbar("Bulk update failed");
  }
}
  };

  const handleBack = () => {
  navigate("/recruiterLanding");
};

  if(loading) return <p className="loading">Loading Applicants...</p>;

  return(
    <div className="pipeline">

      {/* HEADER ROW */}
      <div className="top-bar">

        <button className="back-btn" onClick={handleBack}>
          ← Back
        </button>

        <button
          className="bulk-btn"
          onClick={()=>{
            setBulkMode(prev=>!prev);
            setSelectedIds([]);
          }}
        >
          {bulkMode ? "Cancel" : "Select Candidates"}
        </button>

      </div>

      {/* TITLE */}
      <h1>
        Candidates for <span>{jobTitle}</span>
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
                bulkMode={bulkMode}
                selectedIds={selectedIds}
                toggleSelect={toggleSelect}
                onColumnClick={(s)=>{
                  if(bulkMode) handleBulkMove(s);
                }}
              />
            );
          })}

        </div>
      </DndContext>
    </div>
  );
};

const Column = ({status,apps,bulkMode,selectedIds,toggleSelect,onColumnClick})=>{

  const {setNodeRef} = useDroppable({ id:status });

  return(
    <div
      ref={setNodeRef}
      className={`column ${status.toLowerCase()}`}
      onClick={()=>onColumnClick(status)}
    >
      <h2>{status} ({apps.length})</h2>

      {apps.map(app=>(
        <CandidateCard
          key={app.applicationId}
          app={app}
          bulkMode={bulkMode}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
        />
      ))}
    </div>
  );
};

const CandidateCard = ({ app, bulkMode, selectedIds, toggleSelect }) => {

  const [open,setOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: app.applicationId });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 9999 : "auto"
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`candidate-card ${isDragging ? "dragging" : ""}`}
    >

      <div className="card-header">

        {bulkMode && (
          <input
            type="checkbox"
            checked={selectedIds.includes(app.applicationId)}
            onChange={(e)=>{
              e.stopPropagation();
              toggleSelect(app.applicationId);
            }}
          />
        )}

        <div
          className="name"
          onClick={(e)=>{
            e.stopPropagation();
            setOpen(prev=>!prev);
          }}
        >
          {app.name}
        </div>

        <div className="right-section">

          <span className="mini-score">
            {app.finalScore ?? "..."}
          </span>

          <span
            className="drag-handle"
            {...listeners}
            {...attributes}
          >
            ⠿
          </span>

        </div>
      </div>

      {open && (
        <div className="card-body">

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
                <div style={{ width: `${app.aiScore || 0}%` }} />
              </div>
            </div>

            <div className="score">
              <span>Keyword Score: {app.keywordScore ?? "..."}</span>
              <div className="bar">
                <div style={{ width: `${app.keywordScore || 0}%` }} />
              </div>
            </div>

            <div className="final">
              Final Score: {app.finalScore ?? "..."}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterJobApplicants;