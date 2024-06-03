interface TestResult {
    wpm: number;
    errors: number;
    typedText: string;
    accuracy: number;
    correctKeystrokes: number;
    totalKeystrokes: number;
}

export function displayResults(result: TestResult) {
    console.log(`\nTyping Speed: ${result.wpm.toFixed(2)} WPM`);
    console.log(`Errors: ${result.errors}`);
    console.log(`Typed Text: ${result.typedText}`);

    const totalWords = result.typedText.split(' ').filter(word => word.length > 0).length;
    const correctWords = Math.max(0, totalWords - result.errors);
    const wordAccuracy = totalWords > 0 ? (correctWords / totalWords) * 100 : 0;

    // console.log(`Accuracy (Word-based): ${wordAccuracy.toFixed(2)}%`);
    console.log(`Accuracy (Keystroke-based): ${result.accuracy.toFixed(2)}%`);
    console.log(`Correct Keystrokes: ${result.correctKeystrokes}`);
    console.log(`Total Keystrokes: ${result.totalKeystrokes}`);
}