import React from "react";
import { languages } from "./languages";
import { clsx } from "clsx";

export default function AssemblyEndgame() {
    const [currentWord, setCurrentWord] = React.useState("religionist");
    const [guessedLetters, setGuessedLetters] = React.useState([]);

    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    function addGuessedLetter(letter) {
        setGuessedLetters((prevLetters) => {
            return prevLetters.includes(letter) ?
                prevLetters :
                [...prevLetters, letter];
        });
    }

    const languageElements = languages.map((language) =>
        <div key={language.name}
            className="language"
            style={{
                backgroundColor: language.backgroundColor,
                color: language.color
            }}>
            {language.name}
        </div>
    );


    const wrongGuesses = guessedLetters.filter(letter => !currentWord.includes(letter)).length;

    const letters = currentWord.split("").map((letter, indx) => (
        <span key={indx} className="letter">
            {guessedLetters.includes(letter) ? letter.toUpperCase() : "_"}
        </span>
    ));

    const alphabetLetters = alphabet.split("").map((letter, indx) => {
        const isGuessed = guessedLetters.includes(letter);
        const isCorrect = isGuessed && currentWord.includes(letter);
        const isWrong = !isCorrect && isGuessed;

        const className = clsx({
            correct: isCorrect,
            wrong: isWrong,
        });

        return (
            <button
                key={indx}
                onClick={() => addGuessedLetter(letter)}
                className={className}
                disabled={isGuessed}
            >
                {letter.toUpperCase()}
            </button>
        );
    });

    return (
        <main>
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
            </header>
            <section className="game-status">
                <h2>You win!</h2>
                <p>Well done! 🎉</p>
            </section>
            <section className="languages">
                {languageElements}
            </section>
            <section className="word">
                {letters}
            </section>
            <section className="keyboard">
                {alphabetLetters}
            </section>
            <button className="new-game">New Game</button>
        </main >
    );
}