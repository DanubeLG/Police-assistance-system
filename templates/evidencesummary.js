
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
