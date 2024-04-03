const express = require('express');
const app = express();
const PORT = 3500;
const recipes = require('./recipes.json');

app.use(express.static('public'));
app.use(express.json());

app.get('/api/recipes', (req, res) => {
    const ingredient = req.query.ingredient.toLowerCase(); // Convert query to lower case
    const filteredRecipes = recipes.filter(recipe => 
      recipe.ingredients.some(ing => ing.toLowerCase().includes(ingredient))
    );
    res.json(filteredRecipes);
  });
  

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
