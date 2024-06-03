import chalk from 'chalk';
import inquirer from 'inquirer';

interface TestResult {
    wpm: number;
    errors: number;
    typedText: string;
    accuracy: number;
    correctKeystrokes: number;
    totalKeystrokes: number;
}

export class TypingTest {
    private passage: string;
    private duration: number; // in minutes

    constructor(passage: string, duration: number) {
        this.passage = passage;
        this.duration = duration;
    }

    public async start(): Promise<TestResult> {
        console.log("\nStart typing now:");
        console.log(chalk.magentaBright.bold(this.passage));

        let typedText = '';
        const startTime = Date.now();

        while (true) {
                const response = await inquirer.prompt({
                    type: 'input',
                    name: 'typedText',
                    message: '',
                });
                typedText = response.typedText;

                if (typedText.trim().length === 0) {
                    console.log("\nPlease type something.");
                } else {
                    break;
                }
            }

            const endTime = Date.now();
            const timeTaken = (endTime - startTime) / 60000; // in minutes
            const wordsTyped = typedText.split(' ').filter(word => word.length > 0).length;
            const errors = this.calculateErrors(typedText);
            const { correctKeystrokes, totalKeystrokes } = this.calculateAccuracy(typedText);

            const wpm = wordsTyped / timeTaken;
            const accuracy = (correctKeystrokes / totalKeystrokes) * 100;

            console.log(`\nTest finished. Calculating results...`);
            return { wpm, errors, typedText, accuracy, correctKeystrokes, totalKeystrokes };
        }

    private calculateErrors(typedText: string): number {
        const passageWords = this.passage.split(' ');
        const typedWords = typedText.split(' ');

        let errors = 0;
        for (let i = 0; i < Math.min(passageWords.length, typedWords.length); i++) {
            if (typedWords[i] !== passageWords[i]) {
                errors++;
            }
        }
        errors += Math.abs(passageWords.length - typedWords.length);
        return errors;
    }

    private calculateAccuracy(typedText: string) {
        const passageLength = this.passage.length;
        const typedLength = typedText.length;

        let correctKeystrokes = 0;
        for (let i = 0; i < Math.min(passageLength, typedLength); i++) {
            if (this.passage[i] === typedText[i]) {
                correctKeystrokes++;
            }
        }
        const totalKeystrokes = typedLength;
        return { correctKeystrokes, totalKeystrokes };
    }
}