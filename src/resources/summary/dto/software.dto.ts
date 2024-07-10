export class CreateSoftwareDto {}

export class FindSoftwareRawQueryBuilderResponse {
  softwareName: string;
  softwareOwner: string;
  totalAccounts: string;
  activeAccounts: string;
  totalLicensedObjects: string;
  activeLicensedObjects: string;
  LT: number;
  averageCheck: string;
  LTV: string;
}

export class FindSoftwareResponse {
  title: string;
  owner: string;
  accountsRatio: string;
  objectsRatio: string;
  lt: number;
  ltv: number;
  averageBill: number;
}
