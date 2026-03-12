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

