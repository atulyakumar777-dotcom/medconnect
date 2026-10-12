import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.appointment.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await hash("admin123", 12);
  const doctorPassword = await hash("doctor123", 12);
  const patientPassword = await hash("patient123", 12);

  // Create admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@medconnect.com",
      password: hashedPassword,
      role: "ADMIN",
      phone: "+91 9876543210",
    },
  });

  // Create 12 doctors across different specialties
  // Use Indian doctor names and realistic medical data
  const doctorsData = [
    { name: "Dr. Rajesh Sharma", email: "dr.sharma@medconnect.com", specialty: "General Physician", degree: "MBBS, MD", experience: 15, fees: 500, about: "Experienced general physician with expertise in preventive medicine and chronic disease management." },
    { name: "Dr. Priya Patel", email: "dr.patel@medconnect.com", specialty: "Cardiologist", degree: "MBBS, DM Cardiology", experience: 12, fees: 1200, about: "Specialist in interventional cardiology with expertise in heart disease prevention and treatment." },
    { name: "Dr. Amit Kumar", email: "dr.kumar@medconnect.com", specialty: "Dermatologist", degree: "MBBS, MD Dermatology", experience: 8, fees: 800, about: "Expert in treating skin conditions, cosmetic dermatology, and laser treatments." },
    { name: "Dr. Sneha Reddy", email: "dr.reddy@medconnect.com", specialty: "Pediatrician", degree: "MBBS, MD Pediatrics", experience: 10, fees: 600, about: "Compassionate pediatrician focused on child health, vaccinations, and developmental care." },
    { name: "Dr. Vikram Singh", email: "dr.singh@medconnect.com", specialty: "Neurologist", degree: "MBBS, DM Neurology", experience: 18, fees: 1500, about: "Leading neurologist specializing in stroke treatment, epilepsy, and neurodegenerative disorders." },
    { name: "Dr. Ananya Gupta", email: "dr.gupta@medconnect.com", specialty: "Orthopedic", degree: "MBBS, MS Orthopedics", experience: 14, fees: 1000, about: "Orthopedic surgeon specializing in joint replacements, sports injuries, and spine surgery." },
    { name: "Dr. Kavita Nair", email: "dr.nair@medconnect.com", specialty: "Gynecologist", degree: "MBBS, MS OB-GYN", experience: 16, fees: 900, about: "Women's health specialist with expertise in high-risk pregnancies and reproductive medicine." },
    { name: "Dr. Arjun Mehta", email: "dr.mehta@medconnect.com", specialty: "ENT Specialist", degree: "MBBS, MS ENT", experience: 9, fees: 700, about: "ENT surgeon skilled in endoscopic sinus surgery, hearing disorders, and voice problems." },
    { name: "Dr. Deepa Joshi", email: "dr.joshi@medconnect.com", specialty: "Ophthalmologist", degree: "MBBS, MS Ophthalmology", experience: 11, fees: 800, about: "Eye care specialist experienced in cataract surgery, LASIK, and retinal disorders." },
    { name: "Dr. Suresh Iyer", email: "dr.iyer@medconnect.com", specialty: "Psychiatrist", degree: "MBBS, MD Psychiatry", experience: 13, fees: 1100, about: "Mental health expert specializing in anxiety, depression, and behavioral therapy." },
    { name: "Dr. Meera Agarwal", email: "dr.agarwal@medconnect.com", specialty: "General Physician", degree: "MBBS, DNB", experience: 7, fees: 400, about: "Dedicated general physician with focus on family medicine and lifestyle diseases." },
    { name: "Dr. Rohit Chauhan", email: "dr.chauhan@medconnect.com", specialty: "Cardiologist", degree: "MBBS, MD, DM", experience: 20, fees: 1800, about: "Senior cardiologist with two decades of experience in cardiac surgery and critical care." },
  ];

  const workingDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const doctors = [];

  for (const doc of doctorsData) {
    const user = await prisma.user.create({
      data: {
        name: doc.name,
        email: doc.email,
        password: doctorPassword,
        role: "DOCTOR",
        phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      },
    });

    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        specialty: doc.specialty,
        degree: doc.degree,
        experience: doc.experience,
        fees: doc.fees,
        about: doc.about,
        available: true,
        addressLine: "Medical Complex, Sector 18, New Delhi",
      },
    });

    // Create time slots for each working day (9 AM to 5 PM, 30-min slots)
    for (const day of workingDays) {
      let hour = 9;
      while (hour < 17) {
        const startH = hour.toString().padStart(2, "0");
        const startM = "00";
        const endM = "30";
        
        await prisma.slot.create({
          data: {
            doctorId: doctor.id,
            day,
            startTime: `${startH}:${startM}`,
            endTime: `${startH}:${endM}`,
          },
        });

        await prisma.slot.create({
          data: {
            doctorId: doctor.id,
            day,
            startTime: `${startH}:${endM}`,
            endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
          },
        });

        hour++;
      }
    }

    doctors.push(doctor);
  }

  // Create 10 patients
  const patientNames = [
    "Rahul Verma", "Sita Devi", "Arun Prasad", "Pooja Mishra", "Karan Malhotra",
    "Neha Saxena", "Vivek Tiwari", "Ritu Kapoor", "Manish Yadav", "Divya Sharma"
  ];

  const patients = [];
  for (let i = 0; i < patientNames.length; i++) {
    const patient = await prisma.user.create({
      data: {
        name: patientNames[i],
        email: i === 0 ? "patient@medconnect.com" : `patient${i + 1}@medconnect.com`,
        password: patientPassword,
        role: "PATIENT",
        phone: `+91 97${Math.floor(10000000 + Math.random() * 90000000)}`,
        gender: i % 2 === 0 ? "Male" : "Female",
        dob: `19${85 + i}-0${(i % 9) + 1}-${10 + i}`,
        address: "New Delhi, India",
      },
    });
    patients.push(patient);
  }

  // Create sample appointments
  const statuses = ["COMPLETED", "CONFIRMED", "PENDING", "CANCELLED"];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const patient = patients[i % patients.length];
    const doctor = doctors[i % doctors.length];
    const daysOffset = i < 10 ? -(i + 1) : i - 10; // past and future appointments
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() + daysOffset);
    const dateStr = appointmentDate.toISOString().split("T")[0];
    const hours = 9 + (i % 8);
    const timeStr = `${hours.toString().padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`;
    const status = i < 10 ? statuses[i % 4] : (i < 20 ? "CONFIRMED" : "PENDING");

    await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        slotDate: dateStr,
        slotTime: timeStr,
        status,
        paymentMethod: i % 3 === 0 ? "ONLINE" : "CASH",
        paymentStatus: status === "COMPLETED" || (i % 3 === 0) ? "PAID" : "PENDING",
        amount: doctor.fees,
      },
    });
  }

  console.log("✅ Seed data created successfully!");
  console.log(`   - 1 Admin`);
  console.log(`   - ${doctorsData.length} Doctors`);
  console.log(`   - ${patientNames.length} Patients`);
  console.log(`   - 30 Appointments`);
  console.log("");
  console.log("Demo Accounts:");
  console.log("  Admin:   admin@medconnect.com / admin123");
  console.log("  Doctor:  dr.sharma@medconnect.com / doctor123");
  console.log("  Patient: patient@medconnect.com / patient123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
