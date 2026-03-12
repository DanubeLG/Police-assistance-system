
function SIM(){
  if(!caseData.RLE?.suspects) return;

  const section=document.getElementById("suspectInterviewSection");
  section.innerHTML="<h3>Suspect Interviews</h3>";

  caseData.RLE.suspects.forEach((s,index)=>{
    section.innerHTML += `
      <div class="suspect-section">
        <b>Suspect ${index+1}: ${s.name}</b><br><br>

        <label>Interview Statement:</label><br>
        <textarea id="suspectStmt_${index}" placeholder="Enter statement for ${s.name}">${s.interviewStatement || ""}</textarea><br>

        <button onclick="saveInterview(${index})">Save Statement</button>
      </div>
    `;
  });
}
