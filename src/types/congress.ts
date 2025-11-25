// US Congress Bill Types
export interface CongressBill {
  congress: number;
  type: string; // hr, s, hjres, sjres, hconres, sconres, hres, sres
  number: string;
  originChamber: string;
  originChamberCode: string;
  title: string;
  introducedDate?: string;
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
  cosponsors?: {
    count: number;
    countIncludingWithdrawnCosponsors?: number;
  };
  laws?: Array<{
    number: string;
    type: string;
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

export interface BillStakeholder {
  name: string;
  type: "Industry" | "Company" | "Government" | "Public";
  position: "Support" | "Oppose" | "Neutral";
  impact: string;
}

export interface BillAnalysis {
  riskScore: number;
  riskCategory: "Critical" | "High" | "Medium" | "Low";
  explanation: string;
  stakeholders: BillStakeholder[];
  metadata?: {
    textCharCount: number;
    usedFullText: boolean;
  };
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
  analysis?: BillAnalysis;
}

export interface CongressApiResponse {
  bills: CongressBill[];
  pagination: {
    count: number;
    next?: string;
  };
}

// Vote Types
export interface CongressVote {
  congress: number;
  session: number;
  chamber: 'House' | 'Senate';
  rollNumber: number;
  voteDate: string;
  voteQuestion: string;
  voteResult: string;
  voteTitle?: string;
  voteDocument?: {
    text: string;
    url: string;
  };
  voteType: string;
  bill?: {
    congress: number;
    type: string;
    number: string;
    title?: string;
    url: string;
  };
  amendment?: {
    number: string;
    url: string;
  };
  majority: string;
  totals: {
    yea: number;
    nay: number;
    present: number;
    notVoting: number;
  };
  updateDate: string;
}

export interface VoteMember {
  bioguideId: string;
  chamber: string;
  name: string;
  party: string;
  state: string;
  vote: 'Yea' | 'Nay' | 'Present' | 'Not Voting';
}

export interface CongressVoteDetail extends CongressVote {
  members?: VoteMember[];
}

export interface VoteApiResponse {
  votes: CongressVote[];
  pagination: {
    count: number;
    next?: string;
  };
}
