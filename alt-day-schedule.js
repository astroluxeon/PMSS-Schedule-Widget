// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;
// PMSS Schedule Rotation Widget v0.2.4

const widget = new ListWidget();

const scriptURL = "https://raw.githubusercontent.com/zichenc7/PMSS-Schedule-Rotation-Widget/master/alt-day-schedule.js";
const version = "0.2.4"

const start = new Date(2023, 8, 6);
const end = new Date(2024, 5, 28);
const lsYear = new Date(2023, 5, 1);
const lsYearEnd = new Date(2023, 5, 30);
const current = new Date();

const holidays = new Map([
    [new Date(2023, 8, 22).getTime(), "Pro-D Day"],
    [new Date(2023, 9, 2).getTime(), "Truth and Reconciliation Day"],
    [new Date(2023, 9, 9).getTime(), "Thanksgiving Day"],
    [new Date(2023, 9, 20).getTime(), "Pro-D Day"],
    [new Date(2023, 10, 10).getTime(), "School Closure Day"],
    [new Date(2023, 10, 13).getTime(), "Remembrance Day"],
    [new Date(2023, 10, 17).getTime(), "Pro-D Day"],
    [new Date(2024, 1, 19).getTime(), "Family Day"],
    [new Date(2024, 1, 23).getTime(), "Pro-D Day"],
    [new Date(2024, 2, 29).getTime(), "Good Friday"],
    [new Date(2024, 3, 1).getTime(), "Easter Monday"],
    [new Date(2024, 3, 18).getTime(), "Pro-D Day"],
    [new Date(2024, 4, 19).getTime(), "Victoria Day"],
    [new Date(2024, 5, 6).getTime(), "Pro-D Day"]
]);

const wBreakStart = new Date(2023, 11, 23);
const wBreakEnd = new Date(2024, 0, 7);
const sBreakStart = new Date(2024, 2, 16);
const sBreakEnd = new Date(2024, 2, 28);

for (let date = new Date(wBreakStart); date <= wBreakEnd; date.setDate(date.getDate() + 1)) {
    holidays.set(new Date(date), "Winter Break");
}

for (let date = new Date(sBreakStart); date <= sBreakEnd; date.setDate(date.getDate() + 1)) {
    holidays.set(new Date(date), "Spring Break");
}

// Define the widget dimensions
widget.setPadding(10, 10, 10, 10);
widget.useDefaultPadding();
widget.spacing = 5;

// Define the text styles
const titleFont = Font.boldSystemFont(18);
const titleColor = new Color("#FFFFFF"); // Customize the title color if needed

const contentFont = Font.systemFont(16);
const contentColor = new Color("#FFFFFF"); // Customize the content color if needed

// Determine the output text
let titleText = "";
if (current.toDateString() === new Date(2023, 8, 5).toDateString()) {
    titleText += "Back to School!";
} else if (current.getTime() < new Date(2023, 8, 5).getTime()) {
    if (current.getTime() < lsYearEnd.getTime()) {
        const dayN = Math.floor((current - lsYear) / (1000 * 60 * 60 * 24)) % 2;
        if (dayN === 0) {
            titleText += "Day 1";
        } else {
            titleText += "Day 2";
        }
    } else {
        titleText += "Enjoy Summer!"
    }
} else if (holidays.has(current.getTime())) {
    titleText += holidays.get(current.getTime());
} else if (current.getDay() === 0 || current.getDay() === 6) {
    titleText += "Weekend";
} else if (current.getTime() >= end.getTime()) {
    titleText += "Enjoy Summer!";
} else {
    let totalDays = Math.floor((current - start) / (1000 * 60 * 60 * 24))
    let sum = 0;
    for (const [key, value] of holidays) {
        if (key < current) {
            sum++;
        }
    }
    totalDays -= sum;
    const dayN = totalDays % 2;
    if (dayN === 0) {
        titleText += "Day 1";
    } else {
        titleText += "Day 2";
    }
}

// Add the title label
const titleLabel = widget.addText(titleText);
titleLabel.font = titleFont;
titleLabel.textColor = titleColor;

// Add the output text to the widget
const outputLabel = widget.addText(current.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"}));
outputLabel.font = contentFont;
outputLabel.textColor = contentColor;

// Set the widget background color
widget.backgroundColor = new Color("#000000")

async function checkForUpdates() {

    let uc;
    try {
        let updateCheck = new Request(`${scriptURL}on`);
        uc = await updateCheck.loadJSON();
    } catch (e) {
        return console.log(e);
    }
  
    // Compare the version numbers
    if (version !== uc.version) {
        console.log("An update is available");
        const fm = FileManager.iCloud();
        const scriptPath = fm.joinPath(fm.documentsDirectory(), `${Script.name()}.js`);
        const request = new Request(scriptURL);
        const updatedScript = await request.loadString();
        
        if (fm.fileExists(scriptPath)) {
            const currentScript = fm.readString(scriptPath);
            if (currentScript !== updatedScript) {
                fm.writeString(scriptPath, updatedScript);
                console.log("Script updated");
            }
        } else {
            fm.writeString(scriptPath, updatedScript);
            console.log("Initial script download complete");
        }
    } else {
        console.log("No updates available");
    }

}

// Run the script
if (config.runsInWidget) {
    // For widget display, present the widget
    Script.setWidget(widget);
} else {
    // For script execution, log the widget's text
    console.log(widget.text);
}

// Check if the script runs in the app and show options menu
if (config.runsInApp) {

    const options = ["Run Script", "Check for Updates"];
    const selectedIndex = await presentOptions(options);

    // Handle selected option
    if (selectedIndex === 1) {
        checkForUpdates();
    }

}

// Function to present options menu
async function presentOptions(options) {

    const alert = new Alert();
    alert.title = "PMSS Schedule Rotation Widget by Zi Chen Cai";
    alert.message = "Select an option:";
  
    for (const option of options) {
        alert.addAction(option);
    }
  
    const selectedIndex = await alert.presentSheet();
    return selectedIndex;

}