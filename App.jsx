import React from "react";
import { languages } from "./languages";
import { clsx } from "clsx";
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import gameWonSound from './sounds/win.mp3';
import wrongGuessSound from './sounds/error01.mp3';
import correctGuessSound from './sounds/correct-ding.mp3';
import gameLostSound from './sounds/lost-game-over.mp3';
import newGameSound from './sounds/game-start.mp3';


export default function AssemblyEndgame() {
    const [currentWord, setCurrentWord] = React.useState("mercy");
    const [guessedLetters, setGuessedLetters] = React.useState([]);
    const { width, height } = useWindowSize();

    // Preload audio instances
    const correctAudio = React.useMemo(() => new Audio(correctGuessSound), []);
    const wrongAudio = React.useMemo(() => new Audio(wrongGuessSound), []);
    const winAudio = React.useMemo(() => new Audio(gameWonSound), []);
    const loseAudio = React.useMemo(() => new Audio(gameLostSound), []);
    const newGameAudio = React.useMemo(() => new Audio(newGameSound), []);

    const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length;
    const isGameLost = wrongGuessCount >= languages.length - 1;
    const isGameWon = !isGameLost && currentWord.split("").every(letter => guessedLetters.includes(letter));
    const isGameOver = isGameLost || isGameWon;

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
        setCurrentWord("mercy");
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
                disabled={isGuessed || isGameOver || isGameWon}
            >
                {letter.toUpperCase()}
            </button>
        );
    });

    const gameStatusClass = clsx("game-status", {
        "won": isGameWon,
        "lost": isGameLost,
    });

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
            <section className={gameStatusClass}>
                {isGameOver ? (
                    isGameWon ? (
                        <>
                            <h2>You win!</h2>
                            <p> Well done! 🎉</p>
                        </>
                    ) : (
                        <>
                            <h2>Game over!</h2>
                            <p>You lose! Better start learning Assembly 😭</p>
                        </>
                    ))
                    : null
                }
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
            {isGameOver &&
                <button
                    className="new-game"
                    onClick={handleNewGame}
                > New Game
                </button>}
        </main >
    );
}