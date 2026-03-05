import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TARGET_COUNT = 10;

const bengaluruLocations = [
    { name: "Koramangala", lat: 12.9352, lng: 77.6245 },
    { name: "Indiranagar", lat: 12.9784, lng: 77.6408 },
    { name: "Jayanagar", lat: 12.9308, lng: 77.5838 },
    { name: "Whitefield", lat: 12.9698, lng: 77.7500 },
    { name: "HSR Layout", lat: 12.9116, lng: 77.6474 },
    { name: "BTM Layout", lat: 12.9166, lng: 77.6101 },
    { name: "Marathahalli", lat: 12.9591, lng: 77.6974 },
    { name: "Rajajinagar", lat: 12.9900, lng: 77.5523 },
    { name: "Malleshwaram", lat: 13.0035, lng: 77.5685 },
    { name: "JP Nagar", lat: 12.9063, lng: 77.5857 },
];

const departmentByCategory = {
    POTHOLE: "Roads",
    GARBAGE: "Sanitation",
    STREETLIGHT: "Electrical",
    WATER_LEAK: "Water Works",
    OTHER: "Public Works",
    BRIBERY: "Vigilance",
};

const issueSeeds = [
    {
        title: "Massive pothole on 100 Feet Road",
        description: "A huge crater has formed near the junction. Two-wheelers are struggling to navigate safely, especially at night.",
        category: "POTHOLE",
        area: "Indiranagar",
        imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
        daysAgo: 2,
        intensity: 7,
    },
    {
        title: "Garbage overflow near BDA Complex",
        description: "The main garbage bins haven't been cleared for a week. The waste is spilling onto the footpath causing a severe stench.",
        category: "GARBAGE",
        area: "Koramangala",
        imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=800",
        daysAgo: 5,
        intensity: 6,
    },
    {
        title: "Broken streetlight in 4th Block",
        description: "Entire stretch of the road is pitch dark. This is a severe safety hazard for pedestrians walking home.",
        category: "STREETLIGHT",
        area: "Jayanagar",
        imageUrl: "https://images.unsplash.com/photo-1519782431690-3ce47dd7e2a9?auto=format&fit=crop&q=80&w=800",
        daysAgo: 1,
        intensity: 8,
    },
    {
        title: "Major pipe burst flooding the road",
        description: "Underground BWSSB water pipe has burst. Thousands of liters of clean water are being wasted and flooding the intersection.",
        category: "WATER_LEAK",
        area: "Whitefield",
        imageUrl: "https://images.unsplash.com/photo-1549428581-22e6b01b3334?auto=format&fit=crop&q=80&w=800",
        daysAgo: 12,
        intensity: 9,
    },
    {
        title: "Broken footpath tiles",
        description: "Pedestrian walkway tiles are completely shattered here making it impossible for senior citizens to walk.",
        category: "OTHER",
        area: "Malleshwaram",
        imageUrl: "https://images.unsplash.com/photo-1495556650867-99590cea3657?auto=format&fit=crop&q=80&w=800",
        daysAgo: 20,
        intensity: 5,
    },
    {
        title: "Construction debris dumped on road",
        description: "A local contractor dumped a truckload of cement rubble and sand right on the side of the main road.",
        category: "GARBAGE",
        area: "HSR Layout",
        imageUrl: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&q=80&w=800",
        daysAgo: 3,
        intensity: 6,
    },
    {
        title: "Deep pothole hidden by rainwater",
        description: "This pothole gets filled with rain and becomes completely invisible. Several accidents have happened already.",
        category: "POTHOLE",
        area: "BTM Layout",
        imageUrl: "https://images.unsplash.com/photo-1584985250393-eece88771190?auto=format&fit=crop&q=80&w=800",
        daysAgo: 1,
        intensity: 7,
    },
    {
        title: "Continuous sewage leak",
        description: "Foul-smelling sewage water has been flowing onto the street for three days straight. Urgent health risk.",
        category: "WATER_LEAK",
        area: "Marathahalli",
        imageUrl: "https://images.unsplash.com/photo-1505295713488-886d9070868f?auto=format&fit=crop&q=80&w=800",
        daysAgo: 4,
        intensity: 8,
    },
    {
        title: "Flickering street lamps",
        description: "Three adjacent street lamps keep flickering on and off all night like a strobe light.",
        category: "STREETLIGHT",
        area: "Rajajinagar",
        imageUrl: "https://images.unsplash.com/photo-1494247551939-2eeb2ff8eb7a?auto=format&fit=crop&q=80&w=800",
        daysAgo: 15,
        intensity: 6,
    },
    {
        title: "Fallen tree blocking the cross road",
        description: "A large branch snapped during last night's storm and is blocking one lane completely.",
        category: "OTHER",
        area: "JP Nagar",
        imageUrl: "https://images.unsplash.com/photo-1518731112461-8207198a28f8?auto=format&fit=crop&q=80&w=800",
        daysAgo: 0,
        intensity: 6,
    },
];

const officerData = [
    { name: "Priya Sharma", area: "Koramangala" },
    { name: "Suresh Gowda", area: "Indiranagar" },
    { name: "Lakshmi Devi", area: "Jayanagar" },
    { name: "Anil Reddy", area: "Whitefield" },
];

const citizenData = [
    { name: "Aarav Patel" },
    { name: "Nisha Rao" },
    { name: "Vikram Singh" },
    { name: "Divya Menon" },
    { name: "Arjun Shetty" },
];

const commentMessages = [
    "Pothole is dangerously deep here. Please fix soon.",
    "Garbage is overflowing and attracting stray dogs.",
    "The streetlight is out and the lane is unsafe at night.",
    "Water leak is wasting a lot of water daily.",
    "Footpath is broken and elderly residents are struggling.",
    "Debris is blocking half the road. Needs clearing.",
    "Pothole fills with rainwater and causes skids.",
    "Sewage smell is unbearable in this stretch.",
    "Street lamps flicker all night; very unsafe.",
    "Fallen tree is causing a traffic bottleneck.",
];

const ratingFeedbacks = [
    "Quick resolution, thank you!",
    "Resolved well, appreciate the update.",
    "Good job, but please keep us posted next time.",
    "Satisfactory handling.",
    "Excellent service!",
    null,
];

const ratingScores = [5, 4, 4, 3, 5, 4, 3, 5, 4, 5];

function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomFloat(min, max) {
    return min + Math.random() * (max - min);
}

function randomDate(daysBack) {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
    d.setHours(Math.floor(Math.random() * 14) + 6); // 6am - 8pm
    d.setMinutes(Math.floor(Math.random() * 60));
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
}

function dateFromDaysAgo(daysAgo, index) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(8 + (index % 10));
    d.setMinutes((index * 7) % 60);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
}

async function main() {
    console.log("🌱 Starting seed...\n");

    // Clean existing data
    await prisma.notification.deleteMany();
    await prisma.rating.deleteMany();
    await prisma.vote.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.issue.deleteMany();
    await prisma.user.deleteMany();
    console.log("✅ Cleaned existing data\n");

    // — Create Users —
    const president = await prisma.user.create({
        data: {
            clerkId: "seed_president_001",
            name: "Ramesh Kumar",
            email: "ramesh.kumar@bbmp.gov.in",
            role: "PRESIDENT",
            area: "Bengaluru Central",
            avgRating: 0,
            resolvedCount: 0,
            assignedCount: 0,
        },
    });
    console.log(`👑 President: ${president.name}`);

    const officers = [];
    for (const od of officerData) {
        const slug = od.name.toLowerCase().replace(/\s+/g, ".");
        const officer = await prisma.user.create({
            data: {
                clerkId: `seed_officer_${slug.replace(/\./g, "_")}`,
                name: od.name,
                email: `${slug}@bbmp.gov.in`,
                role: "OFFICER",
                area: od.area,
                avgRating: 0,
                resolvedCount: 0,
                assignedCount: 0,
            },
        });
        officers.push(officer);
        console.log(`🛡️  Officer: ${officer.name} (${od.area})`);
    }

    const citizens = [];
    for (const cd of citizenData) {
        const slug = cd.name.toLowerCase().replace(/\s+/g, ".");
        const citizen = await prisma.user.create({
            data: {
                clerkId: `seed_citizen_${slug.replace(/\./g, "_")}`,
                name: cd.name,
                email: `${slug}@gmail.com`,
                role: "CITIZEN",
            },
        });
        citizens.push(citizen);
    }
    console.log(`👥 Created ${citizens.length} citizens\n`);

    // — Create Issues (Exactly 10 with images) —
    const issues = [];
    for (let i = 0; i < issueSeeds.length; i++) {
        const item = issueSeeds[i];
        const locationDef = bengaluruLocations.find((l) => l.name === item.area) || bengaluruLocations[0];
        const citizen = citizens[i % citizens.length];
        const officer = officers.find((o) => o.area === item.area) || officers[i % officers.length];

        const createdAt = dateFromDaysAgo(item.daysAgo, i);
        const lat = locationDef.lat + randomFloat(-0.003, 0.003);
        const lng = locationDef.lng + randomFloat(-0.003, 0.003);

        const issue = await prisma.issue.create({
            data: {
                title: item.title,
                description: item.description,
                category: item.category,
                status: "RESOLVED",
                city: "Bengaluru",
                area: item.area,
                latitude: lat,
                longitude: lng,
                imageUrl: item.imageUrl,
                department: departmentByCategory[item.category],
                intensity: item.intensity,
                createdById: citizen.id,
                createdAt,
                assignedToId: officer.id,
                resolvedById: officer.id,
                votes: 0,
            },
        });
        issues.push(issue);
    }
    console.log(`📋 Created exactly ${issues.length} issues with image URLs\n`);

    // — Create Comments (Exactly 10) —
    let commentCount = 0;
    for (let i = 0; i < TARGET_COUNT; i++) {
        const issue = issues[i % issues.length];
        const commenter = i % 3 === 0 ? randomPick(officers) : citizens[i % citizens.length];
        await prisma.comment.create({
            data: {
                comment: commentMessages[i % commentMessages.length],
                issueId: issue.id,
                userId: commenter.id,
                createdAt: randomDate(30),
            },
        });
        commentCount++;
    }
    console.log(`💬 Created ${commentCount} comments`);

    // — Create Votes (Exactly 10) —
    let voteCount = 0;
    const voteCountsByIssue = new Map();
    for (let i = 0; i < issues.length; i++) {
        const issue = issues[i];
        const voter = citizens[i % citizens.length];
        await prisma.vote.create({
            data: { issueId: issue.id, userId: voter.id },
        });
        voteCount++;
        voteCountsByIssue.set(issue.id, (voteCountsByIssue.get(issue.id) || 0) + 1);
    }
    for (const issue of issues) {
        await prisma.issue.update({
            where: { id: issue.id },
            data: { votes: voteCountsByIssue.get(issue.id) || 0 },
        });
    }
    console.log(`👍 Created ${voteCount} votes`);

    // — Create Ratings (Exactly 10) —
    let ratingCount = 0;
    for (let i = 0; i < issues.length; i++) {
        const issue = issues[i];
        const officerId = issue.resolvedById || issue.assignedToId;
        if (!officerId) continue;

        await prisma.rating.create({
            data: {
                score: ratingScores[i % ratingScores.length],
                feedback: ratingFeedbacks[i % ratingFeedbacks.length],
                issueId: issue.id,
                givenById: issue.createdById,
                officerId,
                createdAt: randomDate(30),
            },
        });
        ratingCount++;
    }
    console.log(`⭐ Created ${ratingCount} ratings`);

    // — Create Notifications (Exactly 10) —
    let notificationCount = 0;
    const recipients = [president, ...officers];
    for (let i = 0; i < TARGET_COUNT; i++) {
        const issue = issues[i % issues.length];
        const recipient = recipients[i % recipients.length];
        const severityLabel = issue.intensity >= 8 ? "High intensity" : "New";
        await prisma.notification.create({
            data: {
                message: `${severityLabel} issue in ${issue.area}: ${issue.title}`,
                isRead: i % 3 === 0,
                userId: recipient.id,
                issueId: issue.id,
                createdAt: randomDate(10),
            },
        });
        notificationCount++;
    }
    console.log(`🔔 Created ${notificationCount} notifications`);

    // — Update Officer Stats —
    const assignedCountByOfficer = new Map();
    const resolvedCountByOfficer = new Map();
    for (const issue of issues) {
        if (issue.assignedToId) {
            assignedCountByOfficer.set(
                issue.assignedToId,
                (assignedCountByOfficer.get(issue.assignedToId) || 0) + 1
            );
        }
        if (issue.resolvedById) {
            resolvedCountByOfficer.set(
                issue.resolvedById,
                (resolvedCountByOfficer.get(issue.resolvedById) || 0) + 1
            );
        }
    }

    const ratingTargets = [president, ...officers];
    for (const target of ratingTargets) {
        const ratingAgg = await prisma.rating.aggregate({
            where: { officerId: target.id },
            _avg: { score: true },
        });

        await prisma.user.update({
            where: { id: target.id },
            data: {
                assignedCount: assignedCountByOfficer.get(target.id) || 0,
                resolvedCount: resolvedCountByOfficer.get(target.id) || 0,
                avgRating: ratingAgg._avg.score || 0,
            },
        });
    }

    console.log("\n🎉 Seed complete!");
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
