export const isValidEmail = email => {
  const emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    'gm'
  )
  return emailRegex.test(email)
}

export const isStrongPassword = password => {
  const passwordRegex = new RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+.]).{6,20}$/
  )
  return passwordRegex.test(password)
}

export const isVaidPhonenumber = phoneNumber => {
  const phoneNumbRegex = new RegExp(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
  )
  return phoneNumbRegex.test(phoneNumber)
}
