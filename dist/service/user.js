import chalk from 'chalk';
import inquirer from 'inquirer';
import * as uuid from 'uuid';
import validator from 'validator';
export class UserService {
    users = [];
    currentUser = null;
    async signup() {
        let name;
        let email;
        let password;
        while (true) {
            const response = await inquirer.prompt({ type: 'input', name: 'name', message: 'Enter your name:' });
            name = response.name;
            if (!name || name.trim().length === 0) {
                console.log(chalk.redBright.bold('\nName cannot be empty.\n'));
            }
            else {
                break;
            }
        }
        while (true) {
            const response = await inquirer.prompt({ type: 'input', name: 'email', message: 'Enter your email:' });
            email = response.email;
            if (!validator.isEmail(email)) {
                console.log(chalk.redBright.bold('\nPlease enter a valid email address.\n'));
            }
            else {
                break;
            }
        }
        while (true) {
            const response = await inquirer.prompt({ type: 'password', name: 'password', message: 'Enter your password:' });
            password = response.password;
            if (password.length < 6) {
                console.log(chalk.redBright.bold('\nPassword must be at least 6 characters long.\n'));
            }
            else {
                break;
            }
        }
        if (this.users.some(u => u.email === email)) {
            console.log(chalk.redBright.bold('\nUser already exists, Signup again!\n'));
            return this.signup();
        }
        const user = {
            id: uuid.v4(),
            name: name,
            email: email,
            password: password,
        };
        this.users.push(user);
        this.currentUser = user;
        console.log(chalk.greenBright.bold('\nUser registered successfully!\n'));
        return user;
    }
    async login() {
        const answers = await inquirer.prompt([
            { type: 'input', name: 'email', message: 'Enter your email:' },
            { type: 'password', name: 'password', message: 'Enter your password:' }
        ]);
        const user = this.users.find(u => u.email === answers.email && u.password === answers.password);
        if (user) {
            this.currentUser = user;
            console.log(chalk.greenBright.bold('\nLogin successful!\n'));
            return user;
        }
        else {
            console.log(chalk.redBright.bold('\nInvalid credentials!\n'));
            return null;
        }
    }
    getCurrentUser() {
        return this.currentUser;
    }
}
