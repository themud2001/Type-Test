import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { nanoid } from "nanoid";

import "./App.css";

let counter = 0;
let correctWords = 0;
let wrongWords = 0;
let intervalObject = null;
const timeLimit = 7;
const words = ["test", "haha", "car", "moath", "lol", "mustang", "dodge", "jordan", "what", "test", "haha", "car", "moath", "lol", "mustang", "dodge", "jordan", "what", "test", "haha", "car", "moath", "lol", "mustang", "dodge", "jordan", "what"];

function App() {
    const [timer, setTimer] = useState(0);
    const [started, setStarted] = useState(false);
    const [input, setInput] = useState("");
    const [finished, setFinished] = useState(false);

    if (!finished) {
        if ((timeLimit - timer <= 0)) {
            stop();
        }
    }

    function start() {
        counter = 0;
        correctWords = 0;
        wrongWords = 0;
        setInput("");
        setTimer(0);
        setFinished(false);
        setStarted(true);
        clearInterval(intervalObject);
        intervalObject = setInterval(() => setTimer(oldState => oldState + 1), 1000);
    }

    function stop() {
        setFinished(true);
        setStarted(false);
        clearInterval(intervalObject);
    }

    function handleInputKeyDown(e) {
        if (e.keyCode == 32) {
            let realInput = input.trim();

            if (realInput == "") {
                setInput("");
                return;
            }

            if (realInput == words[counter]) {
                correctWords++;
            } else {
                wrongWords++;
            }

            counter++;
            setInput("");

            if (words.length == counter) {
                stop();
            }
        }
    }
    
    function handleInputChange(e) {
        setInput(e.target.value);
    }

    function handleStartClick(e) {
        start();
    }

    function handleAppKeyDown(e) {
        if (e.key == "Enter") {
            if (!started) {
                start();
            }
        }
    }

    useEffect(() => () => clearInterval(intervalObject), []);

    useEffect(() => {
        document.addEventListener("keydown", handleAppKeyDown);

        return () => document.removeEventListener("keydown", handleAppKeyDown);
    }, [started]);

    return (
        <>
            <h1 className="title">Type Test</h1>
            <div className="container">
                <div className="words-box">
                    <ul>
                        {words.map((value, index) => <li className={started && (counter == index) ? "active" : ""} key={nanoid(10)}>{value}</li>)}
                    </ul>
                </div>

                <div className="input-container">
                    {!started
                        ? <button className="start" onClick={handleStartClick}>{finished ? "Res" : "S"}tart</button>
                        : (
                            <>
                                <input type="text" onChange={handleInputChange} onKeyDown={handleInputKeyDown} value={input} disabled={finished} autoFocus={true} />
                                <h1 className="timer">
                                    {(timeLimit - timer) >= 60
                                        ? Math.floor((timeLimit - timer) / 60) + ":" + (
                                            ((timeLimit - timer) % 60) >= 10 ? (timeLimit - timer) % 60 : "0" + (timeLimit - timer) % 60
                                        )
                                        : "0:" + ((timeLimit - timer) >= 10 ? (timeLimit - timer) : "0" + (timeLimit - timer))
                                    }
                                </h1>
                                <button className="restart" onClick={handleStartClick}><FontAwesomeIcon icon={faRotate} /></button>
                            </>
                        )
                    }
                </div>

                {finished &&
                    <div className="score">
                        <h1 className="wpm">WPM: <span>{(correctWords / timer * 60).toFixed()}</span></h1>
                        <h1 className="correct">Correct words: <span>{correctWords}</span></h1>
                        <h1 className="wrong">Wrong words: <span>{wrongWords}</span></h1>
                        <h1 className="accuracy">Accuracy: <span>{(correctWords / (counter ? counter : 1) * 100).toFixed(1)}%</span></h1>
                    </div>
                }
            </div>
        </>
    );
}

export default App;