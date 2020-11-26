/// StringifyDate is defined to convert the date to a user acceptable format
const stringifyDate=(date)=>{
    const options={day:'numeric', month: 'long',year:'numeric'};
    const newDate= date===undefined?"undefined":new Date(Date.parse(date)).toLocaleDateString('en-GB',options);
    return newDate;
}