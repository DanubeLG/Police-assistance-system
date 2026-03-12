function EAS(caseData){
    if(!caseData.RLE?.suspects) return caseData;

    let totalEvidence = 0;
    let highPrioritySuspects = [];

    caseData.RLE.suspects.forEach(s => {
        let weight = 1;

        if(s.traits.length) weight += 0.2*s.traits.length;
        if(s.location) weight += 0.3;
        if(s.interviewStatement) weight += 0.5;
        if(s.alibiWeak) weight += 0.4;
        if(s.contradictions?.length) weight += 0.5;

        if(caseData.predictedCrimeScore){
            weight += (caseData.predictedCrimeScore / 20); 
        }

        s.finalScore = Math.round((s.evidenceScore || 10) * weight);
        totalEvidence += s.finalScore;

        if(s.finalScore >= 40) highPrioritySuspects.push(s.name);
    });

    caseData.EAS = { totalEvidenceScore: totalEvidence, highPrioritySuspects };
    return caseData;
}
