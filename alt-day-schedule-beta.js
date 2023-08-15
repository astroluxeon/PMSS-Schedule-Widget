// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;
// PMSS Schedule Widget v2.0.11-beta

const testing = true;

const scriptURL = testing ? "https://raw.githubusercontent.com/zichenc7/PMSS-Schedule-Widget/master/alt-day-schedule-beta.js" : "https://raw.githubusercontent.com/zichenc7/PMSS-Schedule-Widget/master/alt-day-schedule.js";
const version = testing ? "2.0.11" : "0.0.0";

const widget = new ListWidget();

const filename = Script.name() + ".jpg";
const files = FileManager.local();
const path = files.joinPath(files.documentsDirectory(), filename);

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

const titleFont = Font.boldSystemFont(16);
const titleColor = new Color("#FFFFFF");

const contentFont = Font.systemFont(16);
const contentColor = new Color("#FFFFFF");

// Run in app, display options menu
if (config.runsInApp) {
    const selectedIndex = await optionsMenu();
    if (selectedIndex === 1) {
        await updateCheck();
    } else if (selectedIndex === 2) {
        await setBackground();
    } else if (selectedIndex === 3) {
        await scheduleInput();
    }
} else {
    await updateCheck();
}

let titleText;
let outputText = "";
let schedule = readData();

// Determine output
let day = 0;
if (current.getDay() === 0 || current.getDay() === 6) {
    outputText += "Weekend";
} else if (current.toDateString() === new Date(2023, 8, 5).toDateString()) {
    outputText += "Back to School!";
} else if (current.getTime() < new Date(2023, 8, 5).getTime()) {
    if (current.getTime() < lsYearEnd.getTime()) {
        const dayN = Math.floor((current - lsYear) / (1000 * 60 * 60 * 24)) % 2;
        if (dayN === 0) {
            day = 1;
            outputText += "Day 1";
        } else {
            day = 2;
            outputText += "Day 2";
        }
    } else {
        outputText += "Enjoy Summer!";
    }
} else if (holidays.has(current.getTime())) {
    outputText += holidays.get(current.getTime());
} else if (current.getTime() >= end.getTime()) {
    outputText += "Enjoy Summer!";
} else {
    let totalDays = Math.floor((current - start) / (1000 * 60 * 60 * 24));
    let sum = 0;
    for (const [key, value] of holidays) {
        if (key < current) {
            sum++;
        }
    }
    totalDays -= sum;
    const dayN = totalDays % 2;
    if (dayN === 0) {
        day = 1;
        outputText += "Day 1";
    } else {
        day = 2;
        outputText += "Day 2";
    }
}

// Display class schedule
if (!schedule || day === 0) { // day in header
    titleText = widget.addText(outputText);
    outputText = widget.addText(current.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"}));
} else { // class in header
    if (current.getDay() === 1) {
        if (current.getTime() < new Date(current.getFullYear(), current.getMonth(), current.getDate(), 8, 15)) {
            outputText = widget.addText(current.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"}));
        } else if (current.getTime() <= new Date(current.getFullYear(), current.getMonth(), current.getDate(), 9, 38)) {
            outputText = widget.addText(schedule[`${day}-1`]);
        } else if (current.getTime() <= new Date(current.getFullYear(), current.getMonth(), current.getDate(), 10, 49)) {
            outputText = widget.addText(schedule[`${day}-2`]);
        } else if (current.getTime() <= new Date(current.getFullYear(), current.getMonth(), current.getDate(), 11, 39)) {
            outputText = widget.addText("Lunch");
        } else if (current.getTime() <= new Date(current.getFullYear(), current.getMonth(), current.getDate(), 12, 50)) {
            outputText = widget.addText(schedule[`${day}-4`]);
        } else if (current.getTime() <= new Date(current.getFullYear(), current.getMonth(), current.getDate(), 14, 1)) {
            outputText = widget.addText(schedule[`${day}-5`]);
        } else {
            outputText = widget.addText(current.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"}));
        }
    } else {
        if (current.getTime() < new Date(current.getFullYear(), current.getMonth(), current.getDate(), 8, 30)) {
            outputText = widget.addText(current.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"}));
        } else if (current.getTime() <= new Date(current.getFullYear(), current.getMonth(), current.getDate(), 10, 15)) {
            outputText = widget.addText(schedule[`${day}-1`]);
        } else if (current.getTime() <= new Date(current.getFullYear(), current.getMonth(), current.getDate(), 11, 35)) {
            outputText = widget.addText(schedule[`${day}-2`]);
        } else if (current.getTime() <= new Date(current.getFullYear(), current.getMonth(), current.getDate(), 12, 25)) {
            outputText = widget.addText("Lunch");
        } else if (current.getTime() <= new Date(current.getFullYear(), current.getMonth(), current.getDate(), 13, 45)) {
            outputText = widget.addText(schedule[`${day}-4`]);
        } else if (current.getTime() <= new Date(current.getFullYear(), current.getMonth(), current.getDate(), 15, 20)) {
            outputText = widget.addText(schedule[`${day}-5`]);
        } else {
            outputText = widget.addText(current.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"}));
        }
    }
}

outputText.font = contentFont;
outputText.textColor = contentColor;

// Set widget background, unused for lock screen widget
widget.backgroundImage = files.readImage(path);

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
async function optionsMenu() {

    const options = ["Run Script", "Check for Updates", "Change Widget Background", "Enter Class Schedule"];

    const alert = new Alert();
    alert.title = "PMSS Schedule Widget by Zi Chen Cai";
    alert.message = "Select an option:";
  
    for (const option of options) {
        alert.addAction(option);
    }

    alert.addCancelAction("Cancel");
  
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
        return false;
    }

    let currentVersion = version.split(".");
    let updateVersion = uc.version.split(".");
    let cv = parseInt(currentVersion[0]) * 10000 + parseInt(currentVersion[1]) * 100 + parseInt(currentVersion[2]);
    let uv = parseInt(updateVersion[0]) * 10000 + parseInt(updateVersion[1]) * 100 + parseInt(updateVersion[2]);

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

// Set up widget
async function setBackground() {
    
    let phone;
    let img;
    let message = "Are you using this as a lock screen or home screen widget?\nIf using as a home screen widget, please take a screenshot of your blank home screen wallpaper in edit mode as this is a transparent widget.";
    let options = ["Home screen widget", "Home screen widget, transparent background", "Lock screen widget"];
    let input = await generateAlert(message, options);

    if (input === 0) {

        img = await Photos.fromLibrary();
        files.writeImage(path, img);
        Script.complete();

    } else if (input === 1) {

        message = "To use a transparent background, please take a screenshot of your blank home screen wallpaper in edit mode.";
        options = ["Screenshot taken", "Exit to take screenshot"];
        input = await generateAlert(message, options);

        if (input) {
            return;
        }

        img = await Photos.fromLibrary();
        let height = img.size.height;
        phone = phoneSizes()[height];

        if (!phone) {
            message = "Looks like this is not an iPhone screenshot, please try again.";
            await generateAlert(message, ["OK"]);
            return;
        }

        message = "What size do you want the widget to be?";
        let sizes = ["Small", "Medium", "Large"];
        let size = await generateAlert(message, sizes);
        let widgetSize = sizes[size];

        message = "Where will the widget be placed?";
        let crop = { w: "", h: "", x: "", y: "" };

        if (widgetSize === "Small") {
            crop.w = phone['Small'];
            crop.h = phone['Small'];
            let positions = ["Top Left", "Top Right", "Center Left", "Center Right", "Bottom Left", "Bottom Right"];
            let position = await generateAlert(message, positions);
            let keys = positions[position].split(' ');
            crop.x = phone[keys[1]];
            crop.y = phone[keys[0]];
        } else if (widgetSize === "Medium") {
            crop.w = phone['Medium'];
            crop.h = phone['Small'];
            crop.x = phone['Left'];
            let positions = ["Top", "Center", "Bottom"];
            let position = await generateAlert(message, positions);
            let key = positions[position];
            crop.y = phone[key];
        } else if (widgetSize === "Large") {
            crop.w = phone['Medium'];
            crop.h = phone['Large'];
            crop.x = phone['Left'];
            let positions = ["Top", "Bottom"];
            let position = await generateAlert(message, positions);
            crop.y = position ? phone['Center'] : phone['Top'];
        }

        let imgCrop = cropImage(img, new Rect(crop.x, crop.y, crop.w, crop.h));
        files.writeImage(path, imgCrop)
        Script.complete();

    } else if (input === 2) {
        message = "Setup completed";
        input = await generateAlert(message, ["OK"]);
        return;
    }

}

// Get user class schedule
async function scheduleInput() {

    let classes = [];

    for (let i = 1; i <= 2; i++) {
        for (let j = 1; j <= 5; j++) {
            if (j === 3) {
                j++;
            }
            classes.push(`Day ${i} Block ${j}`);
        }
    }

    let alert = new Alert();
    alert.title = "Schedule Input";
    alert.message = "Please enter your classes:";
    for (let block in classes) {
        alert.addTextField(classes[block]);
    }
    alert.addAction("Confirm");
    alert.addCancelAction("Cancel");

    await alert.present();

    let schedule = {};
    let k = 0;
    for (let i = 1; i <= 2; i++) {
        for (let j = 1; j <= 5; j++) {
            if (j === 3) {
                j++;
            }
            schedule[`${i}-${j}`] = alert.textFieldValue(k);
            k++;
        }
    }

    writeData(schedule);
    return schedule;

}

async function generateAlert(message, options) {
    let alert = new Alert();
    alert.message = message;
    for (const option of options) {
      alert.addAction(option);
    }
    let response = await alert.presentAlert();
    return response;
}
  
function cropImage(img, rect) {
    let draw = new DrawContext();
    draw.size = new Size(rect.width, rect.height);
    draw.drawImageAtPoint(img, new Point(-rect.x, -rect.y));
    return draw.getImage();
}

function readData() {
    const filePath = files.joinPath(files.documentsDirectory(), "data.json");
    try {
        const json = files.readString(filePath);
        return JSON.parse(json);
    } catch (e) {
        return false;
    }
}

function writeData(data) {
    const dataFile = files.joinPath(files.documentsDirectory(), "data.json");
    files.writeString(dataFile, JSON.stringify(data));
}

function phoneSizes() {
    let phones = {
        "2778": { 'Small': 510, 'Medium': 1092, 'Large': 1146, 'Left': 96, 'Right': 678, 'Top': 246, 'Center': 882, 'Bottom': 1518 },
        "2532": { 'Small': 474, 'Medium': 1014, 'Large': 1062, 'Left': 78, 'Right': 618, 'Top': 231, 'Center': 819, 'Bottom': 1407 },
        "2688": { 'Small': 507, 'Medium': 1080, 'Large': 1137, 'Left': 81, 'Right': 654, 'Top': 228, 'Center': 858, 'Bottom': 1488 },
        "1792": { 'Small': 338, 'Medium': 720, 'Large': 758, 'Left': 54, 'Right': 436, 'Top': 160, 'Center': 580, 'Bottom': 1000 },
        "2436": { 'Small': 465, 'Medium': 987, 'Large': 1035, 'Left': 69, 'Right': 591, 'Top': 213, 'Center': 783, 'Bottom': 1353 },
        "2208": { 'Small': 471, 'Medium': 1044, 'Large': 1071, 'Left': 99, 'Right': 672, 'Top': 114, 'Center': 696, 'Bottom': 1278 },
        "1334": { 'Small': 296, 'Medium': 642, 'Large': 648, 'Left': 54, 'Right': 400, 'Top': 60, 'Center': 412, 'Bottom': 764 },
        "1136": { 'Small': 282, 'Medium': 584, 'Large': 622, 'Left': 30, 'Right': 332, 'Top': 59, 'Center': 399, 'Bottom': 399 },
        "1624": { 'Small': 310, 'Medium': 658, 'Large': 690, 'Left': 46, 'Right': 394, 'Top': 142, 'Center': 522, 'Bottom': 902 },
        "2001": { 'Small': 444, 'Medium': 963, 'Large': 972, 'Left': 81, 'Right': 600, 'Top': 90, 'Center': 618, 'Bottom': 1146 }
    };
    return phones;
}
