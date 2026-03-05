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
    {
        title: "Massive pothole on 100 Feet Road",
        description: "A huge crater has formed near the junction. Two-wheelers are struggling to navigate safely, especially at night. Several accidents have been narrowly avoided.",
        category: "POTHOLE",
        area: "Indiranagar",
        status: "RESOLVED",
        imageUrl: "https://image.pollinations.ai/prompt/A%20deep%20dangerous%20pothole%20on%20an%20asphalt%20city%20street?width=800&height=600&nologo=true",
        daysAgo: 14,
        intensity: 8,
    },
    {
        title: "Garbage overflow near BDA Complex",
        description: "The main garbage bins haven't been cleared for a week. The waste is spilling onto the footpath causing a severe stench and attracting stray animals.",
        category: "GARBAGE",
        area: "Koramangala",
        status: "IN_PROGRESS",
        imageUrl: "https://image.pollinations.ai/prompt/A%20large%20pile%20of%20stinking%20garbage%20overflowing%20from%20a%20green%20bin%20onto%20the%20sidewalk?width=800&height=600&nologo=true",
        daysAgo: 5,
        intensity: 6,
    },
    {
        title: "Broken streetlight in 4th Block",
        description: "Entire stretch of the road is pitch dark. This is a severe safety hazard for pedestrians walking home from the metro station.",
        category: "STREETLIGHT",
        area: "Jayanagar",
        status: "REPORTED",
        imageUrl: "https://image.pollinations.ai/prompt/A%20broken%20unlit%20streetlight%20at%20night%20on%20a%20dark%20creepy%20street?width=800&height=600&nologo=true",
        daysAgo: 1,
        intensity: 8,
    },
    {
        title: "Major pipe burst flooding the road",
        description: "Underground BWSSB water pipe has burst. Thousands of liters of clean water are being wasted and flooding the intersection, causing major traffic jams.",
        category: "WATER_LEAK",
        area: "Whitefield",
        status: "RESOLVED",
        imageUrl: "https://image.pollinations.ai/prompt/A%20burst%20underground%20water%20pipe%20flooding%20a%20city%20road%20with%20clean%20water?width=800&height=600&nologo=true",
        daysAgo: 12,
        intensity: 9,
    },
    {
        title: "Construction debris dumped on road",
        description: "A local contractor dumped a truckload of cement rubble and sand right on the side of the main road, completely blocking the left lane.",
        category: "GARBAGE",
        area: "HSR Layout",
        status: "RESOLVED",
        imageUrl: "https://image.pollinations.ai/prompt/Construction%20debris%20and%20broken%20bricks%20dumped%20illegally%20on%20the%20side%20of%20a%20road?width=800&height=600&nologo=true",
        daysAgo: 20,
        intensity: 6,
    },
    {
        title: "Deep pothole hidden by rainwater",
        description: "This pothole gets filled with rain and becomes completely invisible. Several two-wheelers have skidded here today.",
        category: "POTHOLE",
        area: "BTM Layout",
        status: "REPORTED",
        imageUrl: "https://image.pollinations.ai/prompt/A%20deep%20pothole%20on%20a%20street%20filled%20with%20muddy%20rainwater?width=800&height=600&nologo=true",
        daysAgo: 0,
        intensity: 7,
    },
    {
        title: "Continuous sewage leak into residential area",
        description: "Foul-smelling raw sewage water has been flowing onto the street for three days straight. Urgent health risk for children playing nearby.",
        category: "WATER_LEAK",
        area: "JP Nagar",
        status: "IN_PROGRESS",
        imageUrl: "https://image.pollinations.ai/prompt/Raw%20sewage%20water%20leaking%20and%20flowing%20onto%20a%20residential%20city%20street?width=800&height=600&nologo=true",
        daysAgo: 4,
        intensity: 10,
    },
    {
        title: "Flickering street lamps on main avenue",
        description: "Three adjacent street lamps keep flickering on and off all night like a strobe light, causing severe distraction to drivers.",
        category: "STREETLIGHT",
        area: "Rajajinagar",
        status: "RESOLVED",
        imageUrl: "https://image.pollinations.ai/prompt/A%20flickering%20faulty%20streetlight%20on%20a%20highway%20at%20night?width=800&height=600&nologo=true",
        daysAgo: 25,
        intensity: 5,
    },
    {
        title: "Fallen tree blocking the cross road",
        description: "A large branch snapped during last night's storm and is blocking one lane completely. Traffic is backing up.",
        category: "OTHER",
        area: "Malleshwaram",
        status: "REPORTED",
        imageUrl: "https://image.pollinations.ai/prompt/A%20large%20fallen%20tree%20blocking%20a%20residential%20city%20road%20after%20a%20storm?width=800&height=600&nologo=true",
        daysAgo: 1,
        intensity: 7,
    },
    {
        title: "Series of potholes near metro pillar 45",
        description: "The road surface has completely eroded near the pillar. Traffic slows to a crawl creating a massive bottleneck during peak hours.",
        category: "POTHOLE",
        area: "Jayanagar",
        status: "IN_PROGRESS",
        imageUrl: "https://image.pollinations.ai/prompt/A%20terrible%20damaged%20city%20road%20full%20of%20multiple%20deep%20potholes?width=800&height=600&nologo=true",
        daysAgo: 3,
        intensity: 8,
    },
    {
        title: "Illegal garbage dumping yard",
        description: "An empty lot has been turned into an illegal dumping ground by commercial trucks in the middle of the night.",
        category: "GARBAGE",
        area: "Whitefield",
        status: "REPORTED",
        imageUrl: "https://image.pollinations.ai/prompt/A%20huge%20illegal%20garbage%20dumping%20ground%20in%20an%20empty%20city%20lot?width=800&height=600&nologo=true",
        daysAgo: 1,
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
