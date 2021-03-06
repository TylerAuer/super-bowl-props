# Super Bowl Props Site

I threw this site together across a couple of evenings the week of Super Bowl LIV (SF VS KC). It displays results for a game I run during the Super Bowl each year. There's a lot that can be improved (see below), but it got the job done.

> [See it live!](http://liv.mathfireworks.com/)

## About the Game

For the last five years, I've run a free game during the Super Bowl. I go through the silly and serious betting options (called "props") for the game, and give others a chance to try to pick the correct result.

Since each result of a prop bet has varying probabilities of occurring, I use the betting odds to assign each outcome a point value between 1 and 99. Less likely events are worth more points.

## What This Site Does

1. Participants submit their picks through a **Google Form** which then dumps the results **into a Google Sheet**.
2. This site **accesses** the Google Sheet through the **Google Drive v4 API** using an API key and concatenated ranges in [A1 Notation](https://developers.google.com/sheets/api/guides/concepts#a1_notation)
3. Each person's picks are used to create a JavaScript Object
4. As I enter the results of each prop into the spreadsheet, an array is also created with the results of each prop
5. Functions are used to calculate statistics for each participant
6. Functions create DOM elements using Bootstrap for responsive styling

## How to Improve This Site

- Clearer UI for finding yourself in the table of results
- More obvious button or link for expanding the results and seeing a participant's data
- Automatic reloading and rebuilding of the table and an icon signifying that the API info is loading
- Notifications when propositions are resolved or the results are changed
- Animated expansion of details

## What I Learned by Building This

- Accessing Google Drive files through their API
- Using JavaScript Objects and Constructor functions
- Simple RegEx
- Stronger understanding of array methods like: `.reduce()`, `.map()`, and `.join()`

## What I Would do Differently

- Reorganize locations of methods to be more logical and closer to where they are used
- Make the HTML element creation easier to read by using String [Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
- Not try to build this in just a few nights, so I can better plan, structure, and comment my code
