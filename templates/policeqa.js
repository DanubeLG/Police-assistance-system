function policeQuestionEngine(){
  if(!caseData.stage) caseData.stage = "interview";

  if(caseData.TCI?.issues?.length){
    caseData.stage = "contradiction";
    return "Your FIR has contradictions: " + caseData.TCI.issues.join(" | ") + ". Please clarify correct details.";
  }

  if(caseData.TCA?.contradictions?.length){
    caseData.stage = "contradiction";
    return "Contradiction found between FIR and statement: " + caseData.TCA.contradictions.join(" | ") + ". Which is correct?";
  }

  if(!caseData.RLE?.suspects || caseData.RLE.suspects.length===0){
    caseData.stage = "suspect_discovery";
    return "No suspects identified. Did the victim mention any name, relationship, or dispute?";
  }

  if(caseData.stage === "interview"){
    let pending = caseData.RLE.suspects.find(s=>!s.interviewStatement);
    if(pending){
      return `Interview suspect ${pending.name}: Where were you during the incident time (${caseData.Date || "Unknown Date"} ${caseData.Time || ""})? Provide alibi.`;
    } else {
      caseData.stage = "evidence";
    }
  }

  if(caseData.stage === "evidence"){
    if(!caseData.externalEvidence){
      return "All suspects interviewed. Do you have CCTV evidence, call records, or witness names to verify alibis?";
    } else {
      caseData.stage = "analysis";
    }
  }

  if(caseData.stage === "analysis"){
    return "Evidence recorded. Type FINAL to generate ranking or type RECHECK to re-check suspects.";
  }

  if(caseData.stage === "final"){
    return "Final ranking generated. Investigation complete.";
  }

  return "Investigation ongoing. Provide more inputs.";
}

function updateFromPoliceAnswer(answer){
  answer = answer.trim();
  if(!answer) return;

  if(!caseData.StatementUsed) caseData.StatementUsed = "";
  caseData.StatementUsed += " " + answer;

  if(caseData.stage === "analysis"){
    if(answer.toLowerCase().includes("final")){
      caseData.stage = "final";
      return;
    }
    if(answer.toLowerCase().includes("recheck")){
      caseData.stage = "interview";
      caseData.externalEvidence = null;
      return;
    }
  }

  if(caseData.stage === "evidence"){
    caseData.externalEvidence = answer;
    caseData.stage = "analysis";
    return;
  }

  let pendingIndex = caseData.RLE.suspects.findIndex(s=>!s.interviewStatement);
  if(pendingIndex !== -1){
    let suspect = caseData.RLE.suspects[pendingIndex];
    suspect.interviewStatement = answer;

    if(answer.toLowerCase().includes("alone")){
      suspect.alibiWeak = true;
      suspect.contradictions = suspect.contradictions || [];
      suspect.contradictions.push("Weak alibi: claims alone.");
    }
  }
}


function renderOutput(){
  const outputDiv=document.getElementById("output");
  if(!caseData) return;

  let suspectsHtml = "None";

  if(caseData.RLE?.suspects?.length){
    suspectsHtml = caseData.RLE.suspects.map(s=>`
      <p>
        <b>Name:</b> ${s.name}<br>
        <b>Reason:</b> ${s.reason}<br>
        <b>Location:</b> ${s.location || "Unknown"}<br>
        <b>Traits:</b> ${s.traits.join(", ") || "None"}<br>
        <b>Evidence Score (FCI):</b> ${s.evidenceScore || 0}<br>
        <b>Final Score (EAS):</b> ${s.finalScore || 0}<br>
        <b>Interview:</b> ${s.interviewStatement ? "Provided" : "Pending"}<br>
        <b>Contradictions:</b> ${(s.contradictions||[]).join(", ") || "None"}<br>
      </p>
      <hr>
    `).join("");
  }

  outputDiv.innerHTML = `
    <h3>Investigation Report</h3>
    <p><b>TCI:</b> ${caseData.TCI?.status || "N/A"}</p>
    <p><b>TCA:</b> ${caseData.TCA?.status || "N/A"}</p>

    <h4>Suspects Identified:</h4>
    ${suspectsHtml}

    <p><b>Total Case Evidence Score:</b> ${caseData.EAS?.totalEvidenceScore || 0}</p>
    <p><b>High-Priority Suspects:</b> ${caseData.EAS?.highPrioritySuspects?.join(", ") || "None"}</p>

    <hr>
    <h4>Next Police Question</h4>
    <p>${policeQuestionEngine()}</p>
  `;
}
