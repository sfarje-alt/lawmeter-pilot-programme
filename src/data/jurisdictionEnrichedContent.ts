// Jurisdiction-specific enriched content generators for legally accurate mock data
// Each jurisdiction has its own legal system, terminology, and procedural requirements

import { UnifiedLegislationItem } from "@/types/unifiedLegislation";
import { InternationalLegislation } from "./mockInternationalLegislation";

// ========== JURISDICTION-SPECIFIC SPONSOR NAME GENERATORS ==========
const sponsorNames: Record<string, { first: string[]; last: string[]; parties: string[] }> = {
  USA: {
    first: ["John", "Maria", "James", "Sarah", "Robert", "Jennifer", "Michael", "Elizabeth"],
    last: ["Smith", "Johnson", "Williams", "Brown", "Davis", "Garcia", "Miller", "Rodriguez"],
    parties: ["Republican", "Democrat", "Independent"]
  },
  Canada: {
    first: ["Jean", "Margaret", "Pierre", "Catherine", "Michael", "Sophie", "David", "Marie"],
    last: ["Tremblay", "Gagnon", "Roy", "Bouchard", "Campbell", "MacDonald", "Wilson", "Martin"],
    parties: ["Liberal", "Conservative", "NDP", "Bloc Québécois", "Green"]
  },
  EU: {
    first: ["Hans", "Marie", "Giuseppe", "Françoise", "Pedro", "Anna", "Erik", "Ingrid"],
    last: ["Müller", "Dupont", "Rossi", "García", "van den Berg", "Andersson", "Kowalski"],
    parties: ["EPP", "S&D", "Renew Europe", "Greens/EFA", "ECR", "ID", "The Left"]
  },
  Japan: {
    first: ["Taro", "Hanako", "Ichiro", "Yuki", "Kenji", "Sakura", "Hiroshi", "Akiko"],
    last: ["Tanaka", "Suzuki", "Sato", "Yamamoto", "Watanabe", "Kobayashi", "Ito", "Nakamura"],
    parties: ["LDP", "CDP", "Komeito", "JCP", "Nippon Ishin", "Independent"]
  },
  Korea: {
    first: ["Min-jun", "Seo-yeon", "Ji-hoon", "Ha-eun", "Jae-won", "Yun-ah", "Dong-hyun"],
    last: ["Kim", "Lee", "Park", "Choi", "Jung", "Kang", "Cho", "Yoon"],
    parties: ["PPP", "Democratic Party", "Justice Party", "People Party", "Independent"]
  },
  Taiwan: {
    first: ["Wei-ting", "Yu-chen", "Ming-hui", "Shu-fen", "Jia-hao", "Pei-shan"],
    last: ["Chen", "Lin", "Huang", "Chang", "Liu", "Wang", "Wu", "Tsai"],
    parties: ["KMT", "DPP", "TPP", "NPP", "Independent"]
  },
  UAE: {
    first: ["Mohammed", "Ahmed", "Fatima", "Khalid", "Omar", "Mariam", "Rashid"],
    last: ["Al-Maktoum", "Al-Nahyan", "Al-Qasimi", "Al-Nuaimi", "Al-Mualla", "Al-Sharqi"],
    parties: ["Federal National Council Member"]
  },
  "Saudi Arabia": {
    first: ["Abdullah", "Mohammed", "Nora", "Faisal", "Turki", "Reem", "Salman"],
    last: ["Al-Saud", "Al-Sheikh", "Al-Sudairi", "Al-Thunayan", "Al-Jaber"],
    parties: ["Shura Council Member"]
  },
  Oman: {
    first: ["Said", "Qais", "Maryam", "Harib", "Khalfan", "Aisha"],
    last: ["Al-Said", "Al-Busaidi", "Al-Hinai", "Al-Rawahi", "Al-Balushi"],
    parties: ["State Council Member"]
  },
  Kuwait: {
    first: ["Sabah", "Ahmad", "Fatima", "Jaber", "Mubarak", "Sheikha"],
    last: ["Al-Sabah", "Al-Ghanim", "Al-Marzouq", "Al-Kandari", "Al-Hajri"],
    parties: ["National Assembly Member"]
  },
  Bahrain: {
    first: ["Khalifa", "Salman", "Noora", "Rashid", "Ahmed", "Haya"],
    last: ["Al-Khalifa", "Al-Dosari", "Al-Mannai", "Al-Baharna", "Al-Zayani"],
    parties: ["National Assembly Member"]
  },
  Qatar: {
    first: ["Tamim", "Hamad", "Sheikha", "Jassim", "Abdullah", "Moza"],
    last: ["Al-Thani", "Al-Attiyah", "Al-Kuwari", "Al-Mahmoud", "Al-Sulaiti"],
    parties: ["Shura Council Member"]
  }
};

// ========== JURISDICTION-SPECIFIC REGULATORY BODIES ==========
const regulatoryBodies: Record<string, Record<string, string[]>> = {
  USA: {
    Radio: ["FCC", "NTIA", "State PUC"],
    "Product Safety": ["CPSC", "UL", "State Consumer Protection"],
    Cybersecurity: ["CISA", "NIST", "State AG Office"],
    Battery: ["EPA", "CalEPA", "DOT"],
    "Food Contact Material": ["FDA", "OEHHA", "State Health Dept"]
  },
  Canada: {
    Radio: ["ISED", "CSA Group"],
    "Product Safety": ["Health Canada", "CSA Group"],
    Cybersecurity: ["CCCS", "CSE", "Privacy Commissioner"],
    Battery: ["ECCC", "Transport Canada"],
    "Food Contact Material": ["Health Canada", "CFIA"]
  },
  EU: {
    Radio: ["ETSI", "CEN/CENELEC", "National Notified Bodies"],
    "Product Safety": ["European Commission DG GROW", "National Market Surveillance"],
    Cybersecurity: ["ENISA", "National Cybersecurity Agencies"],
    Battery: ["European Commission DG ENV", "WEEE Compliance Bodies"],
    "Food Contact Material": ["EFSA", "National Food Safety Authorities"]
  },
  Japan: {
    Radio: ["MIC (Ministry of Internal Affairs)", "TELEC"],
    "Product Safety": ["METI", "JIS", "PSE Mark Certification Bodies"],
    Cybersecurity: ["NISC", "IPA", "METI Cybersecurity"],
    Battery: ["MOE", "METI", "JIS Battery Standards"],
    "Food Contact Material": ["MHLW", "Food Sanitation Law Bodies"]
  },
  Korea: {
    Radio: ["MSIT", "KCC", "RRA"],
    "Product Safety": ["KATS", "KC Mark Bodies", "KTC"],
    Cybersecurity: ["KISA", "NIS", "MSIT Cybersecurity"],
    Battery: ["MOE Korea", "KATS Battery Division"],
    "Food Contact Material": ["MFDS", "KFDA"]
  },
  Taiwan: {
    Radio: ["NCC", "BSMI"],
    "Product Safety": ["BSMI", "MOEA"],
    Cybersecurity: ["NICST", "MOEA Cybersecurity"],
    Battery: ["EPA Taiwan", "MOEA"],
    "Food Contact Material": ["TFDA", "MOH"]
  },
  GCC: {
    Radio: ["TRA (UAE)", "CITC (KSA)", "TRA (Oman)", "CITRA (Kuwait)", "TRA (Bahrain)", "CRA (Qatar)"],
    "Product Safety": ["ESMA (UAE)", "SASO (KSA)", "GSO"],
    Cybersecurity: ["NESA (UAE)", "NCA (KSA)", "National Cyber Authorities"],
    Battery: ["MOEI (UAE)", "SASO (KSA)", "GSO Environmental"],
    "Food Contact Material": ["Dubai Municipality", "SFDA (KSA)", "GSO Food"]
  }
};

// ========== JURISDICTION-SPECIFIC FULL TEXT GENERATORS ==========
function generateUSAFullText(item: InternationalLegislation): string {
  const isState = item.subJurisdiction && item.subJurisdiction !== "Federal";
  const chamber = item.localTerminology?.includes("Senate") ? "SENATE" : "HOUSE OF REPRESENTATIVES";
  
  return `
${isState ? `STATE OF ${item.subJurisdiction}` : "UNITED STATES CONGRESS"}
${item.legislativeCategory === "enacted" ? "PUBLIC LAW" : chamber + " BILL"}

${item.title.toUpperCase()}

Be it enacted by the ${isState ? "Legislature" : "Senate and House of Representatives"} of the ${isState ? `State of ${item.subJurisdiction}` : "United States of America"} in ${isState ? "regular session" : "Congress"} assembled,

SECTION 1. SHORT TITLE
This ${item.legislationType === "bill" ? "Act" : "Law"} may be cited as the "${item.title}".

SECTION 2. FINDINGS AND PURPOSE
The ${isState ? "Legislature" : "Congress"} finds that—
(1) Consumer protection in the area of ${item.regulatoryCategory.toLowerCase()} requires updated standards;
(2) Technological advances necessitate regulatory modernization;
(3) Harmonization with ${isState ? "federal" : "international"} standards promotes commerce.

${item.summary}

SECTION 3. DEFINITIONS
In this Act:
(a) "Covered product" means any consumer device subject to this Act.
(b) "Manufacturer" includes any person who designs, manufactures, or imports covered products.
(c) "Secretary" means the head of the implementing agency.

SECTION 4. REQUIREMENTS
The following requirements shall apply to all covered products:
${item.bullets.map((b, i) => `(${i + 1}) ${b}`).join("\n")}

SECTION 5. ENFORCEMENT
(a) CIVIL PENALTIES.—Any person who violates this Act shall be subject to a civil penalty of not more than $100,000 for each violation.
(b) CRIMINAL PENALTIES.—Willful violations may result in criminal prosecution.
(c) INJUNCTIVE RELIEF.—The Attorney General may seek injunctive relief.

SECTION 6. EFFECTIVE DATE
This Act shall take effect ${item.effectiveDate ? `on ${item.effectiveDate}` : "180 days after enactment"}.

---
Published: ${item.publishedDate}
Regulatory Body: ${item.regulatoryBody}
${item.complianceDeadline ? `Compliance Deadline: ${item.complianceDeadline}` : ""}
`.trim();
}

function generateEUFullText(item: InternationalLegislation): string {
  const isRegulation = item.legislationType === "regulation";
  const instrumentType = isRegulation ? "REGULATION" : "DIRECTIVE";
  
  return `
EUROPEAN UNION
OFFICIAL JOURNAL OF THE EUROPEAN UNION

${instrumentType} (EU) ${new Date().getFullYear()}/${Math.floor(Math.random() * 9000) + 1000}
OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL

${item.title.toUpperCase()}

THE EUROPEAN PARLIAMENT AND THE COUNCIL OF THE EUROPEAN UNION,

Having regard to the Treaty on the Functioning of the European Union, and in particular Article 114 thereof,

Having regard to the proposal from the European Commission,

After transmission of the draft legislative act to the national parliaments,

Having regard to the opinion of the European Economic and Social Committee,

Acting in accordance with the ordinary legislative procedure,

Whereas:

(1) The protection of consumers and the internal market requires harmonised rules on ${item.regulatoryCategory.toLowerCase()}.
(2) ${item.summary}
(3) This ${instrumentType.toLowerCase()} respects fundamental rights and observes the principles recognised by the Charter of Fundamental Rights of the European Union.

HAVE ADOPTED THIS ${instrumentType}:

CHAPTER I — GENERAL PROVISIONS

Article 1 — Subject matter
This ${instrumentType.toLowerCase()} lays down harmonised rules on ${item.regulatoryCategory.toLowerCase()} for products placed on the Union market.

Article 2 — Scope
This ${instrumentType.toLowerCase()} applies to:
${item.bullets.map((b, i) => `(${String.fromCharCode(97 + i)}) ${b}`).join("\n")}

Article 3 — Definitions
For the purposes of this ${instrumentType.toLowerCase()}:
(1) 'economic operator' means the manufacturer, authorised representative, importer or distributor;
(2) 'placing on the market' means the first making available of a product on the Union market;
(3) 'market surveillance authority' means an authority designated by a Member State.

CHAPTER II — OBLIGATIONS OF ECONOMIC OPERATORS

Article 4 — Obligations of manufacturers
1. Manufacturers shall ensure that products placed on the market comply with this ${instrumentType.toLowerCase()}.
2. Manufacturers shall draw up technical documentation.
3. Manufacturers shall affix the CE marking.

CHAPTER III — CONFORMITY ASSESSMENT

Article 5 — Conformity assessment procedures
Products shall be subject to conformity assessment procedures set out in Annex II.

CHAPTER IV — MARKET SURVEILLANCE

Article 6 — Union market surveillance
Member States shall establish market surveillance authorities with adequate powers and resources.

CHAPTER V — FINAL PROVISIONS

Article 7 — Entry into force
This ${instrumentType.toLowerCase()} shall enter into force on ${item.effectiveDate || "the twentieth day following its publication"}.

This ${instrumentType.toLowerCase()} shall be binding in its entirety${isRegulation ? " and directly applicable in all Member States" : ""}.

Done at Brussels, ${item.publishedDate}

For the European Parliament — The President
For the Council — The President
`.trim();
}

function generateJapanFullText(item: InternationalLegislation): string {
  return `
日本国 / JAPAN
${item.legislativeCategory === "enacted" ? "法律 / LAW" : "法案 / BILL"}

${item.title}
${item.title.toUpperCase()} (English Translation)

第一条（目的）/ Article 1 (Purpose)
この法律は、${item.regulatoryCategory}に関する事項を定めることにより、国民の安全と利益を保護することを目的とする。
This law aims to protect the safety and interests of the people by establishing matters concerning ${item.regulatoryCategory.toLowerCase()}.

第二条（定義）/ Article 2 (Definitions)
この法律において、次の各号に掲げる用語の意義は、当該各号に定めるところによる。
In this law, the meanings of the terms listed in the following items shall be as defined in each item:
一　「製造業者」とは、製品を製造する者をいう。
(1) "Manufacturer" means a person who manufactures products.
二　「輸入業者」とは、製品を輸入する者をいう。
(2) "Importer" means a person who imports products.

第三条（適用範囲）/ Article 3 (Scope of Application)
${item.summary}

Requirements:
${item.bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

第四条（基準）/ Article 4 (Standards)
製品は、経済産業省令で定める技術基準に適合しなければならない。
Products must conform to technical standards established by Ordinance of the Ministry of Economy, Trade and Industry.

第五条（罰則）/ Article 5 (Penalties)
この法律の規定に違反した者は、一年以下の懲役又は百万円以下の罰金に処する。
A person who violates the provisions of this law shall be punished by imprisonment for not more than one year or a fine of not more than one million yen.

附則 / Supplementary Provisions
施行期日：${item.effectiveDate || "公布の日から起算して六月を経過した日"}
Effective Date: ${item.effectiveDate || "Six months from the date of promulgation"}

---
Published: ${item.publishedDate}
Regulatory Body: ${item.regulatoryBody}
Official Gazette Number: 官報号外第${Math.floor(Math.random() * 999) + 1}号
`.trim();
}

function generateKoreaFullText(item: InternationalLegislation): string {
  return `
대한민국 / REPUBLIC OF KOREA
${item.legislativeCategory === "enacted" ? "법률 / ACT" : "법률안 / BILL"}
국회 / NATIONAL ASSEMBLY

${item.title}
${item.title.toUpperCase()} (English Translation)

제1조 (목적) / Article 1 (Purpose)
이 법은 ${item.regulatoryCategory}에 관한 사항을 규정함으로써 국민의 안전과 이익을 보호함을 목적으로 한다.
The purpose of this Act is to protect the safety and interests of the people by prescribing matters concerning ${item.regulatoryCategory.toLowerCase()}.

제2조 (정의) / Article 2 (Definitions)
이 법에서 사용하는 용어의 뜻은 다음과 같다.
The terms used in this Act are defined as follows:
1. "제조업자"란 제품을 제조하는 자를 말한다.
1. "Manufacturer" means a person who manufactures products.
2. "수입업자"란 제품을 수입하는 자를 말한다.
2. "Importer" means a person who imports products.

제3조 (적용 범위) / Article 3 (Scope of Application)
${item.summary}

Requirements:
${item.bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

제4조 (기준) / Article 4 (Standards)
제품은 산업통상자원부령으로 정하는 기술기준에 적합하여야 한다.
Products shall conform to technical standards prescribed by Ordinance of the Ministry of Trade, Industry and Energy.

제5조 (벌칙) / Article 5 (Penalties)
이 법을 위반한 자는 1년 이하의 징역 또는 1천만원 이하의 벌금에 처한다.
A person who violates this Act shall be punished by imprisonment for not more than one year or a fine of not more than 10 million won.

부칙 / Addenda
시행일: ${item.effectiveDate || "공포 후 6개월이 경과한 날"}
Effective Date: ${item.effectiveDate || "Six months after promulgation"}

---
Published: ${item.publishedDate}
KC Mark Required: Yes
Regulatory Body: ${item.regulatoryBody}
`.trim();
}

function generateTaiwanFullText(item: InternationalLegislation): string {
  return `
中華民國 / REPUBLIC OF CHINA (TAIWAN)
${item.legislativeCategory === "enacted" ? "法律 / ACT" : "法律草案 / BILL"}
立法院 / LEGISLATIVE YUAN

${item.title}
${item.title.toUpperCase()} (English Translation)

第一條（立法目的）/ Article 1 (Legislative Purpose)
為規範${item.regulatoryCategory}相關事項，保障消費者權益及促進產業發展，特制定本法。
This Act is enacted to regulate matters concerning ${item.regulatoryCategory.toLowerCase()}, protect consumer rights, and promote industrial development.

第二條（名詞定義）/ Article 2 (Definitions)
本法用詞，定義如下：
The terms used in this Act are defined as follows:
一、製造商：指從事產品製造之業者。
1. Manufacturer: A business engaged in product manufacturing.
二、進口商：指從事產品進口之業者。
2. Importer: A business engaged in product importation.

第三條（適用範圍）/ Article 3 (Scope)
${item.summary}

Requirements:
${item.bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

第四條（標準）/ Article 4 (Standards)
產品應符合經濟部標準檢驗局所定之技術規範。
Products shall conform to technical standards established by the Bureau of Standards, Metrology and Inspection, MOEA.

第五條（罰則）/ Article 5 (Penalties)
違反本法規定者，處新臺幣十萬元以上一百萬元以下罰鍰。
Violations of this Act shall be subject to a fine of not less than NT$100,000 and not more than NT$1,000,000.

附則 / Supplementary Provisions
施行日期：${item.effectiveDate || "自公布日施行"}
Effective Date: ${item.effectiveDate || "From the date of promulgation"}

---
Published: ${item.publishedDate}
BSMI Certification Required: Yes
CNS Standard Reference: CNS ${Math.floor(Math.random() * 9999) + 10000}
Regulatory Body: ${item.regulatoryBody}
`.trim();
}

function generateGCCFullText(item: InternationalLegislation, country: string): string {
  const arabicHeader = {
    UAE: "الإمارات العربية المتحدة",
    "Saudi Arabia": "المملكة العربية السعودية",
    Oman: "سلطنة عُمان",
    Kuwait: "دولة الكويت",
    Bahrain: "مملكة البحرين",
    Qatar: "دولة قطر"
  }[country] || "GCC";
  
  return `
${arabicHeader}
${country.toUpperCase()}
${item.legislationType === "decree" ? "ROYAL/EMIRI DECREE" : "FEDERAL LAW"}

${item.title.toUpperCase()}

We, ${country === "UAE" ? "the President of the United Arab Emirates" : country === "Saudi Arabia" ? "the Custodian of the Two Holy Mosques" : `the Ruler of ${country}`},

Having perused the Constitution,
Having perused the Federal Law concerning ${item.regulatoryCategory},
Based upon the proposal of the Cabinet,
And the approval of the Federal National Council,

Have decreed the following:

Article (1) — Definitions
In the application of this Law, the following terms shall have the meanings assigned to them:
1. "Authority" means the competent regulatory authority.
2. "Product" means any good subject to this Law.
3. "Conformity" means compliance with applicable standards.

Article (2) — Scope
This Law applies to ${item.regulatoryCategory.toLowerCase()} products marketed in ${country}.

${item.summary}

Requirements:
${item.bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Article (3) — Technical Requirements
Products shall comply with:
(a) GSO Standards (Gulf Standardization Organization)
(b) ${country === "UAE" ? "ESMA" : country === "Saudi Arabia" ? "SASO" : "National"} Technical Regulations
(c) International standards where applicable (IEC, ISO)

Article (4) — Conformity Assessment
Products shall undergo conformity assessment by an accredited body before being placed on the market.

Article (5) — Market Surveillance
The Authority shall conduct market surveillance to ensure ongoing compliance.

Article (6) — Penalties
Violations of this Law shall be subject to:
1. Fines of up to ${country === "UAE" ? "AED 1,000,000" : country === "Saudi Arabia" ? "SAR 1,000,000" : "equivalent in local currency"}
2. Product recall and market withdrawal
3. Criminal prosecution for repeat offenders

Article (7) — Effective Date
This Law shall be published in the Official Gazette and come into force ${item.effectiveDate ? `on ${item.effectiveDate}` : "three months from the date of publication"}.

Issued at ${country === "UAE" ? "Abu Dhabi" : country === "Saudi Arabia" ? "Riyadh" : "the Capital"}
Date: ${item.publishedDate}

---
GSO Mark Required: Yes
Regulatory Body: ${item.regulatoryBody}
Official Gazette: ${Math.floor(Math.random() * 999) + 1}/${new Date().getFullYear()}
`.trim();
}

function generateCanadaFullText(item: InternationalLegislation): string {
  const isFederal = item.subJurisdiction === "Federal";
  const billPrefix = item.localTerminology?.includes("C-") ? "C-" : "S-";
  
  return `
${isFederal ? "CANADA" : `PROVINCE OF ${item.subJurisdiction?.toUpperCase()}`}
PARLIAMENT ${isFederal ? "OF CANADA" : ""}

${item.legislativeCategory === "enacted" ? "STATUTES OF CANADA" : `BILL ${billPrefix}${Math.floor(Math.random() * 99) + 1}`}

${item.title.toUpperCase()}

An Act respecting ${item.regulatoryCategory.toLowerCase()} and to make related amendments to other Acts

${isFederal ? "Her Majesty" : "His Majesty"}, by and with the advice and consent of the ${isFederal ? "Senate and House of Commons of Canada" : "Legislative Assembly"}, enacts as follows:

SHORT TITLE
1. This Act may be cited as the ${item.title}.

INTERPRETATION
2. The following definitions apply in this Act:
"manufacturer" means a person who, for commercial purposes, manufactures or assembles a product. (fabricant)
"importer" means a person who imports a product into Canada. (importateur)
"Minister" means the ${isFederal ? "Minister of Industry" : "responsible Minister"}. (ministre)

PURPOSE
3. The purpose of this Act is to protect the health and safety of Canadians by addressing ${item.regulatoryCategory.toLowerCase()}.

${item.summary}

REQUIREMENTS
4. (1) The following requirements apply:
${item.bullets.map((b, i) => `(${String.fromCharCode(97 + i)}) ${b}`).join("\n")}

(2) The Governor in Council may make regulations prescribing standards.

ENFORCEMENT
5. (1) An inspector may enter any place to verify compliance.
(2) Every person who contravenes this Act is liable to a fine of not more than $1,000,000.

OFFENCES
6. Every person who knowingly contravenes this Act commits an offence and is liable on conviction:
(a) on summary conviction, to a fine not exceeding $500,000 or imprisonment for a term not exceeding 18 months, or both; or
(b) on conviction on indictment, to a fine not exceeding $5,000,000 or imprisonment for a term not exceeding 5 years, or both.

COMING INTO FORCE
7. This Act comes into force ${item.effectiveDate ? `on ${item.effectiveDate}` : "on a day to be fixed by order of the Governor in Council"}.

---
Published: ${item.publishedDate}
${isFederal ? "Canada Gazette" : "Provincial Gazette"}: Part ${item.legislativeCategory === "enacted" ? "II" : "I"}
Regulatory Body: ${item.regulatoryBody}
${item.complianceDeadline ? `Compliance Deadline: ${item.complianceDeadline}` : ""}
`.trim();
}

// ========== MAIN ENRICHMENT FUNCTION ==========
export function generateJurisdictionSpecificContent(
  item: InternationalLegislation, 
  jurisdiction: string
): {
  fullText: string;
  sponsors: Array<{ name: string; party?: string; state?: string; role?: string }>;
  votingRecords?: Array<{ chamber: string; date: string; yea: number; nay: number; abstain: number; passed: boolean }>;
  actions: Array<{ date: string; description: string; chamber?: string }>;
  summaries: Array<{ versionName?: string; text: string }>;
  aiSummary: UnifiedLegislationItem["aiSummary"];
} {
  const sponsorData = sponsorNames[jurisdiction] || sponsorNames.USA;
  
  // Generate sponsors
  const numSponsors = Math.floor(Math.random() * 3) + 2;
  const sponsors = Array.from({ length: numSponsors }, (_, i) => ({
    name: `${sponsorData.first[Math.floor(Math.random() * sponsorData.first.length)]} ${sponsorData.last[Math.floor(Math.random() * sponsorData.last.length)]}`,
    party: sponsorData.parties[Math.floor(Math.random() * sponsorData.parties.length)],
    state: item.subJurisdiction || undefined,
    role: i === 0 ? "Primary Sponsor" : "Co-sponsor"
  }));
  
  // Generate voting records for enacted legislation
  const votingRecords = item.legislativeCategory === "enacted" ? generateVotingRecords(jurisdiction, item) : undefined;
  
  // Generate action history
  const actions = generateActionHistory(item, jurisdiction);
  
  // Generate summaries
  const summaries = generateSummaries(item, jurisdiction);
  
  // Generate full text
  let fullText: string;
  switch (jurisdiction) {
    case "USA":
      fullText = generateUSAFullText(item);
      break;
    case "Canada":
      fullText = generateCanadaFullText(item);
      break;
    case "EU":
      fullText = generateEUFullText(item);
      break;
    case "Japan":
      fullText = generateJapanFullText(item);
      break;
    case "Korea":
      fullText = generateKoreaFullText(item);
      break;
    case "Taiwan":
      fullText = generateTaiwanFullText(item);
      break;
    case "UAE":
    case "Saudi Arabia":
    case "Oman":
    case "Kuwait":
    case "Bahrain":
    case "Qatar":
      fullText = generateGCCFullText(item, jurisdiction);
      break;
    default:
      fullText = generateUSAFullText(item);
  }
  
  // Generate deep AI analysis
  const aiSummary = generateDeepAIAnalysis(item, jurisdiction);
  
  return {
    fullText,
    sponsors,
    votingRecords,
    actions,
    summaries,
    aiSummary
  };
}

function generateVotingRecords(jurisdiction: string, item: InternationalLegislation): Array<{ chamber: string; date: string; yea: number; nay: number; abstain: number; passed: boolean }> {
  const chamberConfig: Record<string, { lower: string; upper: string; lowerSize: number; upperSize: number }> = {
    USA: { lower: "House of Representatives", upper: "Senate", lowerSize: 435, upperSize: 100 },
    Canada: { lower: "House of Commons", upper: "Senate", lowerSize: 338, upperSize: 105 },
    EU: { lower: "European Parliament", upper: "Council of the EU", lowerSize: 705, upperSize: 27 },
    Japan: { lower: "House of Representatives", upper: "House of Councillors", lowerSize: 465, upperSize: 248 },
    Korea: { lower: "National Assembly", upper: "National Assembly", lowerSize: 300, upperSize: 300 },
    Taiwan: { lower: "Legislative Yuan", upper: "Legislative Yuan", lowerSize: 113, upperSize: 113 },
    UAE: { lower: "Federal National Council", upper: "Cabinet", lowerSize: 40, upperSize: 23 },
    "Saudi Arabia": { lower: "Shura Council", upper: "Council of Ministers", lowerSize: 150, upperSize: 30 },
    Oman: { lower: "Shura Council", upper: "State Council", lowerSize: 86, upperSize: 86 },
    Kuwait: { lower: "National Assembly", upper: "Council of Ministers", lowerSize: 50, upperSize: 16 },
    Bahrain: { lower: "Council of Representatives", upper: "Shura Council", lowerSize: 40, upperSize: 40 },
    Qatar: { lower: "Shura Council", upper: "Council of Ministers", lowerSize: 45, upperSize: 20 }
  };
  
  const config = chamberConfig[jurisdiction] || chamberConfig.USA;
  const baseDate = new Date(item.publishedDate);
  
  const lowerYea = Math.floor(config.lowerSize * (0.55 + Math.random() * 0.3));
  const lowerNay = Math.floor((config.lowerSize - lowerYea) * 0.8);
  const lowerAbstain = config.lowerSize - lowerYea - lowerNay;
  
  const upperYea = Math.floor(config.upperSize * (0.55 + Math.random() * 0.3));
  const upperNay = Math.floor((config.upperSize - upperYea) * 0.8);
  const upperAbstain = config.upperSize - upperYea - upperNay;
  
  return [
    {
      chamber: config.lower,
      date: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      yea: lowerYea,
      nay: lowerNay,
      abstain: lowerAbstain,
      passed: lowerYea > lowerNay
    },
    {
      chamber: config.upper,
      date: new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      yea: upperYea,
      nay: upperNay,
      abstain: upperAbstain,
      passed: upperYea > upperNay
    }
  ];
}

function generateActionHistory(item: InternationalLegislation, jurisdiction: string): Array<{ date: string; description: string; chamber?: string }> {
  const baseDate = new Date(item.publishedDate);
  const actions: Array<{ date: string; description: string; chamber?: string }> = [];
  
  const jurisdictionActions: Record<string, string[]> = {
    USA: ["Introduced in Congress", "Referred to Committee", "Committee Hearing", "Committee Report", "Floor Debate", "Passed Chamber", "Conference Committee", "Signed by President"],
    Canada: ["First Reading", "Second Reading Debate", "Committee Study", "Third Reading", "Senate Consideration", "Royal Assent"],
    EU: ["Commission Proposal Published", "Parliament First Reading", "Council Common Position", "Parliament Second Reading", "Trilogue Negotiations", "Formal Adoption", "OJ Publication"],
    Japan: ["Submitted to Diet", "Committee Assignment", "Committee Deliberation", "House Vote", "Upper House Referral", "Promulgation"],
    Korea: ["Bill Proposed", "Committee Referral", "Subcommittee Review", "Plenary Deliberation", "Promulgation"],
    Taiwan: ["Bill Submitted", "First Reading", "Committee Review", "Party Negotiation", "Second/Third Reading", "Presidential Promulgation"],
    GCC: ["Draft Prepared", "Cabinet Review", "Council Consultation", "Royal/Emiri Approval", "Official Gazette Publication"]
  };
  
  const actionList = jurisdictionActions[jurisdiction] || jurisdictionActions.USA;
  const numActions = item.legislativeCategory === "enacted" ? actionList.length : Math.min(3, actionList.length);
  
  for (let i = 0; i < numActions; i++) {
    const daysAgo = Math.floor((numActions - i) * 30);
    actions.push({
      date: new Date(baseDate.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      description: actionList[i],
      chamber: i % 2 === 0 ? "Lower Chamber" : "Committee"
    });
  }
  
  return actions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateSummaries(item: InternationalLegislation, jurisdiction: string): Array<{ versionName?: string; text: string }> {
  return [
    {
      versionName: "Official Summary",
      text: `This ${item.legislationType} addresses ${item.regulatoryCategory.toLowerCase()} requirements within ${jurisdiction}'s jurisdiction. ${item.summary} The legislation establishes a comprehensive framework for regulatory compliance and consumer protection.`
    },
    {
      versionName: "Committee Analysis",
      text: `The reviewing committee has analyzed the ${item.legislationType} and its implications for the ${item.regulatoryCategory.toLowerCase()} sector. Key provisions include: ${item.bullets.join("; ")}. The committee recommends ${item.legislativeCategory === "enacted" ? "continued monitoring of implementation" : "passage with proposed amendments"}.`
    },
    {
      versionName: "Industry Impact Assessment",
      text: `This ${item.legislationType} is expected to significantly impact manufacturers and importers in the ${item.regulatoryCategory.toLowerCase()} sector. Compliance will require updates to product design, testing procedures, and documentation. The regulatory authority estimates that affected entities will need 6-18 months to achieve full compliance.`
    }
  ];
}

function generateDeepAIAnalysis(item: InternationalLegislation, jurisdiction: string): UnifiedLegislationItem["aiSummary"] {
  const isEnacted = item.legislativeCategory === "enacted";
  const riskMultiplier = item.riskScore / 100;
  
  // Generate specific what changes based on regulatory category
  const whatChangesOptions: Record<string, string[]> = {
    Radio: [
      `Mandates updated RF emission testing to ${jurisdiction} standards. Wireless modules require re-certification.`,
      `New frequency band compliance required. WiFi 6E/6 GHz testing mandatory for connected appliances.`,
      `Enhanced EMC requirements for IoT devices. Third-party testing certification required.`
    ],
    "Product Safety": [
      `Requires enhanced thermal protection and auto-shutoff for heating appliances. Third-party certification mandatory.`,
      `New safety standards for high-wattage appliances. UL/IEC equivalents required for market access.`,
      `Child safety features mandatory. Ground fault protection upgraded to current standards.`
    ],
    Cybersecurity: [
      `Bans default passwords. Minimum 5-year security update support required. Secure boot mandatory.`,
      `Data encryption required for all connected devices. Vulnerability disclosure program mandatory.`,
      `Annual security audits required. End-of-life security notification to consumers mandatory.`
    ],
    Battery: [
      `Lithium battery safety certification required. BMS monitoring mandatory for all rechargeable products.`,
      `Producer take-back programs required. Collection point infrastructure investment needed.`,
      `Thermal runaway protection standards updated. Transportation labeling requirements expanded.`
    ],
    "Food Contact Material": [
      `PFAS and BPA banned in food-contact surfaces. Heavy metal migration limits tightened.`,
      `Third-party material certification required. Hot-liquid migration testing mandatory.`,
      `Consumer disclosure requirements for all food-contact components. Annual testing required.`
    ]
  };
  
  const categoryOptions = whatChangesOptions[item.regulatoryCategory] || [item.bullets[0] || item.summary.slice(0, 100)];
  const whatChanges = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];
  
  // Generate stakeholder analysis
  const stakeholderAnalysis = [
    {
      stakeholder: "Product Engineering Team",
      type: "internal" as const,
      impactLevel: item.riskScore >= 70 ? "high" as const : item.riskScore >= 40 ? "medium" as const : "low" as const,
      impactDescription: `Must redesign ${item.regulatoryCategory.toLowerCase()} compliance features. Estimated 3-6 months development.`,
      requiredActions: ["Review current product specifications", "Develop compliance roadmap", "Engage with testing labs"],
      timeline: "0-6 months"
    },
    {
      stakeholder: "Regulatory Affairs",
      type: "internal" as const,
      impactLevel: "high" as const,
      impactDescription: "Must file updated documentation and manage certification process.",
      requiredActions: ["Update technical files", "Submit certification applications", "Coordinate with authorities"],
      timeline: "Ongoing"
    },
    {
      stakeholder: "Supply Chain",
      type: "external" as const,
      impactLevel: item.riskScore >= 60 ? "medium" as const : "low" as const,
      impactDescription: "Component suppliers may need to provide updated compliance documentation or materials.",
      requiredActions: ["Audit supplier compliance", "Request updated certificates", "Identify alternative suppliers"],
      timeline: "1-3 months"
    },
    {
      stakeholder: `${jurisdiction} Market Access`,
      type: "regulatory" as const,
      impactLevel: "high" as const,
      impactDescription: `${isEnacted ? "Active enforcement expected" : "Prepare for upcoming requirements"}.`,
      requiredActions: ["Engage with local counsel", "Monitor enforcement actions", "Prepare compliance evidence"],
      timeline: isEnacted ? "Immediate" : "Pre-effective date"
    }
  ];
  
  // Generate compliance requirements
  const complianceRequirements = [
    {
      requirement: `Complete ${item.regulatoryCategory.toLowerCase()} assessment for all affected SKUs`,
      priority: "critical" as const,
      deadline: item.complianceDeadline || item.effectiveDate,
      estimatedEffort: "2-4 weeks",
      responsibleDepartment: "Quality Assurance"
    },
    {
      requirement: "Update product documentation and technical files",
      priority: "high" as const,
      deadline: item.complianceDeadline || item.effectiveDate,
      estimatedEffort: "1-2 weeks per product",
      responsibleDepartment: "Regulatory Affairs"
    },
    {
      requirement: "Obtain third-party certification/testing",
      priority: item.riskScore >= 70 ? "critical" as const : "high" as const,
      deadline: item.complianceDeadline,
      estimatedEffort: "4-8 weeks",
      responsibleDepartment: "Quality Assurance"
    },
    {
      requirement: "Update labeling and marketing materials",
      priority: "medium" as const,
      estimatedEffort: "1-2 weeks",
      responsibleDepartment: "Marketing"
    }
  ];
  
  // Generate strategic recommendations
  const strategicRecommendations = [
    {
      title: "Immediate Compliance Assessment",
      description: `Conduct gap analysis of current products against new ${jurisdiction} requirements. Prioritize high-volume SKUs.`,
      priority: "immediate" as const,
      resourcesRequired: "Regulatory team + 1 engineer"
    },
    {
      title: "Engage Testing Laboratory",
      description: `Select and engage accredited testing laboratory for ${item.regulatoryCategory.toLowerCase()} compliance verification.`,
      priority: "short-term" as const,
      resourcesRequired: "Budget allocation + lab selection"
    },
    {
      title: "Supply Chain Audit",
      description: "Verify component suppliers can provide required documentation and certificates.",
      priority: "short-term" as const,
      resourcesRequired: "Procurement team"
    },
    {
      title: "Market Strategy Review",
      description: `Evaluate ${jurisdiction} market positioning given compliance costs. Consider timeline for market entry/continuation.`,
      priority: "medium-term" as const,
      resourcesRequired: "Business development + Finance"
    }
  ];
  
  // Generate related legislation
  const relatedLegislation = [
    {
      identifier: `${jurisdiction}-${item.regulatoryCategory.replace(/\s/g, "-")}-PREV`,
      title: `Previous ${item.regulatoryCategory} Standards (${new Date().getFullYear() - 3})`,
      relationship: "amends" as const,
      relevance: "This legislation supersedes previous requirements"
    },
    {
      identifier: `INTL-${item.regulatoryCategory.replace(/\s/g, "-")}-STD`,
      title: `International ${item.regulatoryCategory} Framework`,
      relationship: "implements" as const,
      relevance: "Aligns with international standards (IEC/ISO)"
    }
  ];
  
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  let keyDeadline: string;
  if (isEnacted && item.effectiveDate) {
    const effDate = new Date(item.effectiveDate);
    const now = new Date();
    if (effDate <= now) {
      keyDeadline = `In force since ${formatDate(item.effectiveDate)}. Immediate compliance required.`;
    } else {
      const daysRemaining = Math.ceil((effDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      keyDeadline = `Effective ${formatDate(item.effectiveDate)}. ${daysRemaining} days remaining.`;
    }
  } else if (item.complianceDeadline) {
    const deadline = new Date(item.complianceDeadline);
    const now = new Date();
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    keyDeadline = `Compliance deadline: ${formatDate(item.complianceDeadline)}. ${daysRemaining} days remaining.`;
  } else {
    keyDeadline = `Currently in ${item.status}. Monitor for passage timeline.`;
  }
  
  return {
    whatChanges,
    whoImpacted: `Directly affects smart kettle and espresso machine product lines. Impacts R&D, QA, regulatory, and supply chain teams. Est. compliance cost: $${Math.floor(15000 + riskMultiplier * 50000).toLocaleString()}-$${Math.floor(50000 + riskMultiplier * 150000).toLocaleString()} per SKU.`,
    keyDeadline,
    generatedAt: new Date().toISOString(),
    riskScore: item.riskScore,
    riskCategory: item.riskLevel,
    riskExplanation: `${item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)} risk (${item.riskScore}/100). ${
      item.riskScore >= 80 ? "Major product changes or re-certification likely required." :
      item.riskScore >= 60 ? "Significant compliance investment needed." :
      item.riskScore >= 40 ? "Moderate updates to compliance framework required." :
      "Minor documentation updates expected."
    }`,
    stakeholders: item.impactAreas,
    
    executiveSummary: `${jurisdiction} ${item.legislationType} on ${item.regulatoryCategory.toLowerCase()} ${isEnacted ? "now in force" : "pending approval"}. ${item.summary} Direct impact on smart kettle and espresso machine product lines requiring ${item.riskScore >= 70 ? "immediate action" : "monitoring and planning"}.`,
    
    statistics: {
      estimatedAffectedCompanies: Math.floor(50 + riskMultiplier * 200),
      estimatedComplianceCost: {
        min: Math.floor(15000 + riskMultiplier * 50000),
        max: Math.floor(50000 + riskMultiplier * 150000),
        currency: jurisdiction === "EU" ? "EUR" : jurisdiction === "Japan" ? "JPY" : jurisdiction === "Korea" ? "KRW" : "USD"
      },
      implementationTimeMonths: Math.floor(6 + riskMultiplier * 12),
      penaltyRange: {
        min: Math.floor(10000 + riskMultiplier * 90000),
        max: Math.floor(100000 + riskMultiplier * 900000),
        currency: jurisdiction === "EU" ? "EUR" : jurisdiction === "Japan" ? "JPY" : jurisdiction === "Korea" ? "KRW" : "USD"
      },
      complianceComplexityScore: Math.ceil(riskMultiplier * 10)
    },
    
    riskAnalysis: {
      overallRiskScore: item.riskScore,
      riskBreakdown: [
        { category: "Regulatory", score: Math.floor(item.riskScore * 0.4), description: "Compliance documentation and certification requirements", mitigationStrategy: "Engage regulatory consultant early" },
        { category: "Operational", score: Math.floor(item.riskScore * 0.3), description: "Product redesign and testing needs", mitigationStrategy: "Allocate engineering resources" },
        { category: "Financial", score: Math.floor(item.riskScore * 0.2), description: "Certification costs and potential delays", mitigationStrategy: "Budget contingency 20%" },
        { category: "Reputational", score: Math.floor(item.riskScore * 0.1), description: "Market access and brand compliance", mitigationStrategy: "Proactive communication" }
      ],
      probabilityOfEnforcement: item.riskScore >= 70 ? "high" : item.riskScore >= 40 ? "medium" : "low",
      potentialLiabilities: ["Product recalls", "Market withdrawal", "Civil penalties", "Criminal prosecution (willful violations)"],
      competitiveRiskAssessment: "Early compliance may provide competitive advantage in regulated markets"
    },
    
    stakeholderAnalysis,
    complianceRequirements,
    strategicRecommendations,
    relatedLegislation,
    
    industryBenchmarks: {
      averageComplianceTime: `${Math.floor(4 + riskMultiplier * 8)} months`,
      industryReadinessLevel: item.riskScore >= 70 ? "Low - major gaps expected" : item.riskScore >= 40 ? "Moderate - some gaps" : "High - mostly prepared",
      competitorAdoptionRate: `${Math.floor(20 + (100 - item.riskScore) * 0.6)}% of competitors already compliant`,
      bestPractices: [
        "Start compliance assessment immediately",
        "Engage accredited testing laboratories early",
        "Maintain detailed documentation trail",
        "Consider phased rollout by market priority"
      ]
    }
  };
}
