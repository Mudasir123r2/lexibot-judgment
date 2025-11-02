// scripts/seedJudgments.js - Seed script for mock judgment data
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "../config/db.js";
import Judgment from "../models/Judgment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

const mockJudgments = [
  {
    caseNumber: "CIV-2024-001",
    title: "Smith v. Johnson - Property Dispute Resolution",
    court: "High Court of Justice",
    judge: "Hon. Justice Anderson",
    dateOfJudgment: new Date("2024-01-15"),
    caseType: "Property",
    jurisdiction: "England & Wales",
    year: 2024,
    keywords: ["property", "dispute", "real estate", "boundary"],
    fullText: `This judgment concerns a property dispute between the parties regarding boundary lines and ownership rights. The court heard arguments from both sides regarding the interpretation of property deeds and historical land use. After careful consideration of all evidence presented, including survey reports and witness testimonies, the court finds in favor of the plaintiff regarding the boundary determination. The defendant is ordered to remove encroaching structures within 30 days and pay costs of £5,000.`,
    summary: "The court ruled in favor of the plaintiff in a property boundary dispute, ordering the defendant to remove encroachments and pay costs. The judgment clarifies the legal interpretation of property deeds and establishes precedent for similar boundary disputes.",
    keyInformation: {
      parties: [
        { name: "Smith", role: "Plaintiff" },
        { name: "Johnson", role: "Defendant" }
      ],
      issues: [
        "Boundary line determination",
        "Property deed interpretation",
        "Encroachment removal"
      ],
      decisions: [
        "Boundary determined in favor of plaintiff",
        "Defendant ordered to remove structures within 30 days",
        "Costs awarded to plaintiff: £5,000"
      ],
      deadlines: [
        "30 days for structure removal"
      ],
      obligations: [
        "Defendant must remove encroaching structures",
        "Defendant must pay £5,000 in costs"
      ]
    },
    citations: ["Property Act 1925", "Land Registration Act 2002"]
  },
  {
    caseNumber: "CRIM-2024-045",
    title: "State v. Williams - Criminal Sentencing",
    court: "Crown Court",
    judge: "Hon. Justice Mitchell",
    dateOfJudgment: new Date("2024-02-20"),
    caseType: "Criminal",
    jurisdiction: "England & Wales",
    year: 2024,
    keywords: ["criminal", "sentencing", "fraud", "financial"],
    fullText: `The defendant was charged with multiple counts of financial fraud totaling £250,000. The prosecution presented compelling evidence of systematic misappropriation of funds over a period of 18 months. The defendant pleaded guilty to all charges. Considering the defendant's cooperation, early guilty plea, and lack of prior convictions, the court sentences the defendant to 3 years imprisonment with eligibility for parole after 18 months. The court also orders restitution of £200,000 to be paid to victims over a 5-year period.`,
    summary: "Defendant sentenced to 3 years imprisonment for financial fraud, with possibility of parole after 18 months. Court orders restitution of £200,000 to victims. Judgment emphasizes cooperation and early plea in sentencing considerations.",
    keyInformation: {
      parties: [
        { name: "State", role: "Prosecution" },
        { name: "Williams", role: "Defendant" }
      ],
      issues: [
        "Financial fraud sentencing",
        "Restitution orders",
        "Parole eligibility"
      ],
      decisions: [
        "3 years imprisonment",
        "Parole eligible after 18 months",
        "Restitution: £200,000 over 5 years"
      ],
      deadlines: [
        "5-year restitution payment plan"
      ],
      obligations: [
        "Defendant to serve prison sentence",
        "Defendant to pay restitution as ordered"
      ]
    },
    citations: ["Fraud Act 2006", "Sentencing Guidelines 2020"]
  },
  {
    caseNumber: "FAM-2024-112",
    title: "Roberts v. Roberts - Child Custody Arrangement",
    court: "Family Court",
    judge: "Hon. Justice Thompson",
    dateOfJudgment: new Date("2024-03-10"),
    caseType: "Family",
    jurisdiction: "England & Wales",
    year: 2024,
    keywords: ["family", "custody", "divorce", "children"],
    fullText: `This case involves the determination of child custody and visitation rights following divorce proceedings. Both parties seek primary custody of two minor children, aged 8 and 12. The court has considered the children's best interests, parental capacity, stability factors, and the children's expressed preferences. The judgment awards joint legal custody with primary physical custody to the mother. The father is granted extensive visitation rights including alternate weekends, half of school holidays, and regular mid-week visits. Both parties are required to attend parenting coordination sessions.`,
    summary: "Court awards joint legal custody with primary physical custody to mother. Father granted extensive visitation including alternate weekends and holidays. Both parents required to attend parenting coordination for children's welfare.",
    keyInformation: {
      parties: [
        { name: "Roberts (Mother)", role: "Plaintiff" },
        { name: "Roberts (Father)", role: "Defendant" }
      ],
      issues: [
        "Child custody determination",
        "Visitation rights",
        "Parenting coordination"
      ],
      decisions: [
        "Joint legal custody",
        "Primary physical custody to mother",
        "Father: alternate weekends and holidays"
      ],
      deadlines: [
        "Parenting coordination sessions to begin within 30 days"
      ],
      obligations: [
        "Both parents attend coordination sessions",
        "Adhere to visitation schedule",
        "Prioritize children's best interests"
      ]
    },
    citations: ["Children Act 1989", "Family Procedure Rules 2010"]
  },
  {
    caseNumber: "CORP-2024-089",
    title: "ABC Corporation v. XYZ Ltd - Breach of Contract",
    court: "Commercial Court",
    judge: "Hon. Justice Harrison",
    dateOfJudgment: new Date("2024-04-05"),
    caseType: "Corporate",
    jurisdiction: "England & Wales",
    year: 2024,
    keywords: ["corporate", "contract", "breach", "damages", "commercial"],
    fullText: `This case concerns a commercial contract dispute where the defendant failed to deliver goods according to agreed specifications. The contract valued at £1.2 million specified delivery of 10,000 units by March 1, 2024. The defendant delivered only 7,500 units and these did not meet quality standards. The plaintiff seeks damages for breach of contract, including lost profits and replacement costs. The court finds the defendant in material breach. Judgment is awarded to the plaintiff for £450,000 in damages plus interest at 8% per annum from the breach date. The defendant is also ordered to pay £75,000 in legal costs.`,
    summary: "Court finds defendant in breach of commercial contract for failure to deliver goods according to specifications. Judgment awarded: £450,000 damages plus interest and £75,000 costs. Emphasizes importance of contract performance in commercial relationships.",
    keyInformation: {
      parties: [
        { name: "ABC Corporation", role: "Plaintiff" },
        { name: "XYZ Ltd", role: "Defendant" }
      ],
      issues: [
        "Contract breach",
        "Damages calculation",
        "Delivery obligations"
      ],
      decisions: [
        "Material breach established",
        "Damages: £450,000",
        "Interest: 8% per annum",
        "Costs: £75,000"
      ],
      deadlines: [
        "Payment due within 30 days"
      ],
      obligations: [
        "Defendant to pay damages and interest",
        "Defendant to pay legal costs"
      ]
    },
    citations: ["Sale of Goods Act 1979", "Contract Law Principles"]
  }
];

const seedJudgments = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing judgments (optional - remove if you want to keep existing data)
    // await Judgment.deleteMany({});

    // Check which judgments already exist
    const existingCaseNumbers = await Judgment.find({}).select("caseNumber");
    const existingNumbers = new Set(existingCaseNumbers.map(j => j.caseNumber));

    let created = 0;
    let skipped = 0;

    for (const judgment of mockJudgments) {
      if (existingNumbers.has(judgment.caseNumber)) {
        console.log(`⏭️  Skipped: ${judgment.caseNumber} (already exists)`);
        skipped++;
        continue;
      }

      await Judgment.create(judgment);
      console.log(`✅ Created: ${judgment.caseNumber} - ${judgment.title}`);
      created++;
    }

    console.log(`\n✨ Seeding complete!`);
    console.log(`   Created: ${created} judgments`);
    console.log(`   Skipped: ${skipped} judgments`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding judgments:", err);
    process.exit(1);
  }
};

seedJudgments();

