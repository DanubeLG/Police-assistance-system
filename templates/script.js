function openMenu(){
  document.getElementById("sideMenu").style.left = "0";
  document.getElementById("overlay").style.display = "block";
  document.querySelector(".menu-btn").style.display = "none";
 }

function closeMenu(){
  document.getElementById("sideMenu").style.left = "-320px";
  document.getElementById("overlay").style.display = "none";
  document.querySelector(".menu-btn").style.display = "block";
 }

let el1=document.getElementById("ds");
let el2=document.getElementById("de");
let el3=document.getElementById("k");
let el4=document.getElementById("l");
let el5=document.getElementById("m");
  

let img1=localStorage.getItem("profilePic");
let img2=localStorage.getItem("signaturePic");
let n1=localStorage.getItem("username1");
let n2=localStorage.getItem("username2");
let n3=localStorage.getItem("username3");

el1.src=img1;
el2.src=img2;
el3.innerText=n1;
el4.innerText=n2;
el5.innerText=n3;
  
let caseData = {};
let policeMode = { active: false };

function addHistory(text){
  let ol = document.getElementById("y");
  let li = document.createElement("li");
  li.style.color = "white";
  li.innerText = text;
  ol.appendChild(li);
}

document.getElementById("victimAlive").addEventListener("change", function() {
  let status = this.value;
  let section = document.getElementById("dynamicSection");

  if (status === "yes") {
    section.innerHTML = `
      <h3>Victim Statement</h3>
      <textarea id="victimStatement"></textarea>
    `;
  } 
  else if (status === "no") {
    section.innerHTML = `
      <h3>Who filed the FIR on behalf of the victim?</h3>
      <input type="text" id="firFiler">
      <h3>Enter that person's statement</h3>
      <textarea id="proxyStatement"></textarea>
    `;
  }
  else {
    section.innerHTML = "";
  }
});

async function TCI(caseData) {

  let fir = (caseData.FIR || "").toLowerCase();
  let issues = [];

  let place = document.getElementById("place")?.value || "";
  let location = document.getElementById("location")?.value || "";

  await validatePlaceInLocation(place, location);

  let dob = document.getElementById("dob")?.value;
  let age = document.getElementById("age")?.value;

  if(dob && age){
    let birthYear = new Date(dob).getFullYear();
    let currentYear = new Date().getFullYear();
    let calculatedAge = currentYear - birthYear;

    if(Math.abs(calculatedAge - age) > 1){
      issues.push("Age does not match the provided DOB.");
    }
  }

  let timeCategory = document.getElementById("timeCategory")?.value;
  let startTime = document.getElementById("startTime")?.value;
  let endTime = document.getElementById("endTime")?.value;

  if(timeCategory && startTime){

    let hour = parseInt(startTime.split(":")[0]);

    if(timeCategory === "Morning" && (hour < 5 || hour >= 12))
      issues.push("Start time does not match Morning.");

    if(timeCategory === "Afternoon" && (hour < 12 || hour >= 17))
      issues.push("Start time does not match Afternoon.");

    if(timeCategory === "Evening" && (hour < 17 || hour >= 20))
      issues.push("Start time does not match Evening.");

    if(timeCategory === "Night" && (hour < 20 && hour >= 5))
      issues.push("Start time does not match Night.");
  }

  if(startTime && endTime){
    if(endTime < startTime){
      issues.push("End time occurs before start time.");
    }
  }

  let weapons = ["knife","gun","rope","acid","dumbell","stick","stone"];

  weapons.forEach(w=>{
    if(caseData.Weapon && fir.includes(w) && caseData.Weapon.toLowerCase() !== w){
      issues.push("Weapon in FIR text contradicts selected weapon.");
    }
  });

  let times = ["morning","afternoon","evening","night","dusk"];

  times.forEach(t=>{
    if(timeCategory && fir.includes(t) && timeCategory.toLowerCase() !== t){
      issues.push("Time in FIR text contradicts selected time category.");
    }
  });

  caseData.TCI = {
    status: issues.length === 0 ? "Consistent" : "Inconsistent",
    issues
  };

  return caseData;
}



function TCA(caseData){

  let fir = (caseData.FIR || "").toLowerCase();
  let statement = (caseData.StatementUsed || "").toLowerCase();

  let contradictions = [];

  if(statement){

    let weapons = ["knife","gun","rope","acid","dumbell","stick","stone"];

    let firWeapon = weapons.find(w => fir.includes(w));
    let statementWeapon = weapons.find(w => statement.includes(w));

    if(firWeapon && statementWeapon && firWeapon !== statementWeapon){
      contradictions.push("Weapon mismatch between FIR and statement.");
    }

    let times = ["morning","afternoon","evening","night","dusk"];

    let firTime = times.find(t => fir.includes(t));
    let statementTime = times.find(t => statement.includes(t));

    if(firTime && statementTime && firTime !== statementTime){
      contradictions.push("Time mismatch between FIR and statement.");
    }
  }

  caseData.TCA = {
    status: contradictions.length === 0 ? "Consistent" : "Contradictions Found",
    contradictions
  };

  return caseData;
}
function RLE(caseData){
  let statement = caseData.StatementUsed || "";
  let suspects=[], locations=[], traits=[];

  if(!statement){
    caseData.RLE={suspects,locations,traits};
    return caseData;
  }

  let sentences = statement.match(/[^\.!\?]+[\.!\?]*/g) || [statement];

  const locationKeywords=["mall","market","park","station","hospital","school","bridge","street","road","metro","cafe","hotel","college","university","restaurant","gym","club","home","office"];
  const traitKeywords=["tall","short","beard","scar","jacket","mask","black","white","blue","red","lean","muscular","goatee","pale","large","small","spot","tattoo","burnt"];

  const invalidNames = [
    "me","him","her","them","they","he","she","i","we","you","my","your",
    "man","woman","person","guy","boy","girl","knife","gun","road","market","station"
  ];

  const namePatterns = [
    /name\s+is\s+([A-Z][a-z]+)/g,
    /name\s+might\s+be\s+([A-Z][a-z]+)/g,
    /name\s+could\s+be\s+([A-Z][a-z]+)/g,
    /called\s+([A-Z][a-z]+)/g,
    /shouted\s+([A-Z][a-z]+)/g,
    /known\s+as\s+([A-Z][a-z]+)/g
  ];

  namePatterns.forEach(pattern=>{
    let match;
    while((match = pattern.exec(statement)) !== null){
      let foundName = match[1];
      let lower = foundName.toLowerCase();

      if(!invalidNames.includes(lower) && !suspects.some(s=>s.name.toLowerCase()===lower)){
        suspects.push({
          name: foundName,
          reason: "Detected from name pattern in statement",
          location: null,
          traits: []
        });
      }
    }
  });

  sentences.forEach(sentence=>{
    traitKeywords.forEach(trait=>{
      if(sentence.toLowerCase().includes(trait)) traits.push(trait);
    });

    locationKeywords.forEach(loc=>{
      if(sentence.toLowerCase().includes(loc)) locations.push(loc);
    });
  });

  traits=[...new Set(traits)];
  locations=[...new Set(locations)];

  if(suspects.length===0 && traits.length>0){
    suspects.push({
      name:"Unknown Individual",
      reason:"Described by traits",
      location:locations[0]||null,
      traits:[...traits]
    });
  }

  suspects.forEach(s=>{
    s.location = locations[0] || s.location || null;
    s.traits = [...traits];
  });

  caseData.RLE={suspects,locations,traits};
  return caseData;
}

function FCI(caseData){
  let suspects=caseData.RLE?.suspects || [];
  let baseScore=10;

  suspects.forEach((s,index)=>{
    let score=baseScore + s.traits.length*5 + (s.location?5:0) + index*2 + (s.name!=="Unknown Individual"?5:0);
    s.evidenceScore=score;
  });

  caseData.FCI={
    suspects,
    totalScore:suspects.reduce((acc,s)=>acc+s.evidenceScore,0)
  };
  return caseData;
}

function EAS(caseData){
  if(!caseData.RLE?.suspects) return caseData;

  let totalEvidence=0;
  let highPrioritySuspects=[];

  caseData.RLE.suspects.forEach(s=>{
    let weight=1;

    if(s.traits.length) weight+=0.2*s.traits.length;
    if(s.location) weight+=0.3;
    if(s.interviewStatement) weight+=0.5;
    if(s.alibiWeak) weight+=0.4;
    if(s.contradictions?.length) weight+=0.5;

    s.finalScore=Math.round((s.evidenceScore || 10)*weight);
    totalEvidence+=s.finalScore;

    if(s.finalScore>=40) highPrioritySuspects.push(s.name);
  });

  caseData.EAS={totalEvidenceScore:totalEvidence,highPrioritySuspects};
  return caseData;
}

function generateEvidenceSummary(caseData) {
    let evidence = [];

   
    if (caseData.TCI && caseData.TCI.issues.length) {
        caseData.TCI.issues.forEach(i => {
            evidence.push("TCI Issue: " + i);
        });
    }


    if (caseData.TCA && caseData.TCA.contradictions.length) {
        caseData.TCA.contradictions.forEach(c => {
            evidence.push("TCA Contradiction: " + c);
        });
    }

    
    if (caseData.RLE && caseData.RLE.extractedFacts) {
        caseData.RLE.extractedFacts.forEach(f => {
            evidence.push("Extracted Fact: " + f);
        });
    }

  
    if (caseData.FCI && caseData.FCI.inconsistencies) {
        caseData.FCI.inconsistencies.forEach(i => {
            evidence.push("Fact Inconsistency: " + i);
        });
    }


    if (caseData.FAS && caseData.FAS.finalFindings) {
        caseData.FAS.finalFindings.forEach(f => {
            evidence.push("Final Finding: " + f);
        });
    }

    caseData.evidenceSummary = evidence;
    return caseData;
}

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

    caseData = FCI(caseData);
    caseData = EAS(caseData);

    
    localStorage.setItem("Current_Case", JSON.stringify(caseData));

    
    SIM();
    renderOutput();
}

async function execute(){
    let fir = document.getElementById("firDetails").value.trim();
    let victimAlive = document.getElementById("victimAlive").value;

    if(!fir || !victimAlive){
        alert("Complete required fields.");
        return;
    }

    let statementToCompare="", firFiler="";

    if(victimAlive==="yes"){
        statementToCompare = document.getElementById("victimStatement")?.value.trim() || "";
    }

    if(victimAlive==="no"){
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

async function caseController() {
    let chatAnswer = document.getElementById("chatInput").value.trim();
    let normalized = chatAnswer.toLowerCase();

    if (!policeMode.active) {
        await execute(); 
        policeMode.active = true;
        addHistory("SYSTEM: Case file created. Investigation started.");
        addHistory("POLICE: " + policeQuestionEngine());
        document.getElementById("chatInput").value = "";
        return;
    }

    if (chatAnswer) {
        addHistory("USER: " + chatAnswer);
        updateFromPoliceAnswer(chatAnswer);
        document.getElementById("chatInput").value = "";

        if (caseData.stage === "final" && ["yes", "report", "generate"].includes(normalized)) {
            if (typeof create3 === "function") create3(); 
            await updatePipeline();
            addHistory("POLICE: Investigation complete. Final ranking generated.");
            return;
        }

        await updatePipeline(); 
        addHistory("POLICE: " + policeQuestionEngine());
    }
}


