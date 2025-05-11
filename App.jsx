import React from "react";
import { languages } from "./languages";
import { clsx } from "clsx";
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import gameWonSound from './sounds/win.mp3';
import wrongGuessSound from './sounds/error01.mp3';
import correctGuessSound from './sounds/correct-ding.mp3';
import gameLostSound from './sounds/lost-game-over.mp3';
import newGameSound from './sounds/game-start.wav';
import { getFarewellText, getRandomWord } from "./utils";

export default function AssemblyEndgame() {
    // State values
    const [currentWord, setCurrentWord] = React.useState(() => getRandomWord());
    const [guessedLetters, setGuessedLetters] = React.useState([]);
    // const [lastGuessWasWrong, setLastGuessWasWrong] = React.useState(false);
    // const [lostLanguage, setLostLanguage] = React.useState(null);
    const { width, height } = useWindowSize();

    // Preload audio instances
    const correctAudio = React.useMemo(() => new Audio(correctGuessSound), []);
    const wrongAudio = React.useMemo(() => new Audio(wrongGuessSound), []);
    const winAudio = React.useMemo(() => new Audio(gameWonSound), []);
    const loseAudio = React.useMemo(() => new Audio(gameLostSound), []);
    const newGameAudio = React.useMemo(() => new Audio(newGameSound), []);

    // Derived values
    const numGuessesLeft = languages.length - 1;
    const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length;
    const isGameLost = wrongGuessCount >= languages.length - 1;
    const isGameWon = !isGameLost && currentWord.split("").every(letter => guessedLetters.includes(letter));
    const isGameOver = isGameLost || isGameWon;
    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

    //Static values
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    function addGuessedLetter(letter) {
        setGuessedLetters((prevLetters) => {
            if (prevLetters.includes(letter)) return prevLetters;


            // Play sounds based on correct or wrong guesses
            if (currentWord.includes(letter)) {
                correctAudio.play();
            } else {
                wrongAudio.play();
            }

            return [...prevLetters, letter];
        });
    }

    function handleNewGame() {
        setGuessedLetters([]);
        setCurrentWord(getRandomWord());
        newGameAudio.play();
    }

    const languageElements = languages.map((language, index) => {
        const isLanguageLost = index < wrongGuessCount;

        const classname = clsx("chip", isLanguageLost && "lost");

        return (
            <span key={language.name}
                className={classname}
                style={{
                    backgroundColor: language.backgroundColor,
                    color: language.color
                }}>
                {language.name}
            </span>
        );
    });

    const letters = currentWord.split("").map((letter, indx) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter);
        const letterClassName = clsx(
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        );
        return (
            <span key={indx} className={letterClassName}>
                {shouldRevealLetter ? letter.toUpperCase() : "_"}
            </span>
        );
    });

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
                disabled={isGameOver}
                aria-disabled={guessedLetters.includes(letter)}
                aria-label={`Letter ${letter}`}
            >
                {letter.toUpperCase()}
            </button>
        );
    });

    const gameStatusClass = clsx("game-status", {
        "won": isGameWon,
        "lost": isGameLost,
        "farewell": !isGameOver && isLastGuessIncorrect,
    });

    function renderGameStatus() {
        if (!isGameOver) {
            if (!isGameOver && isLastGuessIncorrect) {
                return (
                    <p className="farewell-message"
                    >
                        {getFarewellText(languages[wrongGuessCount - 1].name)}
                    </p>
                );
            } else { return null; }
        }

        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            );
        } else {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            );
        }
    }

    React.useEffect(() => {
        if (isGameWon) {
            winAudio.play();
        } else if (isGameOver) {
            loseAudio.play();
        }
    }, [isGameWon, isGameOver, winAudio, loseAudio]);

    return (
        <main>
            {isGameWon && <Confetti width={width} height={height} />}
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
            </header>
            <section
                aria-live="polite"
                role="status"
                className={gameStatusClass}
            >
                {renderGameStatus()}
            </section>
            <section className="languages">
                {languageElements}
            </section>
            <section className="word">
                {letters}
            </section>

            {/* Combined visually-hidden aria-live region for status updates */}
            <section
                aria-live="polite"
                role="status"
                className="sr-only"
            >
                <p>
                    {currentWord.includes(lastGuessedLetter) ?
                        `Correct! The letter ${lastGuessedLetter} is in the word.` :
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
                </p>

                <p>Current word: {currentWord.split("").map(letter =>
                    guessedLetters.includes(letter) ? letter + "." : "blank")
                    .join(" ")}</p>
            </section>

            <section className="keyboard">
                {alphabetLetters}
            </section>

            {isGameOver &&
                <button
                    className="new-game"
                    onClick={handleNewGame}
                > New Game
                </button>}
        </main >
    );
}