const { test, expect } = require('@playwright/test');
const { chromium } = require('playwright');
const { faker } = require('@faker-js/faker');

exports.ActionClass = class ActionClass {
    //constructor - ran before everything else in the class
    constructor(page) {
        this.page = page;
    }

    async goToHomePage() {
        await this.page.goto('https://www.cardiffrugby.wales/');
    }


    //creates a function that goes to a selector and checks if the expected text is there
    //both the selector and expected text are passed as arguments into the function, if there is a known selector
    async getTextAndCheck(specificText, selector = '') {
        //defines a variable but assigns no value - will be boolean though
        let isTextVisible;

        //if statement that takes the argument if there was a given selector or not
        if (selector) {
            //this line stores a boolean value in the variable isTextVisible
            //the line checks if the specified text is at the location of the given selector, and returns true if it is visible
            isTextVisible = await this.page.isVisible(`${selector}:has-text("${specificText}")`);
            //this line logs a statement to the console
            //it prints the specific text in the specific selector is either visible or not visible, depending on the value of isTextVisible
            //a ternary operator is used '?' - like a mini if statement
            console.log(`"${specificText}" in selector "${selector}" is ${isTextVisible ? 'visible' : 'not visible'}`);
            //embedded if statement that throws the test if the text is not visible
            if (!isTextVisible) {
                throw new Error('failed');
            }
            //the else of the if statement which is executed of there is no given selector
        } else {
            //this line again stores a boolean value in isTextVisible
            //it checks if the specific text is visible anywhere on the page
            isTextVisible = await this.page.isVisible(`text="${specificText}"`);
            //similarly to in if statement above - logs message to console depending on value of isTextVisible
            console.log(`Text "${specificText}" is ${isTextVisible ? 'visible' : 'not visible'}`);
            //
            if (!isTextVisible) {
                throw new Error('failed');
            }
        }
        //returns the value of isTextVisible
        return isTextVisible;
    }


    async clickLinkAndCheck(page, selector, expectedURL) {

        await page.goto('https://www.cardiffrugby.wales/');
        //click link using selector
        await page.click(selector);
        //after clicked takes the url from current page
        const currentURL = await page.url();
        console.log(currentURL);
        //checks against expected url
        await expect.soft(page).toHaveURL(expectedURL);

    }

    async clickLinkAndCheckNewTab(selector, startingURL, expectedURL) {

        const browser = await chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(startingURL);

        const pagePromise = context.waitForEvent('page');
        await page.click(selector);

        const newPage = await pagePromise;

        const currentURL = newPage.url();
        console.log(currentURL);

        await expect.soft(newPage).toHaveURL(expectedURL);

    }

    

}