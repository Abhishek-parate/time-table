import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

const DetailedTimetableManagement = () => {

  const { tid } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!tid) {
      navigate("/manage-timetable");
    }
  }, [tid, navigate]);

  return <div>DetailedTimetableManagement - TID: {tid}</div>;
  
}
export default DetailedTimetableManagement;
