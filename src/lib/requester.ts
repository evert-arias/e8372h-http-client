import EventEmitter from 'events';

import axios from 'axios';
import xml2js from 'xml2js';

import { ModemURL } from './url-builder';

export interface InitData {
  SesInfo: [string];
  TokInfo: [string];
}

export default class Requester {
  private sessionId = '';
  private token = '';
  private parser: xml2js.Parser = new xml2js.Parser();

  // Constructor
  constructor(private options: { SessionInfoUrl: ModemURL }) {}

  // Build header
  private buildHeaders(header?: unknown) {
    const _header: unknown = {
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: this.sessionId ? this.sessionId : '',
    };
    if (header) {
      for (const [key, value] of Object.entries(header)) {
        _header[key] = value;
      }
    }
    return _header;
  }

  /**
   * Request initialization data from modem.
   * The initialization data includes the session id and token used to authenticate
   * the user and have access to protected services.
   * @returns
   */
  public init() {
    // request session id and token
    return new Promise<void>((resolve, reject) => {
      // request
      this.getFromUrl(this.options.SessionInfoUrl)
        .then((result: { response: InitData }) => {
          if (!result.response.SesInfo[0] || !result.response.TokInfo[0]) {
            reject('Could not get required session data from modem');
          }
          // extract session id
          this.sessionId = result.response.SesInfo[0];
          // extract token
          this.token = result.response.TokInfo[0];
          // resolve
          resolve();
        })
        .catch((reason) => {
          // reject if error
          reject(reason);
        });
    });
  }

  // Perform get request from url
  public async getFromUrl(url: ModemURL) {
    const headers = this.buildHeaders();
    const raw = await axios.get(url.toString(), { headers });
    return this.parser.parseStringPromise(raw.data).then((result) => result);
  }

  // Perform post request to url
  public async postToUrl(
    url: ModemURL,
    data: unknown,
    additionalHeaders?: unknown
  ): Promise<unknown> {
    const headers = this.buildHeaders(additionalHeaders);
    const result = await axios.post(url.toString(), data, { headers });
    // Update local session id from latest received on response.
    if (result.headers['set-cookie'] && result.headers['set-cookie'][0]) {
      this.sessionId = result.headers['set-cookie'][0];
    }
    // Update local token from latest received on response.
    if (result.headers['__requestverificationtoken']) {
      this.token = result.headers['__requestverificationtoken'];
    }
    return result;
  }

  // Get session id
  public getSessionId() {
    return this.sessionId;
  }

  // Get token
  public getToken() {
    return this.token;
  }
}
