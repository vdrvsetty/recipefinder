const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3500;

app.use(express.static('public'));
app.use(express.json());

const SPOONACULAR_API_KEY = 'your_api_key_here'; // Make sure to replace with your actual API key

// Function to fetch analyzed instructions for a single recipe
async function fetchAnalyzedInstructions(id) {
    const url = `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${SPOONACULAR_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
    }
    return response.json();
}

app.get('/api/searchRecipes', async (req, res) => {
    const { ingredient } = req.query;
    // Initial search URL
    const searchUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${ingredient}&apiKey=${SPOONACULAR_API_KEY}&number=5&addRecipeInformation=true`;

    try {
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        const recipesWithDetails = await Promise.all(searchData.results.map(async (recipe) => {
            try {
                // Fetch analyzed instructions for each recipe
                const instructions = await fetchAnalyzedInstructions(recipe.id);
                // Simplify the instructions data structure for easier use in the client
                const steps = instructions.length > 0 ? instructions[0].steps.map(step => ({ number: step.number, step: step.step })) : [];
                return {
                    id: recipe.id,
                    title: recipe.title,
                    thumbnail: recipe.image,
                    description: recipe.summary, // Assuming summary gives a short description
                    steps: steps // Include the simplified steps
                };
            } catch (error) {
                console.error(`Failed to fetch instructions for recipe ${recipe.id}: ${error}`);
                return null; // In case of error, return null and filter it out later
            }
        }));

        // Filter out any null values resulting from failed instructions fetches
        const validRecipes = recipesWithDetails.filter(recipe => recipe !== null);
        res.json(validRecipes);
    } catch (error) {
        console.error(`Failed to search recipes: ${error}`);
        res.status(500).json({ message: "Error fetching recipes" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
