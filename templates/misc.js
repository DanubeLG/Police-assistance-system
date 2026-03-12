//saveInterview + mergeSuspects + execute

function saveInterview(index){
  let textarea=document.getElementById(`suspectStmt_${index}`);
  if(!textarea) return;

  let statement=textarea.value.trim();
  if(!statement){
    alert("Statement cannot be empty.");
    return;
  }

  let s=caseData.RLE.suspects[index];
  s.interviewStatement=statement;

  if(statement.toLowerCase().includes("alone")){
    s.alibiWeak = true;
    s.contradictions = s.contradictions || [];
    if(!s.contradictions.includes("Weak alibi: claims alone.")){
      s.contradictions.push("Weak alibi: claims alone.");
    }
  }

  updatePipeline();
  alert(`Statement for ${s.name} saved successfully.`);
}


function mergeSuspects(oldSuspects, newSuspects){
  newSuspects.forEach(ns=>{
    let existing = oldSuspects.find(os=>os.name.toLowerCase() === ns.name.toLowerCase());
    if(existing){
      ns.interviewStatement = existing.interviewStatement || ns.interviewStatement;
      ns.alibiWeak = existing.alibiWeak || ns.alibiWeak;
      ns.contradictions = existing.contradictions || ns.contradictions;
    }
  });
  return newSuspects;
}

async function updatePipeline() {
    let oldSuspects = caseData.RLE?.suspects
        ? JSON.parse(JSON.stringify(caseData.RLE.suspects))
        : [];

  
    caseData = await TCI(caseData);
    caseData = TCA(caseData);
    caseData = RLE(caseData);

    if (oldSuspects.length > 0) {
        caseData.RLE.suspects = mergeSuspects(oldSuspects, caseData.RLE.suspects);
    }

    if (nbModel.total) { 
  
        let prediction = predictCrime(
            caseData.Location || "unknown",
            Number(document.getElementById("age")?.value || 30),
            document.getElementById("gender")?.value || "unknown",
            caseData.Weapon || "unknown"
        );

        caseData.predictedCrime = prediction.crime;
        caseData.predictedCrimeScore = prediction.score;
    }
    caseData = FCI(caseData);
    caseData = EAS(caseData);

    localStorage.setItem("Current_Case", JSON.stringify(caseData));

    SIM();
    renderOutput();
}


async function execute() {
    let fir = document.getElementById("firDetails").value.trim();
    let victimAlive = document.getElementById("victimAlive").value;

    if (!fir || !victimAlive) {
        alert("Complete required fields.");
        return;
    }

    let statementToCompare = "", firFiler = "";

    if (victimAlive === "yes") {
        statementToCompare = document.getElementById("victimStatement")?.value.trim() || "";
    }

    if (victimAlive === "no") {
        firFiler = document.getElementById("firFiler")?.value.trim() || "";
        statementToCompare = document.getElementById("proxyStatement")?.value.trim() || "";
    }

    
    caseData = {
        FIR: fir,
        VictimAlive: victimAlive,
        FIR_Filer: firFiler,
        StatementUsed: statementToCompare,
        Date: document.getElementById("date")?.value || "",
        Time: document.getElementById("startTime")?.value || "",
        Weapon: document.getElementById("weaponUsed")?.value || "",
        Location: document.getElementById("location")?.value || "",
        IncidentType: document.getElementById("incidentType")?.value || ""
    };

    await updatePipeline();
}
