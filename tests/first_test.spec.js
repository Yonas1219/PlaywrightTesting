const { test, expect } = require("@playwright/test");


//// 1. add a new task
test("Add a new task", async ({ page }) => {
  // Navigate to the task manager page
  await page.goto("http://localhost:5500");

  // Add a new task
  await page.fill("input#task-input", "Task 1");
  await page.selectOption("select#task-priority", "low");
  await page.click('form#task-form button[type="submit"]');

  // Verify the task is added to the task list
  const taskText = await page.textContent(
    "ul#task-list li:last-child .task-text"
  );
  const priorityText = await page.textContent(
    "ul#task-list li:last-child .priority-badge"
  );
  expect(taskText).toBe("Task 1");
  //   expect(priorityText).toBe('Low Priority');
});



// 
test("Add a new task and retrieve from localStorage", async ({ page }) => {
  // Navigate to the task manager page
  await page.goto("http://localhost:5500");

  // Add a new task
  await page.fill("input#task-input", "Task 1");
  await page.selectOption("select#task-priority", "low");
  await page.click('form#task-form button[type="submit"]');

  // Wait for the task to be added
  await page.waitForSelector("ul#task-list li:last-child .task-text");

  // Retrieve tasks from localStorage
  const localStorageTasks = await page.evaluate(() => {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
  });

  // Verify the task is added to the task list
  const taskText = await page.textContent(
    "ul#task-list li:last-child .task-text"
  );
  const priorityText = await page.textContent(
    "ul#task-list li:last-child .priority-badge"
  );
  expect(taskText).toBe("Task 1");
  expect(priorityText).toBe("low");

  // Verify the task is stored in localStorage
  expect(localStorageTasks).toEqual([
    {
      text: "Task 1",
      priority: "low",
      completed: false,
    },
  ]);
});




//// 2. test to fail because task can't be null
test("Add a task without entering text", async ({ page }) => {
  // Navigate to the task manager page
  await page.goto("http://localhost:5500");
  await page.setDefaultTimeout(5000);
  // Add a new task without entering any text
  await page.selectOption("select#task-priority", "medium");
  await page.click('form#task-form button[type="submit"]');

  // Verify that the task is not added to the task list
  const taskText = await page.textContent(
    "ul#task-list li:last-child .task-text"
  );
  expect(taskText).toBeNull();
});




//// 3. completed task
test("Mark a task as completed", async ({ page }) => {
  // Navigate to the task manager page
  await page.goto("http://localhost:5500");

  // Add a new task
  await page.fill("input#task-input", "Task 1");
  await page.selectOption("select#task-priority", "low");
  await page.click('form#task-form button[type="submit"]');

  // Mark the task as completed
  await page.check("ul#task-list li:last-child .task-checkbox");

  // Verify the task is marked as completed
  const listItemClass = await page.getAttribute(
    "ul#task-list li:last-child",
    "class"
  );
  expect(listItemClass).toContain("completed");
});



// 4. edit a task
test("Edit a task", async ({ page }) => {
    // Navigate to the task manager page
    await page.goto("http://localhost:5500");
  
    // Add a new task
    await page.fill("input#task-input", "Task 1");
    await page.selectOption("select#task-priority", "low");
    await page.click('form#task-form button[type="submit"]');
  
    // Handle the prompts for editing the task text and priority
    let promptCounter = 0;
    page.on("dialog", async (dialog) => {
      promptCounter++;
      if (promptCounter === 1) {
        await dialog.accept("Task 1 (Modified)");
      } else if (promptCounter === 2) {
        await dialog.accept("medium");
      }
    });
  
    // Edit the task
  
    const editButtonSelector = "ul#task-list li:last-child .edit-button";
    await page.click(editButtonSelector);
  
    // Verify the task is edited
    const taskText = await page.textContent(
      "ul#task-list li:last-child .task-text"
    );
    const priorityText = await page.textContent(
      "ul#task-list li:last-child .priority-badge"
    );
    expect(taskText).toBe("Task 1 (Modified)");
    expect(priorityText).toBe("medium");
  });




//// 5. delete a task
test("Delete a task", async ({ page }) => {
  // Navigate to the task manager page
  await page.goto("http://localhost:5500");

  // Add a new task
  await page.fill("input#task-input", "Task 1");
  await page.selectOption("select#task-priority", "low");
  await page.click('form#task-form button[type="submit"]');

  // Delete the task
  await page.click("ul#task-list li:last-child .delete-button");

  // Verify the task is deleted from the task list
  const taskListItems = await page.$$("ul#task-list li");
  expect(taskListItems.length).toBe(0);
});



//// 6. delete all tasks
test("Delete all tasks", async ({ page }) => {
    // Navigate to the Task Manager page
    await page.goto("http://localhost:5500");
  
    // Add multiple tasks
    await addTask(page, "Task 1", "Low Priority");
    await addTask(page, "Task 2", "Medium Priority");
    await addTask(page, "Task 3", "High Priority");
  
    // Delete all tasks
    const deleteButtons = await page.$$(".delete-button");
    await Promise.all(deleteButtons.map((button) => button.click()));
  
    // Verify all tasks are deleted
    const taskListItems = await page.$$("ul#task-list li");
    expect(taskListItems.length).toBe(0);
  });




///// 7. test to fail because priority is required
test("Add a task with empty priority", async ({ page }) => {
  // Navigate to the task manager page
  await page.goto("http://localhost:5500");
  await page.setDefaultTimeout(5000);
  // Add a new task without selecting a priority
  await page.fill("input#task-input", "Task 1");
  await page.click('form#task-form button[type="submit"]');

  // Verify that the task is not added to the task list
  const taskText = await page.textContent(
    "ul#task-list li:last-child .task-text"
  );
  expect(taskText).toBeNull();
});




//// 8. test to fail because there is no such feature
test('Sort tasks by priority', async ({ page }) => {
    // Navigate to the task manager page
    await page.goto('http://localhost:5500');
    await page.setDefaultTimeout(5000);
    // Add tasks with different priorities
    await page.fill('input#task-input', 'Task 1');
    await page.selectOption('select#task-priority', 'low');
    await page.click('form#task-form button[type="submit"]');
  
    await page.fill('input#task-input', 'Task 2');
    await page.selectOption('select#task-priority', 'high');
    await page.click('form#task-form button[type="submit"]');
  
    await page.fill('input#task-input', 'Task 3');
    await page.selectOption('select#task-priority', 'medium');
    await page.click('form#task-form button[type="submit"]');
  
    // Sort tasks by priority
    await page.click('#sort-priority');
  
    // Verify the tasks are sorted by priority
    const taskPriorities = await page.$$eval('ul#task-list li .priority-badge', (badges) =>
      badges.map((badge) => badge.textContent.trim())
    );
    expect(taskPriorities).toEqual(['High Priority', 'Medium Priority', 'Low Priority']);
  });




  //// 9. test to fail because there is no such feature
  test('Do not sort tasks without clicking the sort button', async ({ page }) => {
    // Navigate to the task manager page
    await page.goto('http://localhost:5500');
    await page.setDefaultTimeout(5000);
    // Add tasks with different priorities
    await page.fill('input#task-input', 'Task 1');
    await page.selectOption('select#task-priority', 'low');
    await page.click('form#task-form button[type="submit"]');
  
    await page.fill('input#task-input', 'Task 2');
    await page.selectOption('select#task-priority', 'high');
    await page.click('form#task-form button[type="submit"]');
  
    await page.fill('input#task-input', 'Task 3');
    await page.selectOption('select#task-priority', 'medium');
    await page.click('form#task-form button[type="submit"]');
  
    // Verify the tasks are not sorted by priority
    const taskPriorities = await page.$$eval('ul#task-list li .priority-badge', (badges) =>
      badges.map((badge) => badge.textContent.trim())
    );
    expect(taskPriorities).toEqual(['Low Priority', 'High Priority', 'Medium Priority']);
  });




    //// 10. priority filter
    test('Task Manager - Priority Filter', async ({ page }) => {
    // Navigate to the Task Manager page
    await page.goto('http://localhost:5500');
  
    // Add multiple tasks with different priorities
    await addTask(page, 'Task 1', 'Low Priority');
    await addTask(page, 'Task 2', 'Medium Priority');
    await addTask(page, 'Task 3', 'High Priority');
    await addTask(page, 'Task 4', 'Low Priority');
  
    // Filter by 'High Priority'
    const filterSelect = await page.$('#task-priority');
    await filterSelect.selectOption({ label: 'High Priority' });
  
    // Verify only high priority tasks are displayed
    let tasks = await getVisibleTasks(page);
    expect(tasks.length).toBe(1);
    expect(await tasks[0].innerText()).toContain('Task 3');
  
    // Filter by 'Low Priority'
    await filterSelect.selectOption({ label: 'Low Priority' });
  
    // Verify only low priority tasks are displayed
    tasks = await getVisibleTasks(page);
    expect(tasks.length).toBe(2);
    expect(await tasks[0].innerText()).toContain('Task 1');
    expect(await tasks[1].innerText()).toContain('Task 4');
  
    // Filter by 'Medium Priority'
    await filterSelect.selectOption({ label: 'Medium Priority' });
  
    // Verify only medium priority tasks are displayed
    tasks = await getVisibleTasks(page);
    expect(tasks.length).toBe(1);
    expect(await tasks[0].innerText()).toContain('Task 2');
  });
  
  async function addTask(page, taskText, taskPriority) {
    await page.fill('input#task-input', taskText);
    await page.selectOption('select#task-priority', taskPriority);
    await page.click('form#task-form button[type="submit"]');
    await page.waitForSelector('.task-text');
  }
  
  async function getVisibleTasks(page) {
    return await page.$$('.task-text');
  }




//// 11. Add multiple tasks with the same priority
test("Add multiple tasks with the same priority", async ({ page }) => {
    // Navigate to the Task Manager page
    await page.goto("http://localhost:5500");
  
    // Add tasks with the same priority
    await addTask(page, "Task 1", "Low Priority");
    await addTask(page, "Task 2", "Low Priority");
    await addTask(page, "Task 3", "Low Priority");
  
    // Verify the tasks are added to the task list
    const taskListItems = await page.$$("ul#task-list li");
    expect(taskListItems.length).toBe(3);
  
    async function addTask(page, taskText, taskPriority) {
      await page.fill('input#task-input', taskText);
      await page.selectOption('select#task-priority', taskPriority);
      await page.click('form#task-form button[type="submit"]');
      await page.waitForSelector('.task-text');
    }
  });



  test("Verify responsiveness of the Task Manager", async ({ page }) => {
    // Set viewport to emulate a mobile device
    await page.setViewportSize({ width: 375, height: 667 });
  
    // Navigate to the task manager page
    await page.goto("http://localhost:5500");
  
    // Get the width of the task input field
    const taskInputWidth = await page.$eval("#task-input", (input) => {
      const { width } = input.getBoundingClientRect();
      return width;
    });
  
    // Get the width of the task priority select field
    const taskPriorityWidth = await page.$eval("#task-priority", (select) => {
      const { width } = select.getBoundingClientRect();
      return width;
    });
  
    // Get the width of the add task button
    const addTaskButtonWidth = await page.$eval("button[type='submit']", (button) => {
      const { width } = button.getBoundingClientRect();
      return width;
    });
  
    // Verify that the input fields and button are responsive
    expect(taskInputWidth).toBeLessThanOrEqual(375 - 40); // 375 is the viewport width and 40 is the padding of the container
    expect(taskPriorityWidth).toBeLessThanOrEqual(375 - 40);
    expect(addTaskButtonWidth).toBeLessThanOrEqual(375 - 40);
  });
  