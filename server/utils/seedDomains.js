import AllowedDomain from "../models/alloweddomain.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const initialDomains = [
  {
    domain: "bits-pilani.ac.in",
    institutionName: "BITS Pilani",
    isActive: true,
  },
  {
    domain: "sst.scaler.com",
    institutionName: "Scaler School of Technology",
    isActive: true,
  },
  {
    domain: "iitb.ac.in",
    institutionName: "IIT Bombay",
    isActive: true,
  },
  {
    domain: "iitd.ac.in",
    institutionName: "IIT Delhi",
    isActive: true,
  },
  {
    domain: "iitm.ac.in",
    institutionName: "IIT Madras",
    isActive: true,
  },
  {
    domain: "iitkgp.ac.in",
    institutionName: "IIT Kharagpur",
    isActive: true,
  },
  {
    domain: "iitk.ac.in",
    institutionName: "IIT Kanpur",
    isActive: true,
  },
  // Add more domains as needed
];

const seedDomains = async () => {
  try {
    await connectDB();

    console.log("Clearing existing domains...");
    await AllowedDomain.deleteMany({});

    console.log("Seeding domains...");
    const createdDomains = await AllowedDomain.insertMany(initialDomains);

    console.log(`Successfully seeded ${createdDomains.length} allowed domains:`);
    createdDomains.forEach((domain) => {
      console.log(`  - ${domain.institutionName} (${domain.domain})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding allowed domains:", error.message);
    process.exit(1);
  }
};

seedDomains();
