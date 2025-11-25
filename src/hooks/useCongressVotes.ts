import { CongressVote, CongressVoteDetail, VoteMember } from "@/types/congress";

const API_KEY = "4cC39j4I3cMzUxZJe4sA6xBCsGc6NQmn4rNkrNkH";
const BASE_URL = "https://api.congress.gov/v3";

export async function fetchHouseVotes(congress: number): Promise<CongressVote[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/house-vote/${congress}?api_key=${API_KEY}&limit=250&format=json`
    );
    
    if (!response.ok) {
      console.error("House votes API error:", response.status);
      return [];
    }
    
    const data = await response.json();
    return data.votes || [];
  } catch (error) {
    console.error("Error fetching House votes:", error);
    return [];
  }
}

export async function fetchSenateVotes(congress: number): Promise<CongressVote[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/senate-vote/${congress}?api_key=${API_KEY}&limit=250&format=json`
    );
    
    if (!response.ok) {
      console.error("Senate votes API error:", response.status);
      return [];
    }
    
    const data = await response.json();
    return data.votes || [];
  } catch (error) {
    console.error("Error fetching Senate votes:", error);
    return [];
  }
}

export async function fetchVoteDetails(
  chamber: 'house' | 'senate',
  congress: number,
  session: number,
  rollNumber: number
): Promise<CongressVoteDetail | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/${chamber}-vote/${congress}/${session}/${rollNumber}?api_key=${API_KEY}&format=json`
    );
    
    if (!response.ok) {
      console.error("Vote details API error:", response.status);
      return null;
    }
    
    const data = await response.json();
    return data.vote || null;
  } catch (error) {
    console.error("Error fetching vote details:", error);
    return null;
  }
}

export async function fetchVoteMembers(
  chamber: 'house' | 'senate',
  congress: number,
  session: number,
  rollNumber: number
): Promise<VoteMember[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/${chamber}-vote/${congress}/${session}/${rollNumber}/members?api_key=${API_KEY}&format=json&limit=500`
    );
    
    if (!response.ok) {
      console.error("Vote members API error:", response.status);
      return [];
    }
    
    const data = await response.json();
    return data.members || [];
  } catch (error) {
    console.error("Error fetching vote members:", error);
    return [];
  }
}

// Get votes for a specific bill
export async function fetchBillVotes(
  congress: number,
  billType: string,
  billNumber: string
): Promise<CongressVote[]> {
  try {
    // Fetch both House and Senate votes
    const [houseVotes, senateVotes] = await Promise.all([
      fetchHouseVotes(congress),
      fetchSenateVotes(congress)
    ]);

    // Combine and filter for the specific bill
    const allVotes = [...houseVotes, ...senateVotes];
    
    return allVotes.filter(vote => {
      if (!vote.bill) return false;
      return (
        vote.bill.congress === congress &&
        vote.bill.type.toLowerCase() === billType.toLowerCase() &&
        vote.bill.number === billNumber
      );
    });
  } catch (error) {
    console.error("Error fetching bill votes:", error);
    return [];
  }
}
