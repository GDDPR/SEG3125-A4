import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import './MemoryGame.css';

const presets = {
    easy: {
        label: 'Easy',
        description: '3 x 3 grid',
        height: 3,
        width: 3,
        memoryTime: 8,
        rounds: 3,
        accentClass: 'easy',
    },
    medium: {
        label: 'Medium',
        description: '4 x 5 grid',
        height: 4,
        width: 5,
        memoryTime: 6,
        rounds: 4,
        accentClass: 'medium',
    },
    hard: {
        label: 'Hard',
        description: '5 x 7 grid',
        height: 5,
        width: 7,
        memoryTime: 4,
        rounds: 5,
        accentClass: 'hard',
    },
};

const defaultConfig = {
    height: 3,
    width: 5,
    memoryTime: 6,
    rounds: 4,
};

const limits = {
    height: { min: 3, max: 7 },
    width: { min: 3, max: 7 },
    memoryTime: { min: 3, max: 12 },
    rounds: { min: 1, max: 6 },
};

const minPatternCells = 3;

const circleColorOptions = [
    { id: 'sky', label: 'Sky', value: '#9ebbf0', rgb: '158, 187, 240' },
    { id: 'mint', label: 'Mint', value: '#75e3b1', rgb: '117, 227, 177' },
    { id: 'gold', label: 'Gold', value: '#ffcb57', rgb: '255, 203, 87' },
    { id: 'rose', label: 'Rose', value: '#ff8aa6', rgb: '255, 138, 166' },
    { id: 'violet', label: 'Violet', value: '#c5a7ff', rgb: '197, 167, 255' },
];

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getTotalCells(config) {
    return config.height * config.width;
}

function getRandomPatternCellCount(config) {
    const totalCells = getTotalCells(config);
    const maxPatternCells = Math.max(minPatternCells, totalCells - 3);

    return Math.floor(Math.random() * (maxPatternCells - minPatternCells + 1)) + minPatternCells;
}

function generatePattern(config) {
    const totalCells = getTotalCells(config);
    const patternSize = getRandomPatternCellCount(config);
    const cells = Array.from({ length: totalCells }, (_, index) => index);

    for (let i = cells.length - 1; i > 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [cells[i], cells[randomIndex]] = [cells[randomIndex], cells[i]];
    }

    return cells.slice(0, patternSize).sort((a, b) => a - b);
}

function setsAreEqual(firstSet, secondSet) {
    if (firstSet.size !== secondSet.size) {
        return false;
    }

    for (const item of firstSet) {
        if (!secondSet.has(item)) {
            return false;
        }
    }

    return true;
}

function countIntersection(firstSet, secondSet) {
    let total = 0;

    for (const item of firstSet) {
        if (secondSet.has(item)) {
            total += 1;
        }
    }

    return total;
}

function formatSettingValue(setting, value) {
    if (setting === 'memoryTime') {
        return `${value}s`;
    }

    return value;
}

function HomeIcon() {
    return (
        <svg className="memory-button-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 11.2 12 4l9 7.2" />
            <path d="M5.5 10.5V20h4.75v-5.25h3.5V20h4.75v-9.5" />
        </svg>
    );
}

function WrenchIcon() {
    return (
        <svg className="memory-button-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14.7 6.3a4.6 4.6 0 0 0 5.1 5.1l-8.7 8.7a2.2 2.2 0 0 1-3.1 0l-2.1-2.1a2.2 2.2 0 0 1 0-3.1l8.8-8.6Z" />
            <path d="m7.6 16.4 2 2" />
        </svg>
    );
}

function GearIcon() {
    return (
        <svg className="memory-button-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
            <path d="M19.4 15a8.2 8.2 0 0 0 .1-1l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L15 6.5h-4L10.6 9a8 8 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a8.2 8.2 0 0 0 .1 1l-2.1 1.5 2 3.5 2.5-1a7.7 7.7 0 0 0 1.6.9l.4 2.6h4l.4-2.6a7.7 7.7 0 0 0 1.6-.9l2.5 1 2-3.5L19.4 15Z" />
        </svg>
    );
}

function ArrowRightIcon() {
    return (
        <svg className="memory-button-icon memory-button-icon-right" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}

function MemoryHeader({ onHome, onStageConfig, onColorSettings }) {
    return (
        <header className="memory-header">
            <button
                className="memory-header-link memory-home-button"
                type="button"
                onClick={onHome}
                aria-label="Return to memory game instructions"
            >
                <HomeIcon />
                <span>Home</span>
            </button>

            <div className="memory-header-center">
                <span className="memory-logo-dot" aria-hidden="true" />
                <span>Pattern Recall</span>
            </div>

            <div className="memory-header-actions">
                <button className="memory-header-link" type="button" onClick={onStageConfig}>
                    <WrenchIcon />
                    <span>Stage Config</span>
                </button>
                <button className="memory-header-link" type="button" onClick={onColorSettings}>
                    <GearIcon />
                    <span>Settings</span>
                </button>
            </div>
        </header>
    );
}

function Stepper({ label, setting, value, onChange, min, max }) {
    const handleDecrease = () => onChange(setting, -1);
    const handleIncrease = () => onChange(setting, 1);

    return (
        <div className="memory-stepper">
            <label>{label}</label>
            <div className="memory-stepper-controls">
                <button
                    type="button"
                    onClick={handleDecrease}
                    aria-label={`Decrease ${label}`}
                    disabled={value <= min}
                >
                    ‹
                </button>
                <output aria-live="polite">{formatSettingValue(setting, value)}</output>
                <button
                    type="button"
                    onClick={handleIncrease}
                    aria-label={`Increase ${label}`}
                    disabled={value >= max}
                >
                    ›
                </button>
            </div>
        </div>
    );
}

function PatternGrid({
    config,
    pattern,
    selectedCells,
    phase,
    onToggleCell,
    showSolution = false,
    compact = false,
}) {
    const totalCells = getTotalCells(config);
    const patternSet = useMemo(() => new Set(pattern), [pattern]);
    const selectedSet = useMemo(() => new Set(selectedCells), [selectedCells]);
    const isRecall = phase === 'recall';

    return (
        <div
            className={`memory-grid${compact ? ' compact' : ''}`}
            style={{
                gridTemplateColumns: `repeat(${config.width}, minmax(0, 1fr))`,
            }}
        >
            {Array.from({ length: totalCells }, (_, index) => {
                const isPattern = patternSet.has(index);
                const isSelected = selectedSet.has(index);
                const showOriginal = phase === 'memorize' || showSolution;
                const showUserSelection = phase === 'recall' || phase === 'review' || compact;
                const isMissed = showSolution && isPattern && !isSelected;
                const isExtra = showSolution && isSelected && !isPattern;
                const isCorrect = showSolution && isSelected && isPattern;

                return (
                    <button
                        key={index}
                        className={[
                            'memory-cell',
                            showOriginal && isPattern ? 'has-token' : '',
                            showUserSelection && isSelected ? 'is-selected' : '',
                            isMissed ? 'is-missed' : '',
                            isExtra ? 'is-extra' : '',
                            isCorrect ? 'is-correct' : '',
                        ].join(' ')}
                        type="button"
                        onClick={() => onToggleCell(index)}
                        disabled={!isRecall}
                        aria-pressed={isSelected}
                        aria-label={isRecall ? `Cell ${index + 1}` : `Pattern cell ${index + 1}`}
                    >
                        {showOriginal && isPattern && <span className="memory-token" aria-hidden="true" />}
                        {showUserSelection && isSelected && (
                            <span className="memory-token memory-selected-token" aria-hidden="true" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

function MiniGrid({ config, pattern, selectedCells, title }) {
    return (
        <div className="memory-mini-grid-card">
            <h3>{title}</h3>
            <PatternGrid
                config={config}
                pattern={pattern}
                selectedCells={selectedCells}
                phase="review"
                onToggleCell={() => {}}
                showSolution={title === 'Original Pattern'}
                compact
            />
        </div>
    );
}

function ColorSettingsPanel({ options, selectedColor, onSelectColor, onClose }) {
    return (
        <section className="memory-color-settings" aria-label="Circle color settings">
            <div>
                <p className="memory-eyebrow">Settings</p>
                <h2>Circle Color</h2>
            </div>

            <div className="memory-color-options">
                {options.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        className={`memory-color-option${selectedColor === option.id ? ' active' : ''}`}
                        onClick={() => onSelectColor(option.id)}
                        aria-pressed={selectedColor === option.id}
                    >
                        <span
                            className="memory-color-swatch"
                            style={{ background: option.value, color: option.value }}
                            aria-hidden="true"
                        />
                        <span>{option.label}</span>
                    </button>
                ))}
            </div>

            <button className="memory-text-button memory-color-close" type="button" onClick={onClose}>
                Close
            </button>
        </section>
    );
}

function MemoryGame() {
    const [screen, setScreen] = useState('intro');
    const [config, setConfig] = useState(defaultConfig);
    const [roundIndex, setRoundIndex] = useState(0);
    const [pattern, setPattern] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [phase, setPhase] = useState('idle');
    const [secondsLeft, setSecondsLeft] = useState(defaultConfig.memoryTime);
    const [rememberProgress, setRememberProgress] = useState(100);
    const [roundResults, setRoundResults] = useState([]);
    const [lastRound, setLastRound] = useState(null);
    const [selectedColor, setSelectedColor] = useState(circleColorOptions[0].id);
    const [showColorSettings, setShowColorSettings] = useState(false);

    const selectedSet = useMemo(() => new Set(selectedCells), [selectedCells]);
    const circleColor = useMemo(
        () => circleColorOptions.find((option) => option.id === selectedColor) || circleColorOptions[0],
        [selectedColor],
    );
    const totalRounds = config.rounds;
    const currentRoundNumber = roundIndex + 1;

    useLayoutEffect(() => {
        if (phase !== 'memorize') {
            return undefined;
        }

        const memoryTimeMs = config.memoryTime * 1000;
        const startTime = Date.now();
        let animationFrame = 0;

        setSecondsLeft(config.memoryTime);
        setRememberProgress(100);

        function updateProgress() {
            const elapsed = Date.now() - startTime;
            const remainingMs = Math.max(0, memoryTimeMs - elapsed);
            const remainingProgress = (remainingMs / memoryTimeMs) * 100;

            setRememberProgress(remainingProgress);
            setSecondsLeft(Math.ceil(remainingMs / 1000));

            if (remainingMs <= 0) {
                setPhase('hide');
                return;
            }

            animationFrame = window.requestAnimationFrame(updateProgress);
        }

        animationFrame = window.requestAnimationFrame(updateProgress);

        return () => window.cancelAnimationFrame(animationFrame);
    }, [phase, config.memoryTime]);

    useEffect(() => {
        if (phase !== 'hide') {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setSelectedCells([]);
            setPhase('recall');
        }, 1200);

        return () => window.clearTimeout(timer);
    }, [phase]);

    function updateConfig(setting, delta) {
        setConfig((previousConfig) => {
            const newValue = clamp(
                previousConfig[setting] + delta,
                limits[setting].min,
                limits[setting].max,
            );

            return {
                ...previousConfig,
                [setting]: newValue,
            };
        });
    }

    function applyPreset(presetKey) {
        const preset = presets[presetKey];
        setConfig({
            height: preset.height,
            width: preset.width,
            memoryTime: preset.memoryTime,
            rounds: preset.rounds,
        });
    }

    function startGame() {
        setRoundIndex(0);
        setRoundResults([]);
        setLastRound(null);
        setSelectedCells([]);
        setRememberProgress(100);
        setSecondsLeft(config.memoryTime);
        setPattern(generatePattern(config));
        setPhase('memorize');
        setScreen('play');
    }

    function startNextRound() {
        setRoundIndex((previousIndex) => previousIndex + 1);
        setLastRound(null);
        setSelectedCells([]);
        setRememberProgress(100);
        setSecondsLeft(config.memoryTime);
        setPattern(generatePattern(config));
        setPhase('memorize');
        setScreen('play');
    }

    function resetToIntro() {
        setScreen('intro');
        setShowColorSettings(false);
        setPhase('idle');
        setRoundIndex(0);
        setPattern([]);
        setSelectedCells([]);
        setRememberProgress(100);
        setSecondsLeft(config.memoryTime);
        setRoundResults([]);
        setLastRound(null);
    }

    function toggleCell(index) {
        if (phase !== 'recall') {
            return;
        }

        setSelectedCells((previousSelected) => {
            const nextSet = new Set(previousSelected);

            if (nextSet.has(index)) {
                nextSet.delete(index);
            } else {
                nextSet.add(index);
            }

            return Array.from(nextSet).sort((a, b) => a - b);
        });
    }

    function submitRound() {
        const patternSet = new Set(pattern);
        const isExactMatch = setsAreEqual(patternSet, selectedSet);
        const correctCells = countIntersection(patternSet, selectedSet);
        const missedCells = pattern.length - correctCells;
        const extraCells = selectedCells.length - correctCells;
        const result = {
            roundNumber: currentRoundNumber,
            isExactMatch,
            correctCells,
            missedCells,
            extraCells,
            selectedCells,
            pattern,
        };

        const nextResults = [...roundResults, result];
        setRoundResults(nextResults);
        setLastRound(result);
        setPhase('review');

        if (currentRoundNumber >= totalRounds) {
            setScreen('results');
        } else {
            setScreen('round-feedback');
        }
    }

    const correctRounds = roundResults.filter((result) => result.isExactMatch).length;
    const accuracy = totalRounds > 0 ? Math.round((correctRounds / totalRounds) * 100) : 0;
    const stars = totalRounds <= 5 ? correctRounds : Math.round((accuracy / 100) * 5);
    const starTotal = totalRounds <= 5 ? totalRounds : 5;

    return (
        <main
            className="memory-game-page"
            style={{
                '--memory-token': circleColor.value,
                '--memory-token-rgb': circleColor.rgb,
            }}
        >
            <MemoryHeader
                onHome={resetToIntro}
                onStageConfig={() => {
                    setShowColorSettings(false);
                    setScreen('config');
                }}
                onColorSettings={() => setShowColorSettings((isOpen) => !isOpen)}
            />

            {showColorSettings && (
                <ColorSettingsPanel
                    options={circleColorOptions}
                    selectedColor={selectedColor}
                    onSelectColor={setSelectedColor}
                    onClose={() => setShowColorSettings(false)}
                />
            )}

            {screen === 'intro' && (
                <section className="memory-panel memory-intro-panel">
                    <div className="memory-intro-copy">
                        <p className="memory-eyebrow">Visual memory challenge</p>
                        <h1>Remember the pattern. Rebuild it from memory.</h1>
                        <p>
                            Pattern Recall shows a grid with circles for a few seconds. After the
                            pattern disappears, select the cells you remember and submit your answer.
                        </p>

                        <div className="memory-rule-list" aria-label="Game rules">
                            <article>
                                <span>1</span>
                                <p>Study the circle pattern while it is visible.</p>
                            </article>
                            <article>
                                <span>2</span>
                                <p>Wait while the board briefly hides the answer.</p>
                            </article>
                            <article>
                                <span>3</span>
                                <p>Click cells once to turn them on, and click again to deselect them.</p>
                            </article>
                            <article>
                                <span>4</span>
                                <p>Submit your recreated pattern and try to finish all rounds.</p>
                            </article>
                        </div>

                        <button className="memory-primary-button" type="button" onClick={() => setScreen('config')}>
                            <WrenchIcon />
                            <span>Stage Config</span>
                        </button>
                    </div>

                    <div className="memory-demo-card" aria-hidden="true">
                        <div className="memory-demo-grid">
                            {Array.from({ length: 15 }, (_, index) => (
                                <span key={index} className={[0, 2, 4, 6, 9, 11, 14].includes(index) ? 'active' : ''} />
                            ))}
                        </div>
                        <p>Sample 3 x 5 pattern</p>
                    </div>
                </section>
            )}

            {screen === 'config' && (
                <section className="memory-panel memory-config-panel">
                    <div className="memory-section-title">
                        <p className="memory-eyebrow">Stage setup</p>
                        <h1>Build Your Challenge!</h1>
                        <p>Choose a quick preset or adjust the stage manually.</p>
                    </div>

                    <div className="memory-preset-grid" aria-label="Difficulty presets">
                        {Object.entries(presets).map(([key, preset]) => (
                            <button
                                key={key}
                                type="button"
                                className={`memory-preset-card ${preset.accentClass}`}
                                onClick={() => applyPreset(key)}
                            >
                                <strong>{preset.label}</strong>
                                <span>{preset.description}</span>
                            </button>
                        ))}
                    </div>

                    <div className="memory-config-layout">
                        <div className="memory-config-controls">
                            <Stepper
                                label="Grid Height"
                                setting="height"
                                value={config.height}
                                onChange={updateConfig}
                                min={limits.height.min}
                                max={limits.height.max}
                            />
                            <Stepper
                                label="Grid Width"
                                setting="width"
                                value={config.width}
                                onChange={updateConfig}
                                min={limits.width.min}
                                max={limits.width.max}
                            />
                            <Stepper
                                label="Memory Time"
                                setting="memoryTime"
                                value={config.memoryTime}
                                onChange={updateConfig}
                                min={limits.memoryTime.min}
                                max={limits.memoryTime.max}
                            />
                            <Stepper
                                label="Rounds"
                                setting="rounds"
                                value={config.rounds}
                                onChange={updateConfig}
                                min={limits.rounds.min}
                                max={limits.rounds.max}
                            />
                        </div>

                        <aside className="memory-stage-summary">
                            <h2>Stage Summary</h2>
                            <p>{config.height} x {config.width} grid</p>
                            <p>{config.memoryTime}-second memory time</p>
                            <p>{config.rounds} rounds</p>
                            <button className="memory-primary-button" type="button" onClick={startGame}>
                                Start
                            </button>
                        </aside>
                    </div>
                </section>
            )}

            {screen === 'play' && (
                <section className="memory-panel memory-play-panel">
                    <div className="memory-play-topbar">
                        <button className="memory-text-button" type="button" onClick={() => setScreen('config')}>
                            Back
                        </button>
                        <strong>Round {currentRoundNumber}/{totalRounds}</strong>
                        <span>{phase === 'memorize' ? `${secondsLeft}s` : `${selectedCells.length} selected`}</span>
                    </div>

                    <div className="memory-play-instructions">
                        {phase === 'memorize' && (
                            <>
                                <h1>Memorize The Pattern!</h1>
                                <p>The circles will disappear when the timer ends.</p>
                            </>
                        )}
                        {phase === 'hide' && (
                            <>
                                <h1>Pattern Hidden</h1>
                                <p>Get ready to recreate it.</p>
                            </>
                        )}
                        {phase === 'recall' && (
                            <>
                                <h1>Recreate The Pattern!</h1>
                                <p>Click a cell to turn it on. Click again to deselect it.</p>
                            </>
                        )}
                    </div>

                    <PatternGrid
                        config={config}
                        pattern={pattern}
                        selectedCells={selectedCells}
                        phase={phase}
                        onToggleCell={toggleCell}
                    />

                    <div className="memory-play-actions">
                        {phase === 'memorize' && (
                            <div className="memory-timer-track" aria-label={`${secondsLeft} seconds left`}>
                                <span style={{ width: `${rememberProgress}%` }} />
                            </div>
                        )}

                        {phase === 'hide' && <p className="memory-status-note">The board is hidden for a short pause.</p>}

                        {phase === 'recall' && (
                            <button className="memory-primary-button" type="button" onClick={submitRound}>
                                <span>Submit</span>
                                <ArrowRightIcon />
                            </button>
                        )}
                    </div>
                </section>
            )}

            {screen === 'round-feedback' && lastRound && (
                <section className="memory-panel memory-feedback-panel">
                    <p className="memory-eyebrow">Round {lastRound.roundNumber} result</p>
                    <h1>{lastRound.isExactMatch ? 'Correct Pattern!' : 'Almost There!'}</h1>
                    <p>
                        You matched {lastRound.correctCells} cells, missed {lastRound.missedCells},
                        and selected {lastRound.extraCells} extra cells.
                    </p>

                    <div className="memory-review-grid">
                        <MiniGrid config={config} pattern={lastRound.pattern} selectedCells={[]} title="Original Pattern" />
                        <MiniGrid config={config} pattern={[]} selectedCells={lastRound.selectedCells} title="Your Pattern" />
                    </div>

                    <button className="memory-primary-button" type="button" onClick={startNextRound}>
                        Next Round
                    </button>
                </section>
            )}

            {screen === 'results' && (
                <section className="memory-panel memory-results-panel">
                    <button className="memory-text-button memory-results-back" type="button" onClick={() => setScreen('config')}>
                        Back
                    </button>

                    <p className="memory-round-count">{correctRounds}/{totalRounds}</p>
                    <h1>Challenge Completed!</h1>

                    <div className="memory-stars" aria-label={`${stars} out of ${starTotal} stars`}>
                        {Array.from({ length: starTotal }, (_, index) => (
                            <span key={index} className={index < stars ? 'active' : ''}>★</span>
                        ))}
                    </div>

                    <p className="memory-result-main">
                        You got {correctRounds} out of {totalRounds} rounds correct
                    </p>

                    <div className="memory-result-stats">
                        <p>Accuracy: {accuracy}%</p>
                        <p>
                            Settings used: {config.height}x{config.width} grid,
                            {' '}{config.memoryTime}-second memory time
                        </p>
                    </div>

                    <div className="memory-results-actions">
                        <button className="memory-primary-button" type="button" onClick={startGame}>
                            Retry
                        </button>
                        <button className="memory-secondary-button" type="button" onClick={resetToIntro}>
                            New Game
                        </button>
                    </div>
                </section>
            )}
        </main>
    );
}

export default MemoryGame;
