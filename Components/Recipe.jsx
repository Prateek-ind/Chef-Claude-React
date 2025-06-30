import Markdown from "react-markdown";

const Recipe = (props) => {
  console.log(props);
  return (
    <section className="suggested-recipe-container">
      <Markdown>{props.generatedRecipe}</Markdown>
    </section>
  );
};

export default Recipe;
 