// const { chromium } = require('playwright');
// const { test, expect } = require('@playwright/test');

// test.describe('Task Manager App', () => {
//   let browser;
//   let page;

//   test.beforeAll(async () => {
//     browser = await chromium.launch();
//   });

//   test.afterAll(async () => {
//     await browser.close();
//   });

//   test.beforeEach(async () => {
//     const context = await browser.newContext();
//     page = await context.newPage();
//     await page.goto('http://localhost:5000');
//   });

//   test.afterEach(async () => {
//     await page.context().close();
//   });

//   test('should create a new task', async () => {
//     await page.fill('.task-input', 'New Task');
//     await page.click('.task-form button[type="submit"]');

//     const taskElement = await page.waitForSelector('.single-task');
//     expect(taskElement).not.toBeNull();
//   });

//   test('should delete a task', async () => {
//     const taskElement = await page.waitForSelector('.single-task');
//     const deleteButton = await taskElement.$('.delete-btn');
//     const taskId = await (await deleteButton.getAttribute('data-id'));

//     await page.click('.delete-btn');

//     await page.waitForFunction(
//       (taskId) => {
//         const task = document.querySelector(`.single-task[data-id="${taskId}"]`);
//         return task === null;
//       },
//       {},
//       taskId
//     );

//     const deletedTaskElement = await page.$(`.single-task[data-id="${taskId}"]`);
//     expect(deletedTaskElement).toBeNull();
//   });
// });
