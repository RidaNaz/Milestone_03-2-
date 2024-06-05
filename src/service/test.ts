import chalk from 'chalk';

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
        const endTime = startTime + this.duration * 60000;

        process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf-8');

    const inputPromise = new Promise<string>((resolve) => {
        process.stdin.on('data', (key: string) => {
            if (key === '\u0003') { // Ctrl+C to exit
                process.exit();
            } else if (key === '\r') { // Enter key to submit
                process.stdin.setRawMode(false);
                process.stdin.pause();
                resolve(typedText);
            } else {
                typedText += key;
                process.stdout.write(key); // Display typed character
            }
        });
    });

    const timerPromise = new Promise<string>((resolve) => {
        setTimeout(() => {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            resolve(typedText);
        }, this.duration * 60000);
    });

    typedText = await Promise.race([inputPromise, timerPromise]);
    const finalEndTime = Date.now();

    const timeTaken = (finalEndTime - startTime) / 60000; // in minutes
    const wordsTyped = typedText.split(/\s+/).length;
    const errors = this.calculateErrors(typedText);
    const { correctKeystrokes, totalKeystrokes } = this.calculateAccuracy(typedText);

    const wpm = wordsTyped / timeTaken;
    const accuracy = ((totalKeystrokes - errors) / totalKeystrokes) * 100; // Calculate accuracy based on total keystrokes

    console.log(`\nTest finished. Calculating results...`);
    return { wpm, errors, typedText, accuracy, correctKeystrokes, totalKeystrokes };
}

    private calculateErrors(typedText: string): number {
        let errors = 0;
        const typedWords = typedText.split(/\s+/);
        const passageWords = this.passage.split(/\s+/);

        for (let i = 0; i < Math.min(passageWords.length, typedWords.length); i++) {
            if (typedWords[i] !== passageWords[i]) {
                errors++;
            }
        }

        // Count any extra or missing words as errors
        errors += Math.abs(passageWords.length - typedWords.length);

        return errors;
    }

    private calculateAccuracy(typedText: string): { correctKeystrokes: number, totalKeystrokes: number } {
        const passageChars = this.passage.replace(/\s/g, '').split('');
        const typedChars = typedText.replace(/\s/g, '').split('');
    
        let correctKeystrokes = 0;
        for (let i = 0; i < Math.min(passageChars.length, typedChars.length); i++) {
            // Count correct keystrokes
            if (typedChars[i] === passageChars[i]) {
                correctKeystrokes++;
            }
        }
    
        const totalKeystrokes = passageChars.length; // Total number of characters in the passage
        return { correctKeystrokes, totalKeystrokes };
    }
}