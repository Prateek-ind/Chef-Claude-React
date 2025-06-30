import { useEffect, useRef, useState } from "react";
import Recipe from "./Recipe";
import IngredientsList from "./IngredientsList";
import { getRecipeFromMistral, getRecipeFromOpenRouter } from "../ai";

const Main = () => {
  const [ingredients, setIngredients] = useState([]);

  const [generatedRecipe, setGeneratedRecipe] = useState("");
  const recipeSection = useRef(null);

  function addIngredient(formData) {
    // console.log("Form Submitted");
    const newIngredient = formData.get("ingredient");
    setIngredients((prevIngredient) => [...prevIngredient, newIngredient]);
  }
 
  async function getRecipe() {
    const recipe = await getRecipeFromOpenRouter(ingredients);
    setGeneratedRecipe(recipe);
  }

  useEffect(() => {
    if (generatedRecipe !== "" && recipeSection !== null) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [generatedRecipe]);

  return (
    <main>
      <form action={addIngredient} className="add-ingredient">
        <input
          type="text"
          aria-label="Add ingredients"
          placeholder="e.g. Oregano"
          name="ingredient"
        />
        <button>Add Ingredients</button>
      </form>
      {ingredients.length > 0 && (
        <IngredientsList
          ref={recipeSection}
          ingredients={ingredients}
          getRecipe={getRecipe}
        />
      )}
      {generatedRecipe && (
        <Recipe
          generatedRecipe={generatedRecipe}
          handleClick={getRecipeFromMistral}
        />
      )}
    </main>
  );
};

export default Main;
