#!/usr/bin/env node

import inquirer from 'inquirer';
import { UserService } from './service/user.js';
import { TypingTest } from './service/test.js';
import { displayResults } from './service/utils.js';
import chalk from 'chalk';

export class CLIApp {
    private userService: UserService;
    private userName: string = '';

    constructor() {
        this.userService = new UserService();
    }

    public async run() {
        console.clear();
        console.log(chalk.blueBright.bold('=========================================================='));
        console.log(chalk.greenBright.bold("\tWelcome to the Online Typing Speed Tester!"));
        console.log(chalk.blueBright.bold('==========================================================\n'));
        console.log(chalk.gray.bold("This application will help you measure and improve your typing speed and accuracy.\n"));

        while (true) {
            const action = await this.getMainMenuAction();

            if (action === 'Signup') {
                await this.handleSignup();
            } else if (action === 'Login') {
                await this.handleLogin();
            } else if (action === 'Exit') {
                console.log(chalk.bgCyanBright.bold("\nThank you for using the Online Typing Speed Tester!\n"));
                console.log(chalk.bgMagentaBright.bold("Keep practicing and improving your typing skills. Goodbye!"));
                break;
            }

            if (this.userName !== '') {
                const startTestAction = await this.getStartTestAction();
                if (startTestAction === 'Start Test') {
                    await this.handleStartTest();
                } else {
                    this.userName = ''; // Clear the username to log out
                }
            }
        }
    }

    private async getMainMenuAction(): Promise<string> {
        const { chosenAction } = await inquirer.prompt({
            type: 'list',
            name: 'chosenAction',
            message: 'What would you like to do?',
            choices: ['Signup', 'Login', 'Exit'],
        });
        return chosenAction;
    }

    private async handleSignup() {
        const user = await this.userService.signup();
    }

    private async handleLogin() {
        const user = await this.userService.login();
        if (user) {
            console.log(chalk.magenta.bold(`Hello, ${user.name}! You have successfully logged in.\n`));
            this.userName = user.name;
            await this.warmUpExercise();
        }
    }

    private async warmUpExercise() {
        console.log(chalk.cyanBright.bold("Make sure to place your fingers on the correct keys.\n"));
        console.log(chalk.magentaBright.bold("Warm-up Exercise: Type the following sequence as fast as you can."));
        console.log(chalk.gray.bold("\tasdf jkl;\n"));
        let typedText: string;
        while (true) {
            const response = await inquirer.prompt({
                type: 'input',
                name: 'typedText',
                message: 'Type the warm-up sequence:',
            });
            typedText = response.typedText;
            if (typedText.trim() !== 'asdf jkl;') {
                console.log(chalk.redBright.bold("\nPlease type the sequence 'asdf jkl;' correctly.\n"));
            } else {
                break;
            }
        }
        console.log(chalk.greenBright.bold("\nWarm-up exercise completed!\n"));
    }

    private async getStartTestAction(): Promise<string> {
        const { chosenAction } = await inquirer.prompt({
            type: 'list',
            name: 'chosenAction',
            message: 'What would you like to do?',
            choices: ['Start Test', 'Back'],
        });
        return chosenAction;
    }

    private async handleStartTest() {
        const { duration } = await inquirer.prompt({
            type: 'list',
            name: 'duration',
            message: 'Select test duration:',
            choices: ['1 minute', '3 minutes'],
        });

        const { difficulty } = await inquirer.prompt({
            type: 'list',
            name: 'difficulty',
            message: 'Select difficulty level:',
            choices: ['Basic Sentences', 'Random Words', 'Technical Text'],
        });

        const passage = this.getTestPassage(difficulty);
        const durationInMinutes = parseInt(duration.split(' ')[0]);

        const test = new TypingTest(passage, durationInMinutes);
        const result = await test.start();
        displayResults(result);

        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'What would you like to do next?',
            choices: ['Restart test', 'Back'],
        });

        if (action === 'Restart test') {
            await this.handleStartTest(); // Restart the test
        } else {
            return; // Return to the main menu without doing anything // Exit the program
        }
    }

    private getTestPassage(difficulty: string): string {
        if (difficulty === 'Basic Sentences') {
            const basicSentences = [
                "The quick brown fox jumps over the lazy dog.\n",
                "She sells seashells by the seashore.\n",
                "He who hesitates is lost.\n",
                "A stitch in time saves nine.\n"
            ];
            return this.getRandomItemFromArray(basicSentences);
        } else if (difficulty === 'Random Words') {
            const randomWords = [
                "apple banana orange grape cherry pear peach\n",
                "cat dog elephant lion tiger giraffe zebra\n",
                "table chair desk lamp sofa bed cupboard\n",
                "sun moon stars sky clouds rain snow\n"
            ];
            return this.getRandomItemFromArray(randomWords);
        } else {
            const technicalTexts = [
                "In computer programming, the term 'syntax' refers to the rules that define the structure of a programming language.\n",
                "A variable is a storage location and an associated symbolic name (an identifier) which contains some known or unknown quantity or information, a value.\n",
                "An array is a data structure consisting of a collection of elements, each identified by at least one array index or key.\n",
                "Recursion is a method of solving problems where the solution depends on solutions to smaller instances of the same problem.\n"
            ];
            return this.getRandomItemFromArray(technicalTexts);
        }
    }
    
    private getRandomItemFromArray(array: string[]): string {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
}

const app = new CLIApp();
app.run();