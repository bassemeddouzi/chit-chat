import moment from "moment";
export const isBeen =(date)=>{
    const lastSeen =  moment(date).fromNow().split(' ').splice(0,2).join(' ');

    return lastSeen
}
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}