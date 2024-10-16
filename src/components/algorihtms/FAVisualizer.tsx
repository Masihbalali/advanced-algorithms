'use client'

import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { Line, Scatter } from 'react-chartjs-2';
import Plot from 'react-plotly.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Button } from '@material-tailwind/react';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Define TypeScript interfaces for parameters
interface FAParams {
    numFireflies: number;
    dimensions: 2 | 3;
    maxIterations: number;
    alpha: number;    // Randomness parameter
    beta0: number;    // Initial attractiveness
    gamma: number;    // Light absorption coefficient
}

const FAVisualizer: React.FC = () => {
    // Default FA Parameters
    const defaultParams: FAParams = {
        numFireflies: 30,
        dimensions: 3, // Supports 2D and 3D
        maxIterations: 100,
        alpha: 0.5,     // Randomness parameter
        beta0: 1,       // Initial attractiveness
        gamma: 1,       // Light absorption coefficient
    };

    // Bounds for the search space
    const minBound = -5.12;
    const maxBound = 5.12;

    // State variables
    const [params, setParams] = useState<FAParams>(defaultParams);
    const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
    const [positions, setPositions] = useState<number[][]>([]);
    const [bestPosition, setBestPosition] = useState<number[]>([]);
    const [currentIteration, setCurrentIteration] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const inputContainerStyles = "flex justify-center items-center flex-col"
    const inputStyles = "text-black w-14 rounded text-center"

    // References to store mutable variables without causing re-renders
    const positionsRef = useRef<number[][]>([]);
    const brightnessRef = useRef<number[]>([]);
    const animationFrameRef = useRef<NodeJS.Timeout | null>(null);
    const shouldStopRef = useRef<boolean>(false);

    // Define the Rastrigin function
    const rastrigin = (X: number[]): number => {
        const A = 10;
        return A * X.length + X.reduce((sum, x) => sum + (x ** 2 - A * Math.cos(2 * Math.PI * x)), 0);
    };

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setParams(prev => ({
            ...prev,
            [name]: name === 'dimensions' || name === 'numFireflies' || name === 'maxIterations'
                ? parseInt(value)
                : parseFloat(value)
        }));
    };

    // Initialize FA
    const initializeFA = (): void => {
        const { numFireflies, dimensions } = params;

        // Initialize firefly positions
        const initialPositions: number[][] = Array.from({ length: numFireflies }, () =>
            Array.from({ length: dimensions }, () => Math.random() * (maxBound - minBound) + minBound)
        );

        positionsRef.current = initialPositions.map(pos => [...pos]);

        // Initialize brightness based on fitness
        const initialBrightness: number[] = initialPositions.map(pos => rastrigin(pos));
        brightnessRef.current = [...initialBrightness];

        // Identify the global best
        const gBestIndex: number = initialBrightness.indexOf(Math.min(...initialBrightness));
        const gBest: number[] = [...initialPositions[gBestIndex]];

        // Initialize state
        setPositions([...positionsRef.current]);
        setBestPosition([...gBest]);
        setFitnessHistory([rastrigin(gBest)]);
        setCurrentIteration(0);
        shouldStopRef.current = false;
    };

    // FA Iteration Step
    const faStep = (): void => {
        const { numFireflies, dimensions, alpha, beta0, gamma } = params;
        const numF = numFireflies;

        for (let i = 0; i < numF; i++) {
            for (let j = 0; j < numF; j++) {
                if (brightnessRef.current[j] < brightnessRef.current[i]) {
                    // Calculate distance between firefly i and j
                    const distance: number = euclideanDistance(positionsRef.current[i], positionsRef.current[j]);

                    // Calculate attractiveness
                    const beta: number = beta0 * Math.exp(-gamma * distance ** 2);

                    // Move firefly i towards firefly j
                    for (let d = 0; d < dimensions; d++) {
                        positionsRef.current[i][d] += beta * (positionsRef.current[j][d] - positionsRef.current[i][d]) +
                            alpha * (Math.random() * 2 - 1); // Adding randomness
                        // Clamp to bounds
                        positionsRef.current[i][d] = Math.max(minBound, Math.min(maxBound, positionsRef.current[i][d]));
                    }

                    // Update brightness
                    brightnessRef.current[i] = rastrigin(positionsRef.current[i]);

                    // Update best position if necessary
                    if (brightnessRef.current[i] < rastrigin(bestPosition)) {
                        setBestPosition([...positionsRef.current[i]]);
                    }
                }
            }
        }

        // Update fitness history
        const currentBestFitness: number = Math.min(...brightnessRef.current);
        setFitnessHistory(prev => [...prev, currentBestFitness]);

        // Update state
        setPositions([...positionsRef.current]);
        setCurrentIteration(prev => prev + 1);
    };

    // Animation Loop
    const animateFA = (): void => {
        if (currentIteration < params.maxIterations && !shouldStopRef.current) {
            faStep();
            animationFrameRef.current = setTimeout(animateFA, 100); // Adjust delay for animation speed
        } else {
            setIsRunning(false);
        }
    };

    // Start FA
    const startFA = (): void => {
        if (!isRunning) {
            initializeFA();
            setIsRunning(true);
        }
    };

    // Stop FA
    const stopFA = (): void => {
        if (isRunning) {
            shouldStopRef.current = true;
            if (animationFrameRef.current) {
                clearTimeout(animationFrameRef.current);
            }
            setIsRunning(false);
        }
    };

    // Effect to start animation when FA starts
    useEffect(() => {
        if (isRunning) {
            animateFA();
        }

        // Cleanup on unmount
        return () => {
            if (animationFrameRef.current) {
                clearTimeout(animationFrameRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning, currentIteration]);

    // Utility function to calculate Euclidean distance
    const euclideanDistance = (a: number[], b: number[]): number => {
        return Math.sqrt(a.reduce((sum, val, idx) => sum + (val - b[idx]) ** 2, 0));
    };

    // Prepare data for Line Chart
    const lineChartData = {
        labels: Array.from({ length: fitnessHistory.length }, (_, i) => i),
        datasets: [
            {
                label: 'Best Fitness',
                data: fitnessHistory,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: true,
                tension: 0.1,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'FA Best Fitness Over Iterations',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Iteration',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Best Fitness',
                },
                beginAtZero: false,
            },
        },
    };

    // Prepare data for 2D Scatter Plot
    const scatter2DData = {
        datasets: [
            {
                label: 'Fireflies',
                data: positions.map(pos => ({ x: pos[0], y: pos[1] })),
                backgroundColor: 'rgba(153, 102, 255, 1)',
            },
            {
                label: 'Global Best',
                data: [{ x: bestPosition[0], y: bestPosition[1] }],
                backgroundColor: 'rgba(255, 99, 132, 1)',
                pointRadius: 8,
            },
        ],
    };

    const scatter2DOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'FA Firefly Positions (2D)',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'X Dimension',
                },
                min: minBound - 1,
                max: maxBound + 1,
            },
            y: {
                title: {
                    display: true,
                    text: 'Y Dimension',
                },
                min: minBound - 1,
                max: maxBound + 1,
            },
        },
    };

    // Prepare data for 3D Scatter Plot using Plotly
    const plotlyData: any[] = [
        {
            x: positions.map(pos => pos[0]),
            y: positions.map(pos => pos[1]),
            z: params.dimensions === 3 ? positions.map(pos => pos[2]) : [],
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 5,
                color: 'rgba(153, 102, 255, 0.8)',
            },
            name: 'Fireflies',
        },
        {
            x: [bestPosition[0]],
            y: [bestPosition[1]],
            z: params.dimensions === 3 ? [bestPosition[2]] : [],
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 10,
                color: 'rgba(255, 99, 132, 1)',
                symbol: 'diamond',
            },
            name: 'Global Best',
        },
    ];

    const plotlyLayout = {
        title: 'FA Firefly Positions (3D)',
        autosize: true,
        scene: {
            xaxis: { title: 'X Dimension', range: [minBound - 1, maxBound + 1] },
            yaxis: { title: 'Y Dimension', range: [minBound - 1, maxBound + 1] },
            zaxis: { title: 'Z Dimension', range: [minBound - 1, maxBound + 1] },
        },
        legend: {
            x: 0,
            y: 1,
        },
    };

    return (
        <div>
            <h1>Firefly Algorithm (FA) Visualization</h1>

            {/* Input Controls */}
            <div className=' flex justify-around items-center' style={{ marginBottom: '20px' }}>
                <h2>FA Parameters</h2>
                <form
                    onSubmit={(e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        if (!isRunning) {
                            startFA();
                        }
                    }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    <div className={inputContainerStyles}>
                        <label htmlFor="numFireflies">Number of Fireflies:</label><br />
                        <input
                            className={inputStyles}
                            type="number"
                            id="numFireflies"
                            name="numFireflies"
                            min="10"
                            max="100"
                            value={params.numFireflies}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                        />
                    </div>
                    <div className={inputContainerStyles}>
                        <label htmlFor="dimensions">Dimensions:</label><br />
                        <input
                            className={inputStyles}
                            type="number"
                            id="dimensions"
                            name="dimensions"
                            min="2"
                            max="3"
                            value={params.dimensions}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                        />
                    </div>
                    <div className={inputContainerStyles}>
                        <label htmlFor="maxIterations">Max Iterations:</label><br />
                        <input
                            className={inputStyles}
                            type="number"
                            id="maxIterations"
                            name="maxIterations"
                            min="10"
                            max="1000"
                            value={params.maxIterations}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                        />
                    </div>
                    <div className={inputContainerStyles}>
                        <label htmlFor="alpha">Randomness (alpha):</label><br />
                        <input
                            className={inputStyles}
                            type="number"
                            id="alpha"
                            name="alpha"
                            step="0.1"
                            min="0"
                            max="1"
                            value={params.alpha}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                        />
                    </div>
                    <div className={inputContainerStyles}>
                        <label htmlFor="beta0">Initial Attractiveness (beta0):</label><br />
                        <input
                            className={inputStyles}
                            type="number"
                            id="beta0"
                            name="beta0"
                            step="0.1"
                            min="0"
                            max="5"
                            value={params.beta0}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                        />
                    </div>
                    <div className={inputContainerStyles}>
                        <label htmlFor="gamma">Light Absorption (gamma):</label><br />
                        <input
                            className={inputStyles}
                            type="number"
                            id="gamma"
                            name="gamma"
                            step="0.1"
                            min="0"
                            max="5"
                            value={params.gamma}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                        />
                    </div>
                    <div style={{ alignSelf: 'flex-end' }}>
                        <Button color='green' type="submit" disabled={isRunning} style={{ padding: '10px 20px', fontSize: '16px' }}>
                            Start FA
                        </Button>

                        <Button
                            type="button"
                            color='green'
                            onClick={stopFA}
                            disabled={!isRunning}
                            style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}
                        >
                            Stop FA
                        </Button>
                    </div>
                </form>
            </div>

            {/* Charts */}
            <div className='p-20' style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <div className='flex flex-row gap-5 w-full'>


                    {/* Line Chart */}
                    <div className='w-full'>
                        <Line data={lineChartData} options={lineChartOptions} />
                    </div>

                    {/* 2D Scatter Plot */}
                    <div className='w-full'>

                        {params.dimensions >= 2 && (
                            <div>
                                <Scatter data={scatter2DData} options={scatter2DOptions} />
                            </div>
                        )}
                    </div>

                </div>

                {/* 3D Scatter Plot */}
                {params.dimensions === 3 && (
                    <div>
                        <Plot
                            data={plotlyData}
                            layout={plotlyLayout}
                            style={{ width: '100%', height: '600px' }}
                        />
                    </div>
                )}

                {/* Status Indicators */}
                <div>
                    <p>Current Iteration: {currentIteration} / {params.maxIterations}</p>
                    <p>Global Best Fitness: {fitnessHistory[fitnessHistory.length - 1]?.toFixed(4)}</p>
                    <p>
                        Global Best Position: [
                        {bestPosition.map(pos => pos.toFixed(4)).join(', ')}
                        ]
                    </p>
                </div>
            </div>
        </div>
    );

};

export default FAVisualizer;
