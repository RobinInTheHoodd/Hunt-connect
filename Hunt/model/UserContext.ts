interface IUser {
  UIID: string;
  provider: string;
  displayName: string;
  email: string;
}

export class UserContext implements IUser {
  UIID: string;
  provider: string;
  displayName: string;
  email: string;

  constructor(
    UIID?: string,
    provider?: string,
    displayName?: string,
    email?: string
  ) {
    this.UIID = UIID || "";
    this.provider = provider || "";
    this.displayName = displayName || "";
    this.email = email || "";
  }
}
