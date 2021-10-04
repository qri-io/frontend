
export type ValidationError = string | null

export const ERR_INVALID_USERNAME_CHARACTERS: ValidationError = 'Usernames may only include lowercase letters, numbers, underscores, and hyphens'
export const ERR_INVALID_USERNAME_LENGTH: ValidationError = 'Username must be 50 characters or fewer'
export const ERR_ENTER_USERNAME: ValidationError = 'Enter a username'


// validators return an error message or null
export const validateUsername = (username: string): ValidationError => {
  if (username) {
    const invalidCharacters = !(/^[a-z0-9_-]+$/.test(username))
    if (invalidCharacters) return ERR_INVALID_USERNAME_CHARACTERS

    const tooLong = username.length > 50
    if (tooLong) return ERR_INVALID_USERNAME_LENGTH
  } else {
    return ERR_ENTER_USERNAME
  }
  return null
}

export const ERR_INVALID_EMAIL: ValidationError = 'Enter a valid email address'

export const validateEmail = (email: string): ValidationError => {
  if (email) {
    const invalidEmail = !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    if (invalidEmail) return ERR_INVALID_EMAIL
  } else {
    return ERR_INVALID_EMAIL
  }
  return null
}

export const ERR_INVALID_PASSWORD_LENGTH: ValidationError = 'Password must be at least 8 characters'

export const validatePassword = (password: string) => {
  if (password) {
    const tooShort = password && password.length < 8
    if (tooShort) return ERR_INVALID_PASSWORD_LENGTH
  } else {
    return ERR_INVALID_PASSWORD_LENGTH
  }
  return null
}

export const ERR_INVALID_DATASETNAME_START: ValidationError = 'Dataset names must start with a lowercase letter'
export const ERR_INVALID_DATASETNAME_CHARACTERS: ValidationError = 'Dataset names may only include lowercase letters, numbers, and underscores'
export const ERR_INVALID_DATASETNAME_LENGTH: ValidationError = 'Dataset names must be 144 characters or fewer'

export const validateDatasetName = (name: string): ValidationError => {
  if (name) {
    const invalidStart = !(/[a-z]/).test(name[0])
    if (invalidStart) return ERR_INVALID_DATASETNAME_START

    const invalidCharacters = !(/^(?![0-9])[a-z0-9_-]+$/.test(name))
    if (invalidCharacters) return ERR_INVALID_DATASETNAME_CHARACTERS

    const tooLong = name.length > 144
    if (tooLong) return ERR_INVALID_DATASETNAME_LENGTH
  }
  return null
}

export const ERR_INVALID_DATASETREFERENCE_PATTERN: ValidationError = 'Invalid dataset reference'

export const validateDatasetReference = (datasetReference: string): ValidationError => {
  if (datasetReference) {
    const invalidPattern = !(/^[a-z0-9_-]{1,50}\/[a-z0-9_]{1,100}$/.test(datasetReference))
    if (invalidPattern) return ERR_INVALID_DATASETREFERENCE_PATTERN
  }
  return null
}
