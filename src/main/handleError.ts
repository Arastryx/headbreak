// import logger from 'electron-log'

export interface HeadbreakError {
  message: string
  stack?: string
  name?: string
}

export async function handleError<T>(func: () => T | Promise<T>): Promise<T | HeadbreakError> {
  try {
    return await func()
  } catch (e) {
    let error: HeadbreakError = { message: '' }

    if (e instanceof Error) {
      error = e
    } else if (typeof e === 'string') {
      error = {
        message: e
      }
    } else {
      error = {
        message: 'An unknown error has occurred'
      }
    }

    //TODO: Reenable Logging
    // logger.error(e)
    return error
  }
}
