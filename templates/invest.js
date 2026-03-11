function create3(){
doc.setFont("helvetica", "normal");

doc.setFontSize(16);
doc.text("INVESTIGATION REPORT", 105, 15, { align: "center" });

doc.setFontSize(11);
doc.text("(Generated After FIR Analysis)", 105, 22, { align: "center" });

let y = 35;

doc.text("1. District: SUNDARGARH", 14, y);
doc.text("P.S.: RAIBOGA", 90, y);
doc.text("Year: " + new Date().getFullYear(), 160, y);

y += 8;
doc.text("Related FIR No.: 0001", 14, y);
doc.text("Report Date: " + getCurrentDateTime(), 90, y);

y += 12;
doc.setFontSize(12);
doc.text("2. Case Information", 14, y);
doc.setFontSize(11);

y += 8;
doc.text("Complainant Name: " + name1, 20, y);
y += 7;
doc.text("Father/Husband Name: " + name10, 20, y);
y += 7;
doc.text("DOB: " + name7, 20, y);
doc.text("Nationality: " + name8, 120, y);

y += 12;
doc.setFontSize(12);
doc.text("3. Incident Details", 14, y);
doc.setFontSize(11);

y += 8;
doc.text("Day: " + getDayName(name2), 20, y);
doc.text("Date: " + name2, 80, y);

y += 7;
doc.text("Time From: " + name3, 20, y);
doc.text("Time To: " + name4, 120, y);

y += 7;
doc.text("Place of Occurrence: " + name5, 20, y);

y += 12;
doc.setFontSize(12);
doc.text("4. FIR Summary", 14, y);
doc.setFontSize(11);

y += 8;
doc.text(name11, 20, y);

y += 12;
doc.setFontSize(12);
doc.text("5. Consistency Check (TCI)", 14, y);
doc.setFontSize(11);

y += 8;

if(caseData.TCI && caseData.TCI.issues.length === 0){
  doc.text("Status: Consistent", 20, y);
}else{
  doc.text("Status: Inconsistent", 20, y);
  y += 7;

  caseData.TCI?.issues.forEach(issue=>{
    doc.text("- " + issue, 25, y);
    y += 6;
  });
}

y += 8;
doc.setFontSize(12);
doc.text("6. Contradiction Analysis (TCA)", 14, y);
doc.setFontSize(11);

y += 8;

if(caseData.TCA && caseData.TCA.contradictions.length === 0){
  doc.text("Status: No contradictions found", 20, y);
}else{
  doc.text("Status: Contradictions detected", 20, y);
  y += 7;

  caseData.TCA?.contradictions.forEach(c=>{
    doc.text("- " + c, 25, y);
    y += 6;
  });
}

y += 12;
doc.setFontSize(12);
doc.text("7. Statement Used For Analysis", 14, y);
doc.setFontSize(11);

y += 8;
doc.text(caseData.StatementUsed || "No statement recorded.", 20, y);

y += 12;
doc.setFontSize(12);
doc.text("8. Evidence Summary", 14, y);
doc.setFontSize(11);

y += 8;

/* Collect evidence automatically */

let evidence = [];

if(caseData.TCI?.issues?.length){
  caseData.TCI.issues.forEach(i=>{
    evidence.push("Internal Inconsistency: " + i);
  });
}

if(caseData.TCA?.contradictions?.length){
  caseData.TCA.contradictions.forEach(c=>{
    evidence.push("Cross Statement Contradiction: " + c);
  });
}

if(caseData.RLE?.extractedFacts?.length){
  caseData.RLE.extractedFacts.forEach(f=>{
    evidence.push("Extracted Evidence: " + f);
  });
}

if(caseData.FCI?.inconsistencies?.length){
  caseData.FCI.inconsistencies.forEach(i=>{
    evidence.push("Fact Verification Failure: " + i);
  });
}

if(caseData.FAS?.finalFindings?.length){
  caseData.FAS.finalFindings.forEach(f=>{
    evidence.push("Analytical Finding: " + f);
  });
}

if(evidence.length === 0){
  doc.text("No additional analytical evidence detected.", 20, y);
}else{
  evidence.forEach(e=>{
    doc.text("- " + e, 25, y);
    y += 6;
  });
}

y += 20;
doc.text("Investigating Officer Signature:", 20, y);


/* PDF creation */

const report = doc.output("datauristring");

localStorage.removeItem("investigationReport");
localStorage.setItem("investigationReport", report);

let dataUri = localStorage.getItem("investigationReport");

let byteString = atob(dataUri.split(',')[1]);
let mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];

let ab = new ArrayBuffer(byteString.length);
let ia = new Uint8Array(ab);

for (let i = 0; i < byteString.length; i++) {
  ia[i] = byteString.charCodeAt(i);
}

let blob = new Blob([ab], { type: mimeString });

let a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "Investigation_Report.pdf";
a.click();

alert("Investigation report created successfully");}
