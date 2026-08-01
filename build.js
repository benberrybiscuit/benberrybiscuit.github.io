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
// Render Blocks
// ----------------------------

function renderBlocks(project) {

    let output = "";

    console.log(project);

    project.blocks.forEach(block => {


        switch (block.type) {


            case "media":

                let template = loadTemplate("media");


                const images = block.images
                    ?.map(image =>
                        `<img class="gallery-img ${block.layout}" src="${image}">`
                    )
                    .join("")
                    || "";


                output += fill(template, {

                    heading:
                        block.heading,

                    images,

                    text:
                        block.text.join("<br><br>")

                });


                break;


            default:

                console.log(
                    `Unknown block type: ${block.type}`
                );

        }


    });


    return output;

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
        renderBlocks(project)
    );


    page = page.replace(
        "{{outcome}}",
        renderOutcome(project)
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
// Build All Projects
// ----------------------------

const projects = fs
    .readdirSync("projects")
    .filter(file =>
        file.endsWith(".json")
    );


projects.forEach(buildProject);


console.log("Portfolio build complete!");