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