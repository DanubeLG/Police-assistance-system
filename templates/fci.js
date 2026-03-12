function FCI(caseData){
    let suspects = caseData.RLE?.suspects || [];
    let baseScore = 10;

    suspects.forEach((s, index) => {
        let score = baseScore + s.traits.length*5 + (s.location?5:0) + index*2 + (s.name!=="Unknown Individual"?5:0);

        if(caseData.predictedCrime){
            let match = s.traits.some(trait => caseData.predictedCrime.toLowerCase().includes(trait.toLowerCase()));
            if(match){
                
                score *= 1 + (caseData.predictedCrimeScore || 0)/10; 
            }
        }

        s.evidenceScore = Math.round(score);
    });

    caseData.FCI = {
        suspects,
        totalScore: suspects.reduce((acc,s)=>acc+s.evidenceScore,0)
    };

    return caseData;
}
