const fs = require("fs");
const path = require("path");


// ----------------------------
// Load a template file
// ----------------------------

function loadTemplate(name) {
    return fs.readFileSync(
        path.join("templates", `${name}.html`),
        "utf8"
    );
}


// ----------------------------
// Replace placeholders
// ----------------------------

function fill(template, data) {

    return template.replace(
        /{{(.*?)}}/g,
        (_, key) => data[key.trim()] ?? ""
    );

}


// ----------------------------
// Render Hero
// ----------------------------

function renderHero(project) {

    let template = loadTemplate("hero");

    return fill(template, {
        hero: project.hero
    });

}


// ----------------------------
// Render Intro
// ----------------------------

function renderIntro(project) {

    let template = loadTemplate("intro");


    const scope = project.scope
        .map(item => `<li>${item}</li>`)
        .join("");


    return fill(template, {

        title: project.title,

        "intro-primary":
            project.intro.primary,

        "intro-secondary":
            project.intro.secondary,

        industry:
            project.industry,

        scope

    });
}


// ----------------------------
// Render Summary
// ----------------------------

function renderSummary(project) {

    let template = loadTemplate("summary");


    return fill(template, {

        challenge:
            project.challenge,

        approach:
            project.approach

    });

}


// ----------------------------
// Render Sections
// ----------------------------

function renderSections(project) {

    let output = "";

    project.sections.forEach(section => {

        const media = section.blocks
            .map(renderBlock)
            .join("");


        let template = loadTemplate("media");


        output += fill(template, {

            heading: section.heading || "",

            text: (section.text || []).join("<br><br>"),

            media,

            spacing: "pt-2"

        });

    });


    return output;

}


// ----------------------------
// Render Individual Media Blocks
// ----------------------------

function renderBlock(block) {

    switch (block.layout) {

        case "wide":
            return renderWide(block);

        case "two-tall":
            return renderTwoTall(block);

        case "video":
            return renderVideo(block);

        default:
            console.log(`Unknown layout: ${block.layout}`);
            return "";

    }
}



// ----------------------------
// Wide image renderer
// ----------------------------

function renderWide(block) {

    return `
    <img class="gallery-img wide" src="${block.images[0]}">
    `;
}



// ----------------------------
// Two tall image renderer
// ----------------------------

function renderTwoTall(block) {

    return block.images
        .map(image =>
            `<img class="gallery-img tall" src="${image}">`
        )
        .join("");
}



// ----------------------------
// Video renderer
// ----------------------------

function renderVideo(block) {

    return `
    <video class="gallery-img wide" autoplay playsinline muted loop>
        <source src="${block.video}" type="video/mp4">
    </video>
    `;
}









// ----------------------------
// Render Outcome
// ----------------------------
function renderOutcome(project) {

    let template = loadTemplate("outcome");

    return fill(template, {

        outcome:
            project.outcome

    });
}




// ----------------------------
// Render Portfolio Cards
// ----------------------------

function renderPortfolio(projects) {

    let template = loadTemplate("project-card");

    return projects
        .map(project => {
            return fill(template, {

                slug: project.slug,

                thumbnail:
                    (project.thumbnail || project.hero).replace("../", ""),

                title:
                    project.title,

                industry:
                    project.industry

            });
        })
        .join("");
}







// ----------------------------
// Render Project Navigation
// ----------------------------

function renderProjectNav(project, projects) {

    const currentIndex = projects
        .sort((a, b) => a.order - b.order)
        .findIndex(item => item.slug === project.slug);


    const previous = projects[currentIndex - 1];
    const next = projects[currentIndex + 1];


    let template = loadTemplate("project-nav");


    return fill(template, {

        "previous-link":
            previous ? `${previous.slug}.html` : "#",

        "previous-title":
            previous ? previous.title : "",

        "next-link":
            next ? `${next.slug}.html` : "#",

        "next-title":
            next ? next.title : ""

    });

}




// ----------------------------
// Build Project
// ----------------------------

function buildProject(file) {


    const project = JSON.parse(
        fs.readFileSync(
            path.join("projects", file),
            "utf8"
        )
    );

    let page = fs.readFileSync(
        "page.html",
        "utf8"
    );

    page = page.replace(
        "{{hero}}",
        renderHero(project)
    );

    page = page.replace(
        "{{intro}}",
        renderIntro(project)
    );

    page = page.replace(
        "{{summary}}",
        renderSummary(project)
    );

    page = page.replace(
        "{{blocks}}",
        renderSections(project)
    );

    page = page.replace(
        "{{outcome}}",
        renderOutcome(project)
    );




    page = page.replace(
        "{{project-nav}}",
        renderProjectNav(project, projects)
    );






    const outputPath = path.join(
        "portfolio",
        `${project.slug}.html`
    );

    fs.writeFileSync(
        outputPath,
        page
    );

    console.log(
        `Built: ${project.slug}.html`
    );

}






// ----------------------------
// Build Portfolio Index
// ----------------------------

function buildPortfolioPage() {

    let page = fs.readFileSync(
        path.join("templates", "portfolio.html"),
        "utf8"
    );

    page = page.replace(
        "{{portfolio}}",
        renderPortfolio(projects)
    );

    fs.writeFileSync(
        "portfolio.html",
        page
    );

    console.log("Built: portfolio.html");

}



// ----------------------------
// Build All Projects
// ----------------------------

const projectFiles = fs
    .readdirSync("projects")
    .filter(file =>
        file.endsWith(".json")
    );


const projects = projectFiles.map(file =>
    JSON.parse(
        fs.readFileSync(
            path.join("projects", file),
            "utf8"
        )
    )
);

// Build portfolio index

buildPortfolioPage();

// Build project pages

projectFiles.forEach(buildProject);

console.log("Portfolio build complete!");