const widget = new ListWidget();

// Define the widget dimensions
widget.setPadding(10, 10, 10, 10);
widget.useDefaultPadding();
widget.spacing = 5;

// Define the text styles
const titleFont = Font.boldSystemFont(18);
const titleColor = new Color("#FFFFFF"); // Customize the title color if needed

const contentFont = Font.systemFont(16);
const contentColor = new Color("#FFFFFF"); // Customize the content color if needed

// Add the title label
const titleLabel = widget.addText("Title");
titleLabel.font = titleFont;
titleLabel.textColor = titleColor;

// Add the output text to the widget
const outputLabel = widget.addText("Text");
outputLabel.font = contentFont;
outputLabel.textColor = contentColor;

// Set the widget background color
widget.backgroundColor = new Color("#000000")

// Display the widget
if (config.runsInWidget) {
    // For widget display, present the widget
    Script.setWidget(widget);
} else {
    // For script execution, log the widget's text
    console.log(widget.text);
}