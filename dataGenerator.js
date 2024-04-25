const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

exports.DataGenerator = class DataGenerator{
    constructor() {
        this.validDataGenerator();
    }
        
    async validDataGenerator() {
        // Names
        this.firstName = faker.person.firstName();
        this.middleName = faker.person.middleName();
        this.surname = faker.person.lastName();
        // Username, Email Address and Password
        this.username = faker.internet.userName({ firstName: this.firstName, lastName: this.surname});
        this.email = faker.internet.email({firstName: this.firstName, lastName: this.surname});
        this.password = faker.internet.password();
        // Date of Birth and Sex - Probably use formattedDateOfBirth
        this.dateOfBirth = faker.date.birthdate();
        this.formatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        this.formattedDateOfBirth = this.formatter.format(this.dateOfBirth);
        this.sex = faker.person.sex();
        // Phone Number
        this.phoneNumber = faker.helpers.fromRegExp(/07[0-9]{3}[0-9]{6}/);
        // Job
        this.jobType = faker.person.jobType();
        this.jobTitle = faker.person.jobTitle();
        // Finance
        this.creditCardNumber = faker.finance.creditCardNumber();
        this.bankAccountNumber = faker.finance.accountNumber();
        // Address
        this.streetAdress = faker.location.streetAddress();
        this.city = faker.location.city();
        this.postCode = faker.location.zipCode();
        this.country = faker.location.country();
    }

    async generateLoginData() {
        return [
            this.username, 
            this.password,
            this.email,
            await this.generateInvalidUsername(),
            await this.generateInvalidPassword(),
            await this.generateInvalidEmail()
        ];
    }

    async generateSomeInvalidLoginData() {
        const randomInvalidNumber = Math.floor(Math.random() * 3);

        let loginDataArray = [
            this.username,
            this.password,
            this.email
        ];

        switch (randomInvalidNumber) {
            case 0:
                loginDataArray[0] = await this.generateInvalidUsername();
                break;
            case 1:
                loginDataArray[1] = await this.generateInvalidPassword();
                break;
            default:
                loginDataArray[2] = await this.generateInvalidEmail();
                break;
        }

        return loginDataArray;

    }

    async generateUserProfileData() {
        return false;
    }

    async generateInvalidEmail() {
        const invalidEmailType = Math.floor(Math.random() * 5);
        
        switch (invalidEmailType) {
            case 0: // no @ sign
                return this.email.replace('@', '');
            case 1: // multiple @ sign
                return this.email.replace('@', '@@@');
            case 2: // no front part
                return '@' + faker.internet.domainName();
            case 3: // no ending part
                return this.username + '@';
            default: // spaces at start and in middle
                return ' ' + this.username + ' @ ' + faker.internet.domainName();
        }
    }

    async generateInvalidUsername() {
        const invalidUsernameType = Math.floor(Math.random * 4);

        switch (invalidUsernameType) {
            case 0: // too short
                return 'a';
            case 1: // too long
                return 'abcdefghijklmnopqrstuvwxyz';
            case 2: // contain special characters
                return this.username + '!"£$'
            default: // contains spaces
                return this.firstName + ' ' + this.surname;
        }
    }

    async generateInvalidPhoneNumber() {
        const invalidPhoneNumberType = Math.floor(Math.random() * 3);

        switch (invalidPhoneNumberType) {
            case 0: // too short
                return '1234';
            case 1: // letters/symbols added
                return '12ed-.3tg4';
            default: // wrong format/spaces in it
                return '12345 67890';
        }
    }

    async generateInvalidPassword() {
        const invalidPasswordType = Math.floor(Math.random() * 4);

        switch (invalidPasswordType) {
            case 0: // too short
                return 'a';
            case 1: // too long
                return 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
            case 2: // not meet parameters
                return 'potato';
            default: // common password
                return 'password';
        }
    }

}