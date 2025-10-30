// Database seed script for demo user and sample data
import { db } from "./db";
import { users, entries, preferences } from "@shared/schema";
import { DEMO_USER_ID, DEMO_USER_EMAIL } from "./middleware/auth";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create demo user
    const [demoUser] = await db
      .insert(users)
      .values({
        id: DEMO_USER_ID,
        email: DEMO_USER_EMAIL,
        name: "Demo User",
        image: null,
      })
      .onConflictDoNothing()
      .returning();

    console.log("✅ Demo user created:", demoUser?.email || "already exists");

    // Create demo preferences
    await db
      .insert(preferences)
      .values({
        userId: DEMO_USER_ID,
        bankProvider: "manual",
        fromAccountLabel: "Checking (****1234)",
        toAccountLabel: "Savings (****5678)",
        monthlyGoal: "500.00",
        yearlyGoal: "6000.00",
      })
      .onConflictDoNothing();

    console.log("✅ Demo preferences created");

    // Create sample entries (last 30 days)
    const sampleEntries = [
      { item: "Morning coffee", amount: "5.50", category: "Coffee & Tea", days: 1 },
      { item: "Lunch out", amount: "15.00", category: "Food & Dining", days: 1 },
      { item: "Movie ticket", amount: "14.00", category: "Entertainment", days: 2 },
      { item: "Coffee", amount: "5.50", category: "Coffee & Tea", days: 3 },
      { item: "Impulse book purchase", amount: "22.00", category: "Shopping", days: 4 },
      { item: "Coffee", amount: "5.50", category: "Coffee & Tea", days: 5 },
      { item: "Takeout dinner", amount: "28.00", category: "Food & Dining", days: 5 },
      { item: "Ride share", amount: "12.00", category: "Transportation", days: 6 },
      { item: "Snacks", amount: "8.50", category: "Shopping", days: 7 },
      { item: "Coffee", amount: "5.50", category: "Coffee & Tea", days: 8 },
      { item: "Chocolate bar", amount: "3.50", category: "Food & Dining", days: 9 },
      { item: "Magazine subscription", amount: "9.99", category: "Subscriptions", days: 10 },
      { item: "Coffee", amount: "5.50", category: "Coffee & Tea", days: 11 },
      { item: "Fast food", amount: "11.00", category: "Food & Dining", days: 12 },
      { item: "Coffee", amount: "5.50", category: "Coffee & Tea", days: 14 },
      { item: "Concert ticket", amount: "45.00", category: "Entertainment", days: 15 },
      { item: "Coffee", amount: "5.50", category: "Coffee & Tea", days: 16 },
      { item: "Clothing item", amount: "35.00", category: "Shopping", days: 18 },
      { item: "Coffee", amount: "5.50", category: "Coffee & Tea", days: 19 },
      { item: "Pizza delivery", amount: "22.00", category: "Food & Dining", days: 20 },
    ];

    const today = new Date();
    
    for (const entry of sampleEntries) {
      const entryDate = new Date(today);
      entryDate.setDate(entryDate.getDate() - entry.days);

      await db.insert(entries).values({
        userId: DEMO_USER_ID,
        item: entry.item,
        amount: entry.amount,
        category: entry.category,
        date: entryDate,
        note: null,
      }).onConflictDoNothing();
    }

    console.log("✅ Sample entries created");
    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

export { seed };

// Run seed
seed()
  .then(() => {
    console.log("Seed completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
