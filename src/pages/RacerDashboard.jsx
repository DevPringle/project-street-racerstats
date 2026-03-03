// This page serves as a wrapper/redirect to show the HTML file is embedded
// The actual dashboard is a standalone HTML file
import React from "react";

export default function RacerDashboard() {
  return (
    <div style={{width:"100%",height:"100vh",background:"#060a14",display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",fontFamily:"system-ui"}}>
      <p>Use the standalone RacerStats HTML file.</p>
    </div>
  );
}
