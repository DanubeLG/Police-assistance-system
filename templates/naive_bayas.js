let nbModel = {}

let encoders={
city:{},
gender:{},
weapon:{},
crime:{}
}

let decoders={
crime:{}
}

function preprocess(v){

if(v===undefined||v===null) return "unknown"

return String(v).trim().toLowerCase()

}

function encode(label,type){

if(!(label in encoders[type])){

let id=Object.keys(encoders[type]).length

encoders[type][label]=id

if(type==="crime"){
decoders.crime[id]=label
}

}

return encoders[type][label]

}

function trainNB(data){

let crimeCounts={}
let cityCounts={}
let genderCounts={}
let weaponCounts={}
let ageStats={}

let total=data.length

data.forEach(row=>{

let city=preprocess(row["City"])
let gender=preprocess(row["Victim Gender"])
let weapon=preprocess(row["Weapon Used"])
let crime=preprocess(row["Crime Description"])
let age=Number(row["Victim Age"])

let cityE=encode(city,"city")
let genderE=encode(gender,"gender")
let weaponE=encode(weapon,"weapon")
let crimeE=encode(crime,"crime")

crimeCounts[crimeE]=(crimeCounts[crimeE]||0)+1

cityCounts[crimeE]=cityCounts[crimeE]||{}
cityCounts[crimeE][cityE]=(cityCounts[crimeE][cityE]||0)+1

genderCounts[crimeE]=genderCounts[crimeE]||{}
genderCounts[crimeE][genderE]=(genderCounts[crimeE][genderE]||0)+1

weaponCounts[crimeE]=weaponCounts[crimeE]||{}
weaponCounts[crimeE][weaponE]=(weaponCounts[crimeE][weaponE]||0)+1

ageStats[crimeE]=ageStats[crimeE]||[]

ageStats[crimeE].push(age)

})

let ageMean={}
let ageVar={}

for(let crime in ageStats){

let arr=ageStats[crime]

let mean=arr.reduce((a,b)=>a+b)/arr.length

let variance=arr.reduce((a,b)=>a+(b-mean)*(b-mean),0)/arr.length

ageMean[crime]=mean
ageVar[crime]=variance

}

nbModel={
crimeCounts,
cityCounts,
genderCounts,
weaponCounts,
ageMean,
ageVar,
total
}

}

function gaussian(x,mean,varr){

if(varr===0) varr=1

let exponent=Math.exp(-(Math.pow(x-mean,2))/(2*varr))

return exponent/Math.sqrt(2*Math.PI*varr)

}

function predictCrime(city, age, gender, weapon){
    city = preprocess(city)
    gender = preprocess(gender)
    weapon = preprocess(weapon)

    let cityE = encoders.city[city] ?? -1
    let genderE = encoders.gender[gender] ?? -1
    let weaponE = encoders.weapon[weapon] ?? -1

    let bestCrime = null
    let bestScore = -Infinity

    for(let crime in nbModel.crimeCounts){
        let prior = Math.log(nbModel.crimeCounts[crime] / nbModel.total)
        let cityProb = Math.log((nbModel.cityCounts[crime][cityE] || 1) / nbModel.crimeCounts[crime])
        let genderProb = Math.log((nbModel.genderCounts[crime][genderE] || 1) / nbModel.crimeCounts[crime])
        let weaponProb = Math.log((nbModel.weaponCounts[crime][weaponE] || 1) / nbModel.crimeCounts[crime])
        let ageProb = Math.log(gaussian(age, nbModel.ageMean[crime], nbModel.ageVar[crime]))

        let score = prior + cityProb + genderProb + weaponProb + ageProb

        if(score > bestScore){
            bestScore = score
            bestCrime = crime
        }
    }

    return {
        crime: decoders.crime[bestCrime],
        score: bestScore // log-probability
    }
}
