import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    // ————— POTHOLE (4) —————
    {
        title: "Massive pothole on 100 Feet Road",
        description: "A huge crater has formed near the junction. Two-wheelers are struggling to navigate safely, especially at night. Several accidents have been narrowly avoided.",
        category: "POTHOLE",
        area: "Indiranagar",
        status: "RESOLVED",
        imageUrl: "https://picsum.photos/seed/pothole1/800/600",
        daysAgo: 14,
        intensity: 8,
    },
    {
        title: "Deep pothole hidden by rainwater",
        description: "This pothole gets filled with rain and becomes completely invisible. Several two-wheelers have skidded here today.",
        category: "POTHOLE",
        area: "BTM Layout",
        status: "REPORTED",
        imageUrl: "https://picsum.photos/seed/pothole2/800/600",
        daysAgo: 0,
        intensity: 7,
    },
    {
        title: "Series of potholes near metro pillar 45",
        description: "The road surface has completely eroded near the pillar. Traffic slows to a crawl creating a massive bottleneck during peak hours.",
        category: "POTHOLE",
        area: "Jayanagar",
        status: "IN_PROGRESS",
        imageUrl: "https://picsum.photos/seed/pothole3/800/600",
        daysAgo: 3,
        intensity: 8,
    },
    {
        title: "Pothole cluster near school zone",
        description: "Multiple potholes have formed on the road outside the government school. Buses are swerving to avoid them, creating a dangerous situation for children.",
        category: "POTHOLE",
        area: "Malleshwaram",
        status: "REPORTED",
        imageUrl: "https://picsum.photos/seed/pothole4/800/600",
        daysAgo: 2,
        intensity: 9,
    },
    // ————— GARBAGE (4) —————
    {
        title: "Garbage overflow near BDA Complex",
        description: "The main garbage bins haven't been cleared for a week. The waste is spilling onto the footpath causing a severe stench and attracting stray animals.",
        category: "GARBAGE",
        area: "Koramangala",
        status: "IN_PROGRESS",
        imageUrl: "https://picsum.photos/seed/garbage1/800/600",
        daysAgo: 5,
        intensity: 6,
    },
    {
        title: "Construction debris dumped on road",
        description: "A local contractor dumped a truckload of cement rubble and sand right on the side of the main road, completely blocking the left lane.",
        category: "GARBAGE",
        area: "HSR Layout",
        status: "RESOLVED",
        imageUrl: "https://picsum.photos/seed/garbage2/800/600",
        daysAgo: 20,
        intensity: 6,
    },
    {
        title: "Illegal garbage dumping yard",
        description: "An empty lot has been turned into an illegal dumping ground by commercial trucks in the middle of the night.",
        category: "GARBAGE",
        area: "Whitefield",
        status: "REPORTED",
        imageUrl: "https://picsum.photos/seed/garbage3/800/600",
        daysAgo: 1,
        intensity: 7,
    },
    {
        title: "Overflowing bins near market entrance",
        description: "The waste collection bins near the vegetable market have not been emptied for days. Garbage is scattered across the road and footpath.",
        category: "GARBAGE",
        area: "Rajajinagar",
        status: "IN_PROGRESS",
        imageUrl: "https://picsum.photos/seed/garbage4/800/600",
        daysAgo: 3,
        intensity: 5,
    },
    // ————— STREETLIGHT (4) —————
    {
        title: "Broken streetlight in 4th Block",
        description: "Entire stretch of the road is pitch dark. This is a severe safety hazard for pedestrians walking home from the metro station.",
        category: "STREETLIGHT",
        area: "Jayanagar",
        status: "REPORTED",
        imageUrl: "https://picsum.photos/seed/light1/800/600",
        daysAgo: 1,
        intensity: 8,
    },
    {
        title: "Flickering street lamps on main avenue",
        description: "Three adjacent street lamps keep flickering on and off all night like a strobe light, causing severe distraction to drivers.",
        category: "STREETLIGHT",
        area: "Rajajinagar",
        status: "RESOLVED",
        imageUrl: "https://picsum.photos/seed/light2/800/600",
        daysAgo: 25,
        intensity: 5,
    },
    {
        title: "Entire lane without streetlights",
        description: "All the streetlights on 2nd cross have been non-functional for over a month. Women and elderly residents feel unsafe walking after dark.",
        category: "STREETLIGHT",
        area: "Koramangala",
        status: "IN_PROGRESS",
        imageUrl: "https://picsum.photos/seed/light3/800/600",
        daysAgo: 8,
        intensity: 9,
    },
    {
        title: "Damaged lamppost leaning dangerously",
        description: "An electric pole with a streetlight was hit by a truck and is now leaning at a 45-degree angle. Exposed wires are a major electrocution risk.",
        category: "STREETLIGHT",
        area: "Marathahalli",
        status: "REPORTED",
        imageUrl: "https://picsum.photos/seed/light4/800/600",
        daysAgo: 0,
        intensity: 10,
    },
    // ————— WATER_LEAK (4) —————
    {
        title: "Major pipe burst flooding the road",
        description: "Underground BWSSB water pipe has burst. Thousands of liters of clean water are being wasted and flooding the intersection, causing major traffic jams.",
        category: "WATER_LEAK",
        area: "Whitefield",
        status: "RESOLVED",
        imageUrl: "https://picsum.photos/seed/water1/800/600",
        daysAgo: 12,
        intensity: 9,
    },
    {
        title: "Continuous sewage leak into residential area",
        description: "Foul-smelling raw sewage water has been flowing onto the street for three days straight. Urgent health risk for children playing nearby.",
        category: "WATER_LEAK",
        area: "JP Nagar",
        status: "IN_PROGRESS",
        imageUrl: "https://picsum.photos/seed/water2/800/600",
        daysAgo: 4,
        intensity: 10,
    },
    {
        title: "Leaking fire hydrant on service road",
        description: "A fire hydrant near the bus stop has been leaking for two weeks. Sidewalk is constantly waterlogged and slippery.",
        category: "WATER_LEAK",
        area: "Indiranagar",
        status: "REPORTED",
        imageUrl: "https://picsum.photos/seed/water3/800/600",
        daysAgo: 6,
        intensity: 5,
    },
    {
        title: "Water main crack causing road erosion",
        description: "A slow but persistent water leak under the main road is eroding the surface, creating sinkholes. Already one bike fell into a formed cavity.",
        category: "WATER_LEAK",
        area: "BTM Layout",
        status: "RESOLVED",
        imageUrl: "https://picsum.photos/seed/water4/800/600",
        daysAgo: 18,
        intensity: 8,
    },
    // ————— OTHER (4) —————
    {
        title: "Fallen tree blocking the cross road",
        description: "A large branch snapped during last night's storm and is blocking one lane completely. Traffic is backing up.",
        category: "OTHER",
        area: "Malleshwaram",
        status: "REPORTED",
        imageUrl: "https://picsum.photos/seed/other1/800/600",
        daysAgo: 1,
        intensity: 7,
    },
    {
        title: "Missing manhole cover near bus stop",
        description: "The manhole cover has been missing for a week. Already one elderly person tripped and fell. Extremely dangerous at night.",
        category: "OTHER",
        area: "HSR Layout",
        status: "IN_PROGRESS",
        imageUrl: "https://picsum.photos/seed/other2/800/600",
        daysAgo: 5,
        intensity: 10,
    },
    {
        title: "Broken park bench and damaged fence",
        description: "The children's park in the neighborhood has a broken bench with exposed nails and a fence that's been knocked down.",
        category: "OTHER",
        area: "JP Nagar",
        status: "RESOLVED",
        imageUrl: "https://picsum.photos/seed/other3/800/600",
        daysAgo: 15,
        intensity: 4,
    },
    {
        title: "Stray animal menace near apartment complex",
        description: "A pack of aggressive stray dogs has been roaming near the complex. They've chased children multiple times and bitten one delivery person.",
        category: "OTHER",
        area: "Marathahalli",
        status: "REPORTED",
        imageUrl: "https://picsum.photos/seed/other4/800/600",
        daysAgo: 2,
        intensity: 7,
    },
];

const officerData = [
    { name: "Priya Sharma", area: "Koramangala" },
    { name: "Suresh Gowda", area: "Indiranagar" },
    { name: "Lakshmi Devi", area: "Jayanagar" },
    { name: "Anil Reddy", area: "Whitefield" },
    { name: "Vikram Bhat", area: "Marathahalli" },
    { name: "Deepak Kumar", area: "HSR Layout" },
    { name: "Ayesha Khan", area: "BTM Layout" },
    { name: "Rahul Singh", area: "Rajajinagar" },
    { name: "Sneha Nair", area: "Malleshwaram" },
    { name: "Amit Desai", area: "JP Nagar" },
];

const citizenData = [
    { name: "Aarav Patel" },
    { name: "Nisha Rao" },
    { name: "Arjun Shetty" },
    { name: "Divya Menon" },
    { name: "Kiran Kumar" },
    { name: "Meera Reddy" },
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
    "This officer always asks for bribes, action is needed.",
    "I've also experienced this, it's terrible.",
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
    console.log("🌱 Starting realistic seed...\n");

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

    // — Create Issues —
    const issues = [];
    for (let i = 0; i < issueSeeds.length; i++) {
        const item = issueSeeds[i];
        const locationDef = bengaluruLocations.find((l) => l.name === item.area) || bengaluruLocations[0];
        const citizen = citizens[i % citizens.length];
        const officer = officers.find((o) => o.area === item.area) || randomPick(officers);

        const createdAt = dateFromDaysAgo(item.daysAgo, i);
        const lat = locationDef.lat + randomFloat(-0.003, 0.003);
        const lng = locationDef.lng + randomFloat(-0.003, 0.003);

        const resolved = item.status === "RESOLVED";
        const in_progress = item.status === "IN_PROGRESS";

        // Bribery issues go to president if no area or if severe, let's keep assignment realistic
        const assignedOfficerId = item.category === "BRIBERY" && item.intensity >= 9 ? president.id : officer.id;

        const issue = await prisma.issue.create({
            data: {
                title: item.title,
                description: item.description,
                category: item.category,
                status: item.status,
                city: "Bengaluru",
                area: item.area,
                latitude: lat,
                longitude: lng,
                imageUrl: item.imageUrl,
                department: departmentByCategory[item.category],
                intensity: item.intensity,
                createdById: citizen.id,
                createdAt,
                assignedToId: (resolved || in_progress) ? assignedOfficerId : null,
                resolvedById: resolved ? assignedOfficerId : null,
                votes: 0,
            },
        });
        issues.push(issue);
    }
    console.log(`📋 Created exactly ${issues.length} realistic issues with AI-generated thumbnails\n`);

    // — Create Comments —
    let commentCount = 0;
    for (let i = 0; i < issues.length * 2; i++) {
        const issue = issues[i % issues.length];
        const commenter = i % 4 === 0 ? randomPick(officers) : citizens[i % citizens.length];
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

    // — Create Votes —
    let voteCount = 0;
    const voteCountsByIssue = new Map();
    for (let i = 0; i < issues.length * 4; i++) {
        const issue = issues[i % issues.length];
        const voter = citizens[i % citizens.length];

        // Check if vote already exists for this issue+user manually
        const existingVote = await prisma.vote.findFirst({
            where: { issueId: issue.id, userId: voter.id }
        });

        if (!existingVote) {
            await prisma.vote.create({
                data: { issueId: issue.id, userId: voter.id },
            });
            voteCount++;
            voteCountsByIssue.set(issue.id, (voteCountsByIssue.get(issue.id) || 0) + 1);
        }
    }
    for (const issue of issues) {
        await prisma.issue.update({
            where: { id: issue.id },
            data: { votes: voteCountsByIssue.get(issue.id) || 0 },
        });
    }
    console.log(`👍 Created ${voteCount} votes`);

    // — Create Ratings (Only for RESOLVED issues) —
    let ratingCount = 0;
    for (let i = 0; i < issues.length; i++) {
        const issue = issues[i];
        if (issue.status !== "RESOLVED") continue;

        const officerId = issue.resolvedById;
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

    // — Create Notifications —
    let notificationCount = 0;
    const recipients = [president, ...officers];
    for (let i = 0; i < issues.length * 2; i++) {
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
