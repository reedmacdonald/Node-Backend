const fetch = require('node-fetch')
const cheerio = require("cheerio");

const getRawData = (URL) => {
    return fetch(URL)
        .then((response) => response.text())
        .then((data) => data)
}

const URL = 'https://www.espn.com/soccer/team/_/id/132'

const getBayernScores = async () => {
    const bayernRawData = await getRawData(URL)
    let $ =cheerio.load(bayernRawData)
    let array = []
    $('.Schedule__Competitor__Score').each(function(i, elm) {
        let score=$(this).text()
        const isEven = (indy) => {
            return indy % 2 == 0
        }
        if(isEven(i)){
            let newElement={ homeScore:score}
            array.push(newElement)
        }else{
            array[array.length-1].awayScore = score
        }
    });
    let newArray=[]
    $('.Schedule__Team').each(function(i, elm) {
        let team=$(this).text()
        const isEven = (indy) => {
            return indy % 2 == 0
        }
        if(isEven(i)){
            let newElement={ homeTeam:team}
            newArray.push(newElement)
        }else{
            newArray[newArray.length-1].awayTeam = team
        }
    });
    let finalArray=[]
    array.forEach((val,index)=>{
        finalArray.push({...val,...newArray[index]})
    })
    let index = 0
    let lastGame
    while(!lastGame){
        if(finalArray[index].homeScore == ''){
            index++
        }else {
            lastGame=finalArray[index]
        }
    }
    let {homeScore, awayScore, homeTeam} = lastGame
    if(homeScore == awayScore){
        return `Unfortunately, the last game was a ${homeScore} - ${awayScore} draw`
    }
    if(homeScore > awayScore){
        if(homeTeam == 'MUN'){
            return `Bayern won their last game ${homeScore} - ${awayScore}!`
        }else {
            return `Bayern lost their last game ${awayScore} - ${homeScore}...`
        }
    }
    if(homeScore < awayScore){
        if(homeTeam == 'MUN'){
            return `Bayern lost their last game ${homeScore} - ${awayScore}...`
        }else {
            return `Bayern won their last game ${awayScore} - ${homeScore}!`
        }
    }

}

module.exports = {
    getBayernScores
}