import EventEmitter from 'events';

import xml2js from 'xml2js';

import Identity from './identity';
import Requester from './requester';
import URLBuilder from './url-builder';

class Modem {
  // Event emitter
  private emitter = new EventEmitter();
  // xml builder
  private xmlBuilder: xml2js.Builder = new xml2js.Builder();
  // xml parser
  private parser: xml2js.Parser = new xml2js.Parser();
  // URLBuilder
  private urlBuilder: URLBuilder;
  // HTTP Requester
  private requester: Requester;

  // Class constructor
  constructor(modemIp?: string) {
    // If no modem ip provided, use default.
    if (!modemIp) {
      modemIp = '192.168.1.1';
    }

    // URLBuilder instance.
    this.urlBuilder = new URLBuilder(modemIp);

    // Requester instance.
    this.requester = new Requester({
      SessionInfoUrl: this.urlBuilder.make('webserver/SesTokInfo'),
    });
  }

  // Initialize modem
  public init() {
    return new Promise<void>((resolve, reject) => {
      this.requester
        .init()
        .then(() => {
          this.emitter.emit('ready');
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // Add onReady event callback
  public onReady(cb: () => void) {
    this.emitter.once('ready', cb);
  }

  // Login
  public login(username: string, password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // login url
      const loginUrl = this.urlBuilder.make('user/login');

      // most recent token
      const token = this.requester.getToken();

      // header
      const header = { __RequestVerificationToken: token };

      // identity instance
      const loginObj = new Identity(
        username,
        password,
        token
      ).getLoginObjAsXml();

      try {
        // login request
        this.requester
          .postToUrl(loginUrl, loginObj, header)
          .then(async (result) => {
            // login fail if response status is not 200
            if (result['status'] != 200) {
              reject('Modem did not responded to login request');
            }
            this.parser.parseStringPromise(result['data']).then((data) => {
              if (!data.response && data.response !== 'OK') {
                reject('Provided login data is not valid');
              }
              resolve();
            });
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  // Execute ussd code
  public async ussd(code: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      // url to send ussd
      const sendUssdUrl = this.urlBuilder.make('ussd/send');

      // url to retrieve ussd result
      const getUssdUrl = this.urlBuilder.make('ussd/get');

      // most recent token
      const token = this.requester.getToken();

      // header
      const header = { __RequestVerificationToken: token };

      // xml obj
      const xml = this.xmlBuilder.buildObject({
        content: code,
        codeType: 'CodeType',
        timeout: '',
      });

      // request
      this.requester
        .postToUrl(sendUssdUrl, xml, header)
        .then((result) => {
          console.log(result);

          setTimeout(async () => {
            const final = await this.requester.getFromUrl(getUssdUrl);
            console.log(final);
            resolve(final);
          }, 2000);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default Modem;
