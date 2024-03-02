import './Instructions.css'

const Instructions = ({ instructions }) => {
    return (
      <div className="instructions-container"> {/* Added class name */}
        {instructions.map((instruction, index) => (
          <div key={index}>
            <h2>Step {index + 1}:</h2>
            <p>{instruction}</p>
          </div>
        ))}
      </div>
    );
  };

export default Instructions;