import { Url, UrlDocument, UrlProps } from '../../src/models/Url'

export const urlPayload = {
  url: 'https://www.xd.com/qwer'
}

export const invalidUrlPayload = {
  url: 'https://xd/qwer'
}

export async function createUrl (url: UrlProps): Promise<UrlDocument> {
  return await Url.create(url)
}
