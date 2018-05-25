let randomString = (length) => {
    var text = ""
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

let concat = (values, delimiter) => {
  return values.join(delimiter)
}

let now = () => {
  return new Date()
}

let epoch = () => {
  // unix timestamp in seconds
  return Math.floor(now() / 1000)
}

module.exports = {randomString,concat,now,epoch}
