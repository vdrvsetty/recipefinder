document.addEventListener('DOMContentLoaded', function() {
  let recipesData = {}; // Store recipes data by ID

  document.getElementById('searchBtn').addEventListener('click', () => {
      const ingredient = document.getElementById('ingredientInput').value;
      fetch(`/api/searchRecipes?ingredient=${ingredient}`)
          .then(response => response.json())
          .then(recipes => {
              const container = document.getElementById('recipeCardsContainer');
              container.innerHTML = ''; // Clear previous results
              recipes.forEach(recipe => {
                  recipesData[recipe.id] = recipe; // Store recipe data by ID
                  const card = `<div class="card recipe-card" style="width: 25rem;">
                                    <img src="${recipe.thumbnail}" class="card-img-top" alt="${recipe.title}">
                                    <div class="card-body">
                                        <h5 class="card-title">${recipe.title}</h5>
                                        <p class="limited-text card-text">${recipe.description}</p>
                                        <button class="btn btn-primary" data-recipe-id="${recipe.id}">View Recipe</button>
                                    </div>
                                  </div>`;
                  container.innerHTML += card;
              });

              // Add click event listeners to the newly added buttons
              document.querySelectorAll('.btn-primary').forEach(button => {
                  button.addEventListener('click', function() {
                      const recipeId = this.getAttribute('data-recipe-id');
                      showRecipe(recipesData[recipeId]);
                  });
              });
          }).catch(error => console.error('Error fetching recipes:', error));
  });
console.log("new log");
  window.showRecipe = function(recipe) {
      const detailContainer = document.getElementById('recipeDetailContainer');
      detailContainer.innerHTML = ''; // Clear previous details
      let stepsHtml = recipe.steps.map(step => `<li>${step.step}</li>`).join('');
      const recipeDetailHtml = `
          <div class="card">
              <img src="${recipe.thumbnail}" class="card-img-top" alt="${recipe.title}">
              <div class="card-body modal-card-body">
                  <h5 class="card-title">${recipe.title}</h5>
                  <p class="card-text">${recipe.description}</p>
                  <ol class="card-text"><strong>Steps:</strong>${stepsHtml}</ol>
              </div>
          </div>
      `;
      detailContainer.innerHTML = recipeDetailHtml;
      // Trigger the modal to show
      new bootstrap.Modal(document.getElementById('recipeDetailModal')).show();
  };
});
