// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;
// PMSS Schedule Widget v1.0.1

const widget = new ListWidget();

const scriptURL = "https://raw.githubusercontent.com/zichenc7/PMSS-Schedule-Widget/master/alt-day-schedule.js";
const version = "1.0.1";

// Date constants
const start = new Date(2023, 8, 6);
const end = new Date(2024, 5, 28);
const lsYear = new Date(2023, 5, 1);
const lsYearEnd = new Date(2023, 5, 30);
const current = new Date();

// Skip dates
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

// Breaks
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

// Initialize widget
widget.setPadding(10, 10, 10, 10);
widget.useDefaultPadding();
widget.spacing = 5;

const titleFont = Font.boldSystemFont(18);
const titleColor = new Color("#FFFFFF");

const contentFont = Font.systemFont(16);
const contentColor = new Color("#FFFFFF");

// Determine output
let titleText = "";
if (current.getDay() === 0 || current.getDay() === 6) {
    titleText += "Weekend";
} else if (current.toDateString() === new Date(2023, 8, 5).toDateString()) {
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

// Add widget text
const titleLabel = widget.addText(titleText);
titleLabel.font = titleFont;
titleLabel.textColor = titleColor;

const outputLabel = widget.addText(current.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"}));
outputLabel.font = contentFont;
outputLabel.textColor = contentColor;

// Set widget background color, unused for lock screen widget
widget.backgroundColor = new Color("#000000");

// Run in app, display options menu
if (config.runsInApp) {
    const options = ["Preview Widget", "Check for Updates", "Cancel"];
    const selectedIndex = await optionsMenu(options);
    if (selectedIndex === 0) {
        widget.presentSmall();
    } else if (selectedIndex === 1) {
        await updateCheck();
    }
} else {
    await updateCheck();
}

// Set widget refresh time
if (current.getHours() >= 12) {
    widget.refreshAfterDate = new Date(current.getFullYear(), current.getMonth(), current.getDate()+1, 6, 0);
} else if (current.getHours() >= 0 && current.getHours() < 6) {
    widget.refreshAfterDate = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 6, 0);
} else {
    widget.refreshAfterDate = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 12, 0);
}

// Display widget
Script.setWidget(widget);
Script.complete();

// Present options menu
async function optionsMenu(options) {

    const alert = new Alert();
    alert.title = "PMSS Schedule Widget by Zi Chen Cai";
    alert.message = "Select an option:";
  
    for (const option of options) {
        alert.addAction(option);
    }
  
    const selectedIndex = await alert.presentSheet();
    return selectedIndex;

}

// Compare version numbers
async function compareVersions() {

    let uc;
    try {
        let json = new Request(`${scriptURL}on`);
        uc = await json.loadJSON();
    } catch (e) {
        return console.log(e);
    }

    let curVer = version.split(".");
    let updVer = uc.version.split(".");
    let cv = parseInt(curVer[0]) * 10000 + parseInt(curVer[1]) * 100 + parseInt(curVer[2]);
    let uv = parseInt(updVer[0]) * 10000 + parseInt(updVer[1]) * 100 + parseInt(updVer[2]);

    return cv < uv;
    
}

// Check for updates
async function updateCheck() {

    if (await compareVersions()) {
        
        console.log("Update Available");
        const fm = FileManager.iCloud();
        const scriptPath = fm.joinPath(fm.documentsDirectory(), `${Script.name()}.js`);
        const request = new Request(scriptURL);
        const updatedScript = await request.loadString();
        
        if (fm.fileExists(scriptPath)) {
            const currentScript = fm.readString(scriptPath);
            if (currentScript !== updatedScript) {
                fm.writeString(scriptPath, updatedScript);
                console.log("Script Updated");
            }
        } else {
            fm.writeString(scriptPath, updatedScript);
            console.log("Initial Script Download Complete");
        }

    } else {
        console.log("Up to Date");
    }

}