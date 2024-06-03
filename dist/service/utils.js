import chalk from "chalk";
export function displayResults(result) {
    console.log(chalk.blueBright.bold('\n=========================================================='));
    console.log(chalk.gray.bold(`Typed Text : ${result.typedText}`));
    console.log(chalk.greenBright.bold(`\n\tTyping Speed :\t\t\t${result.wpm.toFixed(2)} WPM`));
    console.log(chalk.greenBright.bold(`\tErrors :\t\t\t${result.errors}`));
    console.log(chalk.greenBright.bold(`\tAccuracy (Keystroke-based):\t${result.accuracy.toFixed(2)}%`));
    console.log(chalk.greenBright.bold(`\tCorrect Keystrokes :\t\t${result.correctKeystrokes}`));
    console.log(chalk.greenBright.bold(`\tTotal Keystrokes :\t\t${result.totalKeystrokes}\n`));
    console.log(chalk.blueBright.bold('==========================================================\n'));
}
