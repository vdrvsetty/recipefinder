document.getElementById('searchBtn').addEventListener('click', () => {
  const ingredient = document.getElementById('ingredientInput').value;
  fetch(`/api/recipes?ingredient=${ingredient}`)
    .then(response => response.json())
    .then(recipes => {
      console.log("recipes - recd from server", recipes);
      window.currentRecipes = recipes; // Make it globally accessible
      const container = document.getElementById('recipeCardsContainer');
      container.innerHTML = ''; // Clear previous results
      recipes.forEach(recipe => {
        const card = `<div class="card recipe-card" style="width: 18rem;">
                        <img src="./${recipe.thumbnail}" class="card-img-top" alt="${recipe.title}">
                        <div class="card-body">
                          <h5 class="card-title">${recipe.title}</h5>
                          <p class="card-text description-scrollable">${recipe.description}</p>
                          <button class="btn btn-primary" data-recipe-id="${recipe.id}" onclick="showRecipe('${recipe.id}')">View Recipe</button>
                        </div>
                      </div>`;
        container.innerHTML += card;
      });
    });
});

function showRecipe(recipeId) {
  const recipe = window.currentRecipes.find(r => r.id === recipeId); // Use globally accessible recipes
  if (recipe) {
    const modalRecipeDetail = document.getElementById('modalRecipeDetail');
    modalRecipeDetail.innerHTML = `
      <div class="card">
        <img src="${recipe.thumbnail}" class="card-img-top" alt="${recipe.title}">
        <div class="card-body">
          <h5 class="card-title">${recipe.title}</h5>
          <p class="card-text">${recipe.description}</p>
          <p class="card-text"><strong>Steps:</strong> ${recipe.steps}</p>
        </div>
      </div>
    `;
    
    // Trigger the modal using Bootstrap's JavaScript API
    const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'), {
      keyboard: true
    });
    recipeModal.show();
  } else {
    console.error('Recipe not found');
  }
}
