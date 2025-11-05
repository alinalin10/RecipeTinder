// Quick Test Runner for Recipe GET Requests
// Save this as test-recipes.js and run: node test-recipes.js

// ========== CONFIGURATION ==========
const BASE_URL = 'http://localhost:4000/api/recipes';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTBhNjY1OTI0YjNlNWEwYjVkMDI1NTYiLCJpYXQiOjE3NjIyODkyNDEsImV4cCI6MTc2MjU0ODQ0MX0.veIGIE0w6fE8QjYf_lEDltWtyWYiX-bXFys4ETtRcpo';
// ===================================

const headers = {
  'Authorization': `Bearer ${AUTH_TOKEN}`,
  'Content-Type': 'application/json'
};

// ========== SEED 50 TEST RECIPES ==========
async function seedTestData() {
  console.log('🌱 Creating 50 test recipes...\n');
  
  const recipeNames = [
    'Pasta Carbonara', 'Chicken Curry', 'Apple Pie', 'Beef Stew', 'Chocolate Cake',
    'Margherita Pizza', 'Caesar Salad', 'Lasagna', 'Tiramisu', 'Pad Thai',
    'Sushi Rolls', 'French Onion Soup', 'Beef Wellington', 'Chicken Tikka Masala', 'Tacos al Pastor',
    'Mushroom Risotto', 'Greek Salad', 'Chocolate Brownies', 'Banana Bread', 'Fish and Chips',
    'Tom Yum Soup', 'Beef Bourguignon', 'Pancakes', 'Waffles', 'French Toast',
    'Eggs Benedict', 'Avocado Toast', 'Caprese Salad', 'Minestrone Soup', 'Clam Chowder',
    'Lobster Bisque', 'Shrimp Scampi', 'Chicken Parmesan', 'Eggplant Parmesan', 'Veal Piccata',
    'Salmon Teriyaki', 'Beef Tacos', 'Chicken Enchiladas', 'Cheese Quesadilla', 'Guacamole',
    'Hummus', 'Falafel', 'Shawarma', 'Biryani', 'Samosas',
    'Spring Rolls', 'Dumplings', 'Ramen', 'Pho', 'Banh Mi'
  ];
  
  let successCount = 0;
  
  for (let i = 0; i < 50; i++) {
    const recipe = {
      recipeId: `test-recipe-${i + 1}`,
      recipeType: i % 2 === 0 ? 'spoonacular' : 'userMade',
      action: i % 3 === 0 ? 'bookmarked' : 'liked',
      recipeTitle: recipeNames[i]
    };
    
    try {
      const response = await fetch('http://localhost:4000/api/recipes/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipe)
      });
      
      if (response.ok) {
        successCount++;
        process.stdout.write(`\r✓ Created ${successCount}/50 recipes`);
      }
    } catch (error) {
      console.error(`\n❌ Error creating recipe ${i + 1}:`, error.message);
    }
  }
  
  console.log('\n\n✅ Test data created!\n');
}

// ========== TEST FUNCTIONS ==========
async function testRequest(name, queryParams = '') {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${name}`);
  console.log(`${'='.repeat(50)}`);
  
  const url = `${BASE_URL}${queryParams}`;
  console.log(`URL: ${url}\n`);
  
  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('\nResponse:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.recipes) {
      console.log(`\n✓ Returned ${data.recipes.length} recipes`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Recipe API Tests...\n');
  
  await testRequest('Get all recipes', '');
  await testRequest('Get liked recipes', '?action=liked');
  await testRequest('Get bookmarked recipes', '?action=bookmarked');

  // Divide here if output too long
  await testRequest('Sort alphabetically', '?alphabetical=true');
  await testRequest('Liked + Alphabetical', '?action=liked&alphabetical=true');
  await testRequest('Page 1, limit 10', '?page=1&limit=10');
  await testRequest('Page 2, limit 10', '?page=2&limit=10');
  
  console.log('\n\n✅ All tests completed!\n');
}

// ========== RUN THE SCRIPT ==========
// OPTION 1: Seed data first, THEN run tests (uncomment line below)
seedTestData().then(() => runTests()).catch(console.error);

// OPTION 2: Just run tests on existing data (uncomment line below)
// runTests().catch(console.error);