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
    { name: "Electronic City", lat: 12.8399, lng: 77.6770 },
    { name: "Rajajinagar", lat: 12.9900, lng: 77.5523 },
    { name: "Malleshwaram", lat: 13.0035, lng: 77.5685 },
    { name: "Banashankari", lat: 12.9255, lng: 77.5468 },
    { name: "JP Nagar", lat: 12.9063, lng: 77.5857 },
    { name: "Hebbal", lat: 13.0358, lng: 77.5970 },
    { name: "MG Road", lat: 12.9756, lng: 77.6068 },
    { name: "Basavanagudi", lat: 12.9422, lng: 77.5757 },
];

const categories = ["POTHOLE", "GARBAGE", "STREETLIGHT", "WATER_LEAK", "OTHER"];
const statuses = ["REPORTED", "IN_PROGRESS", "RESOLVED"];

const issueTemplates = [
    {
        cat: "POTHOLE", titles: [
            "Massive pothole on {road} near {area}",
            "Deep crater on main road in {area}",
            "Dangerous pothole near {area} junction",
            "Road caved in near {area} bus stop",
            "Multiple potholes on {area} inner road",
        ], descs: [
            "A large pothole approximately 2 feet deep has formed on the main road. Vehicles are swerving to avoid it, creating a hazard.",
            "After the recent rains, a significant pothole has appeared. Several two-wheelers have had accidents here in the past week.",
            "The road surface has completely deteriorated near the junction. Needs immediate repair before monsoon season.",
            "This pothole has been growing for the past month. Water accumulates during rain making it invisible and dangerous.",
        ]
    },
    {
        cat: "GARBAGE", titles: [
            "Garbage overflow at {area} dumpyard",
            "Uncleared garbage pile near {area} park",
            "Waste dumping on empty plot in {area}",
            "Overflowing garbage bin at {area} market",
            "Construction debris dumped in {area}",
        ], descs: [
            "The garbage bins have not been cleared for over a week. The pile is now overflowing onto the road and causing a stench.",
            "Residents are dumping waste on the empty plot. Stray dogs are scattering it, creating an unhygienic environment.",
            "BBMP garbage collection has been irregular. Multiple complaints raised but no action taken.",
            "The market area bins are overflowing. Flies and rats are a major concern for nearby food establishments.",
        ]
    },
    {
        cat: "STREETLIGHT", titles: [
            "Broken streetlight on {area} main road",
            "Dark stretch near {area} - no lights working",
            "Flickering streetlights in {area} residential area",
            "Streetlight pole damaged in {area}",
            "Five streetlights out in {area} cross",
        ], descs: [
            "The streetlight has been broken for 2 weeks. The area becomes completely dark after 6 PM, making it unsafe.",
            "An entire stretch of 200 meters has no working streetlights. Multiple incidents of chain snatching reported.",
            "The streetlight keeps flickering on and off throughout the night, disturbing residents.",
            "A streetlight pole was damaged by a truck last week. Exposed wiring is a safety hazard.",
        ]
    },
    {
        cat: "WATER_LEAK", titles: [
            "Major water pipe burst in {area}",
            "Continuous water leak on {area} road",
            "Sewage overflow near {area} school",
            "Broken water main flooding {area} street",
            "Underground pipe leak in {area}",
        ], descs: [
            "A water pipe has burst on the main road causing significant water wastage and flooding of the road.",
            "There has been a continuous water leak for the past 3 days. The road has become muddy and slippery.",
            "Sewage water is overflowing near the school entrance. Children are at risk of waterborne diseases.",
            "The underground pipe seems to have cracked. Water is seeping up through the road surface.",
        ]
    },
    {
        cat: "OTHER", titles: [
            "Damaged footpath in {area}",
            "Illegal encroachment on {area} pavement",
            "Missing drain cover near {area}",
            "Fallen tree blocking road in {area}",
            "Broken speed breaker in {area}",
        ], descs: [
            "The footpath tiles are broken and uneven, causing pedestrians to trip. Urgent repair needed.",
            "Several vendors have illegally encroached on the pavement, forcing pedestrians to walk on the road.",
            "A drain cover is missing on the main road. A child fell into it last week. Extremely dangerous.",
            "A large tree fell during yesterday's storm and is partially blocking the road.",
        ]
    },
];

const roads = [
    "80 Feet Road", "100 Feet Road", "Outer Ring Road", "Inner Ring Road",
    "Old Madras Road", "Hosur Road", "Bellary Road", "Tumkur Road",
    "Mysore Road", "Airport Road", "Sarjapur Road", "Bannerghatta Road",
    "Kanakapura Road", "Nandi Hills Road", "Residency Road",
];

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
    return d;
}

async function main() {
    console.log("🌱 Starting seed...\n");

    // Clean existing data
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
            avgRating: 4.6,
            resolvedCount: 45,
            assignedCount: 50,
        },
    });
    console.log(`👑 President: ${president.name}`);

    const officerData = [
        { name: "Priya Sharma", area: "Koramangala", rating: 4.2, resolved: 28, assigned: 35 },
        { name: "Suresh Gowda", area: "Indiranagar", rating: 3.8, resolved: 22, assigned: 30 },
        { name: "Lakshmi Devi", area: "Jayanagar", rating: 4.7, resolved: 38, assigned: 40 },
        { name: "Anil Reddy", area: "Whitefield", rating: 3.5, resolved: 15, assigned: 25 },
        { name: "Meena Kumari", area: "HSR Layout", rating: 4.4, resolved: 32, assigned: 36 },
        { name: "Ravi Shankar", area: "Malleshwaram", rating: 4.0, resolved: 20, assigned: 28 },
        { name: "Deepa Nair", area: "BTM Layout", rating: 4.5, resolved: 30, assigned: 33 },
        { name: "Karthik Hegde", area: "Marathahalli", rating: 3.9, resolved: 18, assigned: 26 },
    ];

    const officers = [];
    for (const od of officerData) {
        const officer = await prisma.user.create({
            data: {
                clerkId: `seed_officer_${od.name.replace(/\s/g, "_").toLowerCase()}`,
                name: od.name,
                email: `${od.name.replace(/\s/g, ".").toLowerCase()}@bbmp.gov.in`,
                role: "OFFICER",
                area: od.area,
                avgRating: od.rating,
                resolvedCount: od.resolved,
                assignedCount: od.assigned,
            },
        });
        officers.push(officer);
        console.log(`🛡️  Officer: ${officer.name} (${od.area})`);
    }

    const citizenNames = [
        "Aarav Patel", "Nisha Rao", "Vikram Singh", "Divya Menon",
        "Arjun Shetty", "Kavya Iyer", "Rohan Das", "Sneha Kulkarni",
        "Siddharth Joshi", "Ananya Murthy", "Nitin Garg", "Pooja Bhat",
        "Rahul Verma", "Swathi Naidu", "Kiran Desai", "Megha Acharya",
        "Varun Kamath", "Shruti Pai", "Ganesh Prasad", "Rekha Srinivas",
    ];

    const citizens = [];
    for (let i = 0; i < 100; i++) {
        const name = citizenNames[i % citizenNames.length] + ` ${i}`;
        const citizen = await prisma.user.create({
            data: {
                clerkId: `seed_citizen_${i}_${name.replace(/\\s/g, "_").toLowerCase()}`,
                name,
                email: `citizen${i}@gmail.com`,
                role: "CITIZEN",
            },
        });
        citizens.push(citizen);
    }
    console.log(`👥 Created ${citizens.length} citizens\n`);

    // — Create Issues (Exactly 10 with images) —
    const curatedIssues = [
        {
            title: "Massive pothole on 100 Feet Road",
            description: "A huge crater has formed near the junction. Two-wheelers are struggling to navigate safely, especially at night.",
            category: "POTHOLE",
            area: "Indiranagar",
            imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
            status: "REPORTED",
            daysAgo: 2
        },
        {
            title: "Garbage overflow near BDA Complex",
            description: "The main garbage bins haven't been cleared for a week. The waste is spilling onto the footpath causing a severe stench.",
            category: "GARBAGE",
            area: "Koramangala",
            imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=800",
            status: "IN_PROGRESS",
            daysAgo: 5
        },
        {
            title: "Broken streetlight in 4th Block",
            description: "Entire stretch of the road is pitch dark. This is a severe safety hazard for pedestrians walking home.",
            category: "STREETLIGHT",
            area: "Jayanagar",
            imageUrl: "https://images.unsplash.com/photo-1519782431690-3ce47dd7e2a9?auto=format&fit=crop&q=80&w=800",
            status: "REPORTED",
            daysAgo: 1
        },
        {
            title: "Major pipe burst flooding the road",
            description: "Underground BWSSB water pipe has burst. Thousands of liters of clean water are being wasted and flooding the intersection.",
            category: "WATER_LEAK",
            area: "Whitefield",
            imageUrl: "https://images.unsplash.com/photo-1549428581-22e6b01b3334?auto=format&fit=crop&q=80&w=800",
            status: "RESOLVED",
            daysAgo: 12
        },
        {
            title: "Broken footpath tiles",
            description: "Pedestrian walkway tiles are completely shattered here making it impossible for senior citizens to walk.",
            category: "OTHER",
            area: "Malleshwaram",
            imageUrl: "https://images.unsplash.com/photo-1495556650867-99590cea3657?auto=format&fit=crop&q=80&w=800",
            status: "RESOLVED",
            daysAgo: 20
        },
        {
            title: "Construction debris dumped on road",
            description: "A local contractor dumped a truckload of cement rubble and sand right on the side of the main road.",
            category: "GARBAGE",
            area: "HSR Layout",
            imageUrl: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&q=80&w=800",
            status: "IN_PROGRESS",
            daysAgo: 3
        },
        {
            title: "Deep pothole hidden by rainwater",
            description: "This pothole gets filled with rain and becomes completely invisible. Several accidents have happened already.",
            category: "POTHOLE",
            area: "BTM Layout",
            imageUrl: "https://images.unsplash.com/photo-1584985250393-eece88771190?auto=format&fit=crop&q=80&w=800",
            status: "REPORTED",
            daysAgo: 1
        },
        {
            title: "Continuous sewage leak",
            description: "Foul-smelling sewage water has been flowing onto the street for three days straight. Urgent health risk.",
            category: "WATER_LEAK",
            area: "Marathahalli",
            imageUrl: "https://images.unsplash.com/photo-1505295713488-886d9070868f?auto=format&fit=crop&q=80&w=800",
            status: "IN_PROGRESS",
            daysAgo: 4
        },
        {
            title: "Flickering street lamps",
            description: "Three adjacent street lamps keep flickering on and off all night like a strobe light.",
            category: "STREETLIGHT",
            area: "Rajajinagar",
            imageUrl: "https://images.unsplash.com/photo-1494247551939-2eeb2ff8eb7a?auto=format&fit=crop&q=80&w=800",
            status: "RESOLVED",
            daysAgo: 15
        },
        {
            title: "Fallen tree blocking the cross road",
            description: "A large branch snapped during last night's storm and is blocking one lane completely.",
            category: "OTHER",
            area: "JP Nagar",
            imageUrl: "https://images.unsplash.com/photo-1518731112461-8207198a28f8?auto=format&fit=crop&q=80&w=800",
            status: "REPORTED",
            daysAgo: 0
        }
    ];

    const issues = [];
    for (const item of curatedIssues) {
        const locationDef = bengaluruLocations.find(l => l.name === item.area) || bengaluruLocations[0];
        const citizen = randomPick(citizens);
        const officer = officers.find((o) => o.area === item.area) || randomPick(officers);

        // Exact creation date
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - item.daysAgo);

        // Add tiny variance to lat/long
        const lat = locationDef.lat + randomFloat(-0.003, 0.003);
        const lng = locationDef.lng + randomFloat(-0.003, 0.003);

        const issue = await prisma.issue.create({
            data: {
                title: item.title,
                description: item.description,
                category: item.category,
                status: item.status,
                latitude: lat,
                longitude: lng,
                imageUrl: item.imageUrl,
                area: item.area,
                createdById: citizen.id,
                createdAt: createdAt,
                assignedToId: item.status !== "REPORTED" ? officer.id : null,
                resolvedById: item.status === "RESOLVED" ? (Math.random() > 0.5 ? president.id : officer.id) : null,
                votes: Math.floor(Math.random() * 40),
            },
        });
        issues.push(issue);
    }
    console.log(`📋 Created exactly ${issues.length} curated issues with images\n`);

    // — Create Comments —
    let commentCount = 0;
    for (const issue of issues) {
        const numComments = Math.floor(Math.random() * 5);
        for (let j = 0; j < numComments; j++) {
            const commenter = Math.random() > 0.3 ? randomPick(citizens) : randomPick(officers);
            const comments = [
                "This needs urgent attention!",
                "I've also noticed this issue. Please fix it soon.",
                "BBMP, please look into this.",
                "Has been like this for weeks now.",
                "Thank you for reporting this.",
                "Our team is looking into this issue.",
                "We have forwarded this to the concerned department.",
                "This is a safety hazard, needs immediate action.",
                "Similar issue in the nearby area too.",
                "Great that someone finally reported this!",
                "We are working on resolving this. ETA 3 days.",
                "The contractor has been notified.",
                "Please be patient, we are prioritizing based on severity.",
                "I see this every day on my commute. Very dangerous.",
                "Can confirm, this is getting worse.",
            ];
            await prisma.comment.create({
                data: {
                    comment: randomPick(comments),
                    issueId: issue.id,
                    userId: commenter.id,
                    createdAt: randomDate(30),
                },
            });
            commentCount++;
        }
    }
    console.log(`💬 Created ${commentCount} comments`);

    // — Create Votes —
    let voteCount = 0;
    for (const issue of issues) {
        const numVotes = Math.min(Math.floor(Math.random() * 8), citizens.length);
        const shuffled = [...citizens].sort(() => 0.5 - Math.random());
        for (let j = 0; j < numVotes; j++) {
            try {
                await prisma.vote.create({
                    data: { issueId: issue.id, userId: shuffled[j].id },
                });
                voteCount++;
            } catch {
                // duplicate vote, skip
            }
        }
    }
    console.log(`👍 Created ${voteCount} votes`);

    // — Create Ratings —
    let ratingCount = 0;
    const resolvedIssues = issues.filter((i) => i.status === "RESOLVED" && i.assignedToId);
    for (const issue of resolvedIssues) {
        const officerId = issue.resolvedById || issue.assignedToId;
        if (!officerId) continue;

        try {
            const score = Math.floor(Math.random() * 3) + 3; // 3-5
            const feedbacks = [
                "Quick resolution, thank you!",
                "Good work, but took a bit long.",
                "Excellent service!",
                "Satisfactory.",
                "Could have been faster.",
                null,
                null,
            ];
            await prisma.rating.create({
                data: {
                    score,
                    feedback: randomPick(feedbacks),
                    issueId: issue.id,
                    givenById: issue.createdById,
                    officerId,
                    createdAt: randomDate(30),
                },
            });
            ratingCount++;
        } catch {
            // skip duplicates
        }
    }
    console.log(`⭐ Created ${ratingCount} ratings`);

    console.log("\n🎉 Seed complete!");
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
