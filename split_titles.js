const fs = require("fs");
const path = require("path");

const msgDir = path.join(__dirname, "apps/web/messages");
const files = fs.readdirSync(msgDir).filter((f) => f.endsWith(".json"));

files.forEach((file) => {
    const filePath = path.join(msgDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (data.Home && data.Home.title) {
        const title = data.Home.title;
        // Try to split by comma
        let prefix = "";
        let highlight = "";

        if (title.includes(", ")) {
            const parts = title.split(", ");
            prefix = parts[0] + ", ";
            highlight = parts.slice(1).join(", ");
        } else if (title.includes(" - ")) {
            const parts = title.split(" - ");
            prefix = parts[0] + " - ";
            highlight = parts.slice(1).join(" - ");
        } else {
            // Split roughly in half by words
            const words = title.split(" ");
            const mid = Math.floor(words.length / 2);
            prefix = words.slice(0, mid).join(" ") + " ";
            highlight = words.slice(mid).join(" ");
        }

        data.Home.heroTitle = { prefix, highlight };
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    }
});
console.log("Done!");
