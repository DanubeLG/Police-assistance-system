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
