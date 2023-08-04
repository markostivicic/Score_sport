export function extractHoursAndMinutes(fullDate) {
  const date = new Date(fullDate)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return (
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0")
  )
}

export function extractDate(fullDate) {
  const date = new Date(fullDate)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${day}.${month}.${year}.`
}

export function extractDateAndTime(fullDate) {
  const date = new Date(fullDate)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${day}.${month}.${year}. ${
    hours.toString() + ":" + minutes.toString().padStart(2, "0")
  }`
}
