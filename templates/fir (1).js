function getCurrentDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes} hrs`;
}

function getDayName(dateString) {
    if (!dateString) return "";
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return days[new Date(dateString).getDay()];
}

function create() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let name1=document.getElementById("complainantName").value;
    
    let name2=document.getElementById("date").value;
    
    let name3=document.getElementById("startTime").value;
    
    let name4=document.getElementById("endTime").value;
    
    let name5=document.getElementById("address").value;
    
    let name6=document.getElementById("HusbandName").value;
    
    let name7=document.getElementById("dob").value;
    
    let name8=document.getElementById("nation").value;
    
    let name9=document.getElementById("age").value;

    let name10=document.getElementById("HusbandName").value;
    
  
    doc.setFont("helvetica", "normal");

    doc.setFontSize(16);
    doc.text("FIRST INFORMATION REPORT", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.text("(Under Section 154 Cr.P.C.)", 105, 22, { align: "center" });

    let y = 35;

    doc.text("1. District: SUNDARGARH", 14, y);
    doc.text("P.S.: RAIBOGA", 90, y);
    doc.text("Year: " + new Date().getFullYear(), 160, y);

    y += 8;
    doc.text("FIR No.: 0001", 14, y);
    doc.text("Date & Time of FIR: " + getCurrentDateTime(), 90, y);

    y += 12;
    doc.setFontSize(12);
    doc.text("2. Acts and Sections", 14, y);
    doc.setFontSize(11);

    y += 8;
    doc.text("Act: IPC 1860", 20, y);
    doc.text("Section: 279, 304-A", 120, y);

    y += 12;
    doc.setFontSize(12);
    doc.text("3. Occurrence of Offence", 14, y);
    doc.setFontSize(11);

    y += 8;
    doc.text("Day: " + getDayName(name2), 20, y);
    doc.text("Date: " + name2 , 80, y);

    y += 7;
    doc.text("Time From: " + name3, 20, y);
    doc.text("Time To: " + name4, 120, y);

    y += 7;
    doc.text("Information received at P.S.: " + getCurrentDateTime(), 20, y);

    y += 12;
    doc.setFontSize(12);
    doc.text("4. Type of Information: Written", 14, y);

    y += 12;
    doc.setFontSize(12);
    doc.text("5. Place of Occurrence", 14, y);
    doc.setFontSize(11);

    y += 8;
    doc.text("Address: " + name5, 20, y);

    y += 12;
    doc.setFontSize(12);
    doc.text("6. Complainant / Informant", 14, y);
    doc.setFontSize(11);

    y += 8;
    doc.text("Name: " + name1 , 20, y);
    y += 7;
    doc.text("Father/Husband Name: " + name10, 20, y);
    y += 7;
    doc.text("DOB: " + name7 , 20, y);
    doc.text("Nationality: " + name8, 120, y);

    y += 20;
    doc.text("Signature of Complainant:", 20, y);

    let signatureImg = localStorage.getItem("signaturePic");
    if (signatureImg) {
        doc.addImage(signatureImg, "PNG", 20, y + 5, 50, 25);
    } else {
        doc.text("Not Available", 60, y);
    }

    const FIR=doc.output("datauristring");
    localStorage.removeItem("fir");
    localStorage.setItem("fir",FIR);
    let dataUri = localStorage.getItem("fir");

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
   a.download = "FIR_Report_2026.pdf";  
   a.click();
   alert("pdf successfully created");
  }
