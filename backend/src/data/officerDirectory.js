export const OFFICER_DIRECTORY = [
    {
        name: "Dr. S. Rao",
        email: "principal@bmsce.ac.in",
        role: "PRESIDENT",
        area: "Bengaluru Central",
    },
    {
        name: "Anita Nair",
        email: "anita.nair@bmsce.ac.in",
        role: "OFFICER",
        area: "Koramangala",
    },
    {
        name: "Arjun Rao",
        email: "arjun.rao@bmsce.ac.in",
        role: "OFFICER",
        area: "Indiranagar",
    },
    {
        name: "Meera Kulkarni",
        email: "meera.kulkarni@bmsce.ac.in",
        role: "OFFICER",
        area: "Jayanagar",
    },
    {
        name: "Sahil Kumar",
        email: "sahil.kumar@bmsce.ac.in",
        role: "OFFICER",
        area: "HSR Layout",
    },
    {
        name: "Divya Shetty",
        email: "divya.shetty@bmsce.ac.in",
        role: "OFFICER",
        area: "Whitefield",
    },
];

export function findOfficerByEmail(email) {
    if (!email) return null;
    const normalized = email.toLowerCase();
    return OFFICER_DIRECTORY.find((entry) => entry.email.toLowerCase() === normalized) || null;
}

export const DEFAULT_OFFICER_AREA = "Bengaluru Central";
