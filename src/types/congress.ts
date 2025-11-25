// US Congress Bill Types
export interface CongressBill {
  congress: number;
  type: string; // hr, s, hjres, sjres, hconres, sconres, hres, sres
  number: string;
  originChamber: string;
  originChamberCode: string;
  title: string;
  latestAction: {
    actionDate: string;
    text: string;
  };
  sponsors?: Array<{
    bioguideId: string;
    fullName: string;
    firstName: string;
    lastName: string;
    party: string;
    state: string;
  }>;
  policyArea?: {
    name: string;
  };
  subjects?: {
    legislativeSubjects: Array<{
      name: string;
    }>;
  };
  updateDate: string;
  url: string;
}

export interface CongressBillDetail extends CongressBill {
  introducedDate: string;
  constitutionalAuthorityStatementText?: string;
  cosponsors?: {
    count: number;
    countIncludingWithdrawnCosponsors: number;
  };
  actions?: {
    count: number;
  };
  committees?: {
    count: number;
  };
  summaries?: Array<{
    versionCode: string;
    actionDate: string;
    actionDesc: string;
    updateDate: string;
    text: string;
  }>;
}

export interface CongressApiResponse {
  bills: CongressBill[];
  pagination: {
    count: number;
    next?: string;
  };
}
