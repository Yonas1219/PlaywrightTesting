module.exports = {
    projects: [
      {
        name: 'Chrome',
        playwright: 'chromium',
        launchOptions: {
          headless: true,
          timeout: 3000, // 10 seconds timeout for various operations
        },
        contextOptions: {
          timeout: 3000, // 5 seconds timeout for context-related operations
        },
      },
      // Add more projects for other browsers if needed
    ],
  };
  