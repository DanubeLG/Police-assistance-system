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

