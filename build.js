const fs = require("fs");

// Load template
const template = fs.readFileSync("template.html", "utf8");

// Load project data
const project = JSON.parse(
    fs.readFileSync("projects/in-realty.json", "utf8")
);

// Replace simple fields
let html = template
    .replaceAll("{{title}}", project.title)
    .replaceAll("{{hero}}", project.hero)
    .replaceAll("{{industry}}", project.industry)
    .replaceAll("{{challenge}}", project.challenge)
    .replaceAll("{{approach}}", project.approach)
    .replaceAll("{{outcome}}", project.outcome);


// Build scope list
const scopeHTML = project.scope
    .map(item => `<li>${item}</li>`)
    .join("");

html = html.replace(
    "{{scope}}",
    scopeHTML
);


// Build intro
html = html.replace(
    "{{intro-primary}}",
    project.intro.primary
);

html = html.replace(
    "{{intro-secondary}}",
    project.intro.secondary
);


// Save output
fs.writeFileSync(
    "portfolio/in-realty.html",
    html
);

console.log("Portfolio page generated!");