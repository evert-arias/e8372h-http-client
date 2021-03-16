import Base64 from 'js-base64';
import sha256 from 'js-sha256';
import xml2js from 'xml2js';

/**
 * Login object
 */
export type LoginObj = {
  readonly Username: string;
  readonly Password: string;
  readonly password_type: number;
};

/**
 * Identity class
 */
export default class Identity {
  private readonly xmlBuilder: xml2js.Builder = new xml2js.Builder();

  // Class constructor
  constructor(
    private readonly username: string,
    private readonly password: string,
    private readonly token: string
  ) {}

  // Perform sha256 and base64 encode
  private b64_sha256(data: string) {
    const sha256sig = sha256.sha256(data);
    return Base64.encode(sha256sig);
  }

  // Make hashed password
  private makePassword(username: string, password: string, token: string) {
    return this.b64_sha256(username + this.b64_sha256(password) + token);
  }

  // Get login object as javascript object.
  public getLoginObj(): LoginObj {
    const loginObj: LoginObj = {
      Username: this.username,
      Password: this.makePassword(this.username, this.password, this.token),
      password_type: 4,
    };
    return loginObj;
  }

  // Get login object as xml string.
  public getLoginObjAsXml(): string {
    const loginObj: LoginObj = {
      Username: this.username,
      Password: this.makePassword(this.username, this.password, this.token),
      password_type: 4,
    };
    return this.xmlBuilder.buildObject(loginObj);
  }
}
