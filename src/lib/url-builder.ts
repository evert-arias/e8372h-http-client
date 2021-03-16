/**
 * ModemURL class
 */
export class ModemURL {
  constructor(private url: string) {}
  public toString() {
    return this.url;
  }
}

/**
 * URLBuilder class
 */
export default class URLBuilder {
  constructor(private modemIp: string) {}
  // Make full url from modem ip and url
  public make(url: string): ModemURL {
    return new ModemURL(`http://${this.modemIp}/api/${url}`);
  }
}
