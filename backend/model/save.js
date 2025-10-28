// When adding a new recipe reference:
/*add this in backend route or controller where we handle action of user saving (liking) a recipe, in an Express route handler or a service function

 (e.g., POST /api/users/:id/saveRecipe), after you get the user and the new recipe ID.
*/
user.savedRecipes.unshift(newRecipeId); // add to front
if (user.savedRecipes.length > 10) {
  user.savedRecipes = user.savedRecipes.slice(0, 10); // keep only latest 10
}
await user.save();
// latest 10 saved recipes are kept in the user's savedRecipes array