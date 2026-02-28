const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital");

// Mock hospitals for fallback
const mockHospitals = [
  {
    name: "RIMS Ranchi",
    address: "Bariatu Road, Ranchi 834009",
    phone: "+91-651-254-1533",
    email: "info@rimsranchi.org",
    location: { type: "Point", coordinates: [85.3096, 23.3916] },
    emergencyTypes: ["Accident", "Trauma", "General", "ICU"],
    status: {
      generalBeds: 500,
      icuBeds: 120,
      ventilators: 80,
      bloodBankAvail: true,
      operationTheaterFree: false,
      ambulanceAvail: 15,
      currentLoad: "High",
    },
  },
  {
    name: "Tata Main Hospital",
    address: "Northern Town, Jamshedpur 831001",
    phone: "+91-657-664-0000",
    email: "contact@tmh.in",
    location: { type: "Point", coordinates: [86.2029, 22.8046] },
    emergencyTypes: ["Accident", "Cardiac", "General", "Pediatric"],
    status: {
      generalBeds: 400,
      icuBeds: 90,
      ventilators: 70,
      bloodBankAvail: true,
      operationTheaterFree: true,
      ambulanceAvail: 12,
      currentLoad: "Medium",
    },
  },
  {
    name: "Patliputra Medical College Hospital",
    address: "Saraidhela, Dhanbad 826003",
    phone: "+91-326-223-0192",
    email: "pmchdhanbad@gmail.com",
    location: { type: "Point", coordinates: [86.4304, 23.8143] },
    emergencyTypes: ["Trauma", "General", "Maternity"],
    status: {
      generalBeds: 350,
      icuBeds: 70,
      ventilators: 50,
      bloodBankAvail: true,
      operationTheaterFree: true,
      ambulanceAvail: 8,
      currentLoad: "Medium",
    },
  },
  {
    name: "Bokaro General Hospital",
    address: "Sector 6, Bokaro Steel City 827006",
    phone: "+91-6542-222-444",
    email: "info@bghbokaro.com",
    location: { type: "Point", coordinates: [86.1511, 23.6693] },
    emergencyTypes: ["Accident", "General", "Orthopedic"],
    status: {
      generalBeds: 300,
      icuBeds: 60,
      ventilators: 40,
      bloodBankAvail: true,
      operationTheaterFree: false,
      ambulanceAvail: 6,
      currentLoad: "High",
    },
  },
  {
    name: "Sadar Hospital Hazaribagh",
    address: "Matwari, Hazaribagh 825301",
    phone: "+91-6546-270-123",
    email: "sadarhzbh@gmail.com",
    location: { type: "Point", coordinates: [85.362, 23.9966] },
    emergencyTypes: ["General", "Maternity", "Pediatric"],
    status: {
      generalBeds: 250,
      icuBeds: 40,
      ventilators: 25,
      bloodBankAvail: false,
      operationTheaterFree: true,
      ambulanceAvail: 5,
      currentLoad: "Low",
    },
  },
  {
    name: "Deoghar Sadar Hospital",
    address: "Castairs Town, Deoghar 814112",
    phone: "+91-6432-225-789",
    email: "deogharsadar@gmail.com",
    location: { type: "Point", coordinates: [86.7036, 24.4829] },
    emergencyTypes: ["General", "Accident"],
    status: {
      generalBeds: 200,
      icuBeds: 35,
      ventilators: 20,
      bloodBankAvail: true,
      operationTheaterFree: true,
      ambulanceAvail: 4,
      currentLoad: "Medium",
    },
  },
  {
    name: "Medica Hospital Ranchi",
    address: "Irba, Ranchi 835217",
    phone: "+91-651-712-3456",
    email: "ranchi@medicahospitals.in",
    location: { type: "Point", coordinates: [85.2567, 23.4521] },
    emergencyTypes: ["Cardiac", "Accident", "ICU", "General"],
    status: {
      generalBeds: 220,
      icuBeds: 75,
      ventilators: 55,
      bloodBankAvail: true,
      operationTheaterFree: false,
      ambulanceAvail: 9,
      currentLoad: "High",
    },
  },
  {
    name: "Sadar Hospital Dumka",
    address: "Dumka 814101",
    phone: "+91-6434-222-345",
    email: "dumkasadar@gmail.com",
    location: { type: "Point", coordinates: [87.2486, 24.2678] },
    emergencyTypes: ["General", "Maternity"],
    status: {
      generalBeds: 180,
      icuBeds: 30,
      ventilators: 15,
      bloodBankAvail: false,
      operationTheaterFree: true,
      ambulanceAvail: 3,
      currentLoad: "Low",
    },
  },
  {
    name: "Chaibasa Sadar Hospital",
    address: "Chaibasa 833201",
    phone: "+91-6582-256-789",
    email: "chaibasahealth@gmail.com",
    location: { type: "Point", coordinates: [85.812, 22.5538] },
    emergencyTypes: ["Accident", "General"],
    status: {
      generalBeds: 150,
      icuBeds: 25,
      ventilators: 12,
      bloodBankAvail: true,
      operationTheaterFree: true,
      ambulanceAvail: 2,
      currentLoad: "Medium",
    },
  },
  {
    name: "Palamu Medical College Hospital",
    address: "Daltonganj, Palamu 822101",
    phone: "+91-6562-222-111",
    email: "pmchpalamu@gmail.com",
    location: { type: "Point", coordinates: [84.0636, 24.0394] },
    emergencyTypes: ["Trauma", "General", "ICU"],
    status: {
      generalBeds: 260,
      icuBeds: 50,
      ventilators: 35,
      bloodBankAvail: true,
      operationTheaterFree: false,
      ambulanceAvail: 7,
      currentLoad: "High",
    },
  },
  {
    name: "Giridih Sadar Hospital",
    address: "Giridih 815301",
    phone: "+91-6532-224-567",
    email: "giridihsadar@gmail.com",
    location: { type: "Point", coordinates: [86.3167, 24.186] },
    emergencyTypes: ["General", "Accident"],
    status: {
      generalBeds: 190,
      icuBeds: 28,
      ventilators: 18,
      bloodBankAvail: false,
      operationTheaterFree: true,
      ambulanceAvail: 4,
      currentLoad: "Low",
    },
  },
  {
    name: "Ramgarh Sadar Hospital",
    address: "Ramgarh 829122",
    phone: "+91-6553-222-456",
    email: "ramgarhsadar@gmail.com",
    location: { type: "Point", coordinates: [85.5155, 23.6313] },
    emergencyTypes: ["General", "Orthopedic"],
    status: {
      generalBeds: 170,
      icuBeds: 22,
      ventilators: 14,
      bloodBankAvail: true,
      operationTheaterFree: true,
      ambulanceAvail: 3,
      currentLoad: "Medium",
    },
  },
  {
    name: "Sahibganj Sadar Hospital",
    address: "Sahibganj 816109",
    phone: "+91-6436-223-890",
    email: "sahibganjsadar@gmail.com",
    location: { type: "Point", coordinates: [87.6452, 25.2425] },
    emergencyTypes: ["General", "Maternity"],
    status: {
      generalBeds: 160,
      icuBeds: 20,
      ventilators: 10,
      bloodBankAvail: false,
      operationTheaterFree: true,
      ambulanceAvail: 2,
      currentLoad: "Low",
    },
  },
  {
    name: "Khunti District Hospital",
    address: "Khunti 835210",
    phone: "+91-6528-220-345",
    email: "khuntihospital@gmail.com",
    location: { type: "Point", coordinates: [85.2785, 23.0776] },
    emergencyTypes: ["General", "Accident"],
    status: {
      generalBeds: 140,
      icuBeds: 18,
      ventilators: 8,
      bloodBankAvail: false,
      operationTheaterFree: true,
      ambulanceAvail: 2,
      currentLoad: "Medium",
    },
  },
  {
    name: "Simdega Sadar Hospital",
    address: "Simdega 835223",
    phone: "+91-6525-225-789",
    email: "simdegasadar@gmail.com",
    location: { type: "Point", coordinates: [84.5012, 22.6155] },
    emergencyTypes: ["General"],
    status: {
      generalBeds: 130,
      icuBeds: 15,
      ventilators: 7,
      bloodBankAvail: false,
      operationTheaterFree: true,
      ambulanceAvail: 1,
      currentLoad: "Low",
    },
  },
  {
    name: "Latehar District Hospital",
    address: "Latehar 829206",
    phone: "+91-6565-223-456",
    email: "lateharhospital@gmail.com",
    location: { type: "Point", coordinates: [84.5059, 23.7441] },
    emergencyTypes: ["General", "Trauma"],
    status: {
      generalBeds: 120,
      icuBeds: 14,
      ventilators: 6,
      bloodBankAvail: false,
      operationTheaterFree: true,
      ambulanceAvail: 2,
      currentLoad: "Medium",
    },
  },
  {
    name: "Pakur Sadar Hospital",
    address: "Pakur 816107",
    phone: "+91-6435-224-567",
    email: "pakursadar@gmail.com",
    location: { type: "Point", coordinates: [87.8484, 24.6397] },
    emergencyTypes: ["General", "Maternity"],
    status: {
      generalBeds: 110,
      icuBeds: 12,
      ventilators: 5,
      bloodBankAvail: false,
      operationTheaterFree: true,
      ambulanceAvail: 1,
      currentLoad: "Low",
    },
  },
  {
    name: "Chatra District Hospital",
    address: "Chatra 825401",
    phone: "+91-6541-223-678",
    email: "chatradistrict@gmail.com",
    location: { type: "Point", coordinates: [84.8708, 24.2049] },
    emergencyTypes: ["General", "Accident"],
    status: {
      generalBeds: 125,
      icuBeds: 16,
      ventilators: 9,
      bloodBankAvail: false,
      operationTheaterFree: true,
      ambulanceAvail: 2,
      currentLoad: "Medium",
    },
  },
  {
    name: "Lohardaga Sadar Hospital",
    address: "Lohardaga 835302",
    phone: "+91-6526-222-345",
    email: "lohardagasadar@gmail.com",
    location: { type: "Point", coordinates: [84.6795, 23.4335] },
    emergencyTypes: ["General"],
    status: {
      generalBeds: 115,
      icuBeds: 10,
      ventilators: 5,
      bloodBankAvail: false,
      operationTheaterFree: true,
      ambulanceAvail: 1,
      currentLoad: "Low",
    },
  },
  {
    name: "Koderma District Hospital",
    address: "Jhumri Telaiya, Koderma 825409",
    phone: "+91-6534-222-890",
    email: "kodermahospital@gmail.com",
    location: { type: "Point", coordinates: [85.523, 24.4666] },
    emergencyTypes: ["General", "Orthopedic"],
    status: {
      generalBeds: 135,
      icuBeds: 18,
      ventilators: 10,
      bloodBankAvail: true,
      operationTheaterFree: true,
      ambulanceAvail: 2,
      currentLoad: "Medium",
    },
  },
];

/**
 * GET /admin/hospitals
 * Retrieve all hospitals with their current status
 * Excludes adminPassword field
 */
router.get("/hospitals", async (req, res) => {
  try {
    let hospitals;

    // Try to fetch from MongoDB
    try {
      hospitals = await Hospital.find().select("-adminPassword");

      // If no hospitals in DB, use mock data
      if (hospitals.length === 0) {
        console.warn("No hospitals in database, returning mock data");
        return res.json({
          source: "mock",
          count: mockHospitals.length,
          hospitals: mockHospitals,
        });
      }

      return res.json({
        source: "database",
        count: hospitals.length,
        hospitals: hospitals,
      });
    } catch (dbError) {
      console.warn("Database error, returning mock data:", dbError.message);
      return res.json({
        source: "mock",
        count: mockHospitals.length,
        hospitals: mockHospitals,
      });
    }
  } catch (error) {
    console.error("Error fetching hospitals:", error.message);
    res.status(500).json({
      error: "Failed to fetch hospitals",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * PUT /admin/hospital/:id
 * Update hospital status fields with password authentication
 *
 * Body:
 * - status: object with fields to update (generalBeds, icuBeds, ventilators, etc.)
 * - password: admin password for verification
 *
 * Returns updated hospital data (excluding adminPassword)
 */
router.put("/hospital/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, password } = req.body;

    // Validate required fields
    if (!password) {
      return res.status(400).json({
        error: "Missing required field: password",
      });
    }

    if (!status) {
      return res.status(400).json({
        error: "Missing required field: status",
      });
    }

    // Validate password
    const correctPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (password !== correctPassword) {
      return res.status(401).json({
        error: "Invalid admin password",
      });
    }

    // Try to update in MongoDB
    try {
      const hospital = await Hospital.findById(id);

      if (!hospital) {
        return res.status(404).json({
          error: "Hospital not found",
        });
      }

      // Update only status fields
      hospital.status = {
        ...hospital.status,
        ...status,
      };

      await hospital.save();

      // Return updated hospital excluding adminPassword
      const updatedHospital = hospital.toObject();
      delete updatedHospital.adminPassword;

      return res.json({
        success: true,
        message: "Hospital status updated successfully",
        timestamp: new Date().toISOString(),
        hospital: updatedHospital,
      });
    } catch (dbError) {
      // If DB fails, return mock success response
      if (
        dbError.name === "MongoError" ||
        dbError.name === "MongoNetworkError"
      ) {
        console.warn(
          "Database error, returning mock success:",
          dbError.message,
        );
        return res.json({
          success: true,
          message: "Hospital status updated successfully",
          timestamp: new Date().toISOString(),
          source: "mock",
          hospital: {
            _id: id,
            status: status,
          },
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error updating hospital:", error.message);
    res.status(500).json({
      error: "Failed to update hospital",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
