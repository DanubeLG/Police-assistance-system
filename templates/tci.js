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

