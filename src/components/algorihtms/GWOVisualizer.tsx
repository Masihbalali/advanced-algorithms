// src/components/algorithms/GWOVisualizer.tsx

'use client';

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
interface GWOParams {
    populationSize: number;
    dimensions: 2 | 3;
    maxIterations: number;
    a: number; // Decreasing parameter 'a' from 2 to 0
}

// Define TypeScript interfaces for individual wolves
interface Wolf {
    position: number[];
    fitness: number;
}

const GWOVisualizer: React.FC = () => {
    // Default GWO Parameters
    const defaultParams: GWOParams = {
        populationSize: 30,
        dimensions: 3, // Supports 2D and 3D
        maxIterations: 100,
        a: 2, // Initially set to 2
    };

    // Bounds for the search space
    const minBound = -5.12;
    const maxBound = 5.12;

    // State variables
    const [params, setParams] = useState<GWOParams>(defaultParams);
    const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
    const [population, setPopulation] = useState<Wolf[]>([]);
    const [alpha, setAlpha] = useState<Wolf | null>(null);
    const [beta, setBeta] = useState<Wolf | null>(null);
    const [delta, setDelta] = useState<Wolf | null>(null);
    const [currentIteration, setCurrentIteration] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    // References to store mutable variables without causing re-renders
    const populationRef = useRef<Wolf[]>([]);
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
            [name]: name === 'dimensions' || name === 'populationSize' || name === 'maxIterations'
                ? parseInt(value)
                : parseFloat(value)
        }));
    };

    // Initialize GWO
    const initializeGWO = (): void => {
        const { populationSize, dimensions } = params;

        // Initialize population with random positions
        const initialPopulation: Wolf[] = Array.from({ length: populationSize }, () => {
            const position = Array.from({ length: dimensions }, () => Math.random() * (maxBound - minBound) + minBound);
            const fitness = rastrigin(position);
            return { position, fitness };
        });

        populationRef.current = initialPopulation;
        setPopulation([...populationRef.current]);

        // Identify alpha, beta, delta
        const sortedPopulation = [...initialPopulation].sort((a, b) => a.fitness - b.fitness);
        const alphaWolf = sortedPopulation[0];
        const betaWolf = sortedPopulation[1];
        const deltaWolf = sortedPopulation[2];

        setAlpha(alphaWolf);
        setBeta(betaWolf);
        setDelta(deltaWolf);

        setFitnessHistory([alphaWolf.fitness]);
        setCurrentIteration(0);
        shouldStopRef.current = false;
    };

    // GWO Iteration Step
    const gwoStep = (): void => {
        const { populationSize, dimensions, a } = params;
        const aDecreasing = a - (2 / params.maxIterations); // Decrease 'a' linearly from 2 to 0

        const newPopulation: Wolf[] = populationRef.current.map(wolf => {
            const newWolf: Wolf = { ...wolf };

            for (let d = 0; d < dimensions; d++) {
                // Generate random numbers
                const r1 = Math.random();
                const r2 = Math.random();

                // Update coefficient vectors 'A' and 'C'
                const A1 = 2 * aDecreasing * r1 - aDecreasing;
                const C1 = 2 * r2;

                // Update position with alpha, beta, delta wolves
                const D_alpha = Math.abs(C1 * alpha!.position[d] - wolf.position[d]);
                const X1 = alpha!.position[d] - A1 * D_alpha;

                const D_beta = Math.abs(C1 * beta!.position[d] - wolf.position[d]);
                const X2 = beta!.position[d] - A1 * D_beta;

                const D_delta = Math.abs(C1 * delta!.position[d] - wolf.position[d]);
                const X3 = delta!.position[d] - A1 * D_delta;

                // Update position
                const newPosition = (X1 + X2 + X3) / 3;

                // Random selection with probability 'p' (assume p = 0.5)
                if (Math.random() > 0.5) {
                    newWolf.position[d] = newPosition;
                } else {
                    // Exploration: random walk
                    newWolf.position[d] = wolf.position[d] + aDecreasing * (Math.random() - 0.5) * (maxBound - minBound);
                }

                // Clamp to bounds
                newWolf.position[d] = Math.max(minBound, Math.min(maxBound, newWolf.position[d]));
            }

            // Evaluate fitness
            newWolf.fitness = rastrigin(newWolf.position);

            return newWolf;
        });

        populationRef.current = newPopulation;

        // Identify alpha, beta, delta
        const sortedPopulation = [...newPopulation].sort((a, b) => a.fitness - b.fitness);
        const alphaWolf = sortedPopulation[0];
        const betaWolf = sortedPopulation[1];
        const deltaWolf = sortedPopulation[2];

        setAlpha(alphaWolf);
        setBeta(betaWolf);
        setDelta(deltaWolf);

        // Update population state
        setPopulation([...populationRef.current]);

        // Update fitness history
        setFitnessHistory(prev => [...prev, alphaWolf.fitness]);

        // Update parameter 'a'
        setParams(prev => ({ ...prev, a: aDecreasing }));

        // Update iteration count
        setCurrentIteration(prev => prev + 1);
    };

    // Animation Loop
    const animateGWO = (): void => {
        if (currentIteration < params.maxIterations && !shouldStopRef.current) {
            gwoStep();
            animationFrameRef.current = setTimeout(animateGWO, 100); // Adjust delay for animation speed
        } else {
            setIsRunning(false);
        }
    };

    // Start GWO
    const startGWO = (): void => {
        if (!isRunning) {
            initializeGWO();
            setIsRunning(true);
        }
    };

    // Stop GWO
    const stopGWO = (): void => {
        if (isRunning) {
            shouldStopRef.current = true;
            if (animationFrameRef.current) {
                clearTimeout(animationFrameRef.current);
            }
            setIsRunning(false);
        }
    };

    // Effect to start animation when GWO starts
    useEffect(() => {
        if (isRunning) {
            animateGWO();
        }

        // Cleanup on unmount
        return () => {
            if (animationFrameRef.current) {
                clearTimeout(animationFrameRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning, currentIteration]);

    // Prepare data for Line Chart
    const lineChartData = {
        labels: Array.from({ length: fitnessHistory.length }, (_, i) => i),
        datasets: [
            {
                label: 'Best Fitness',
                data: fitnessHistory,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
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
                text: 'GWO Best Fitness Over Iterations',
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
                label: 'Population',
                data: population.map(wolf => ({ x: wolf.position[0], y: wolf.position[1] })),
                backgroundColor: 'rgba(54, 162, 235, 1)',
            },
            {
                label: 'Alpha (Best Solution)',
                data: alpha ? [{ x: alpha.position[0], y: alpha.position[1] }] : [],
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
                text: 'GWO Population Positions (2D)',
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
    const plotlyData = [
        {
            x: population.map(wolf => wolf.position[0]),
            y: population.map(wolf => wolf.position[1]),
            z: params.dimensions === 3 ? population.map(wolf => wolf.position[2]) : [],
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 5,
                color: 'rgba(54, 162, 235, 0.8)',
            },
            name: 'Population',
        },
        {
            x: alpha ? [alpha.position[0]] : [],
            y: alpha ? [alpha.position[1]] : [],
            z: params.dimensions === 3 && alpha ? [alpha.position[2]] : [],
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 10,
                color: 'rgba(255, 99, 132, 1)',
                symbol: 'diamond',
            },
            name: 'Alpha (Best Solution)',
        },
    ];

    const plotlyLayout = {
        title: 'GWO Population Positions (3D)',
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
        <div className="flex flex-col items-center p-8">
            <h2 className="text-2xl font-bold mb-4">Grey Wolf Optimizer (GWO) Visualization</h2>

            {/* Input Controls */}
            <div className="flex justify-around items-center mb-4 w-full">
                <h3 className="text-xl font-semibold">GWO Parameters</h3>
                <form
                    onSubmit={(e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        if (!isRunning) {
                            startGWO();
                        }
                    }}
                    className="flex flex-wrap gap-4"
                >
                    <div className="flex flex-col">
                        <label htmlFor="populationSize" className="font-medium">Population Size:</label>
                        <input
                            type="number"
                            id="populationSize"
                            name="populationSize"
                            min="10"
                            max="100"
                            value={params.populationSize}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                            className="border p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="dimensions" className="font-medium">Dimensions:</label>
                        <input
                            type="number"
                            id="dimensions"
                            name="dimensions"
                            min="2"
                            max="3"
                            value={params.dimensions}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                            className="border p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="maxIterations" className="font-medium">Max Iterations:</label>
                        <input
                            type="number"
                            id="maxIterations"
                            name="maxIterations"
                            min="10"
                            max="1000"
                            value={params.maxIterations}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                            className="border p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="a" className="font-medium">Parameter a:</label>
                        <input
                            type="number"
                            id="a"
                            name="a"
                            step="0.1"
                            min="0"
                            max="2"
                            value={params.a}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                            className="border p-2 rounded"
                        />
                    </div>
                    <div className="flex items-end gap-4">
                        <Button
                            type="submit"
                            color="green"
                            disabled={isRunning}
                            className="px-4 py-2"
                        >
                            Start GWO
                        </Button>
                        <Button
                            type="button"
                            color="red"
                            onClick={stopGWO}
                            disabled={!isRunning}
                            className="px-4 py-2"
                        >
                            Stop GWO
                        </Button>
                    </div>
                </form>
            </div>

            {/* Charts */}
            <div className="flex flex-col gap-8 w-full">
                {/* Line Chart */}
                <div>
                    <Line data={lineChartData} options={lineChartOptions} />
                </div>

                {/* Scatter Plots */}
                <div className="flex flex-col gap-8">
                    {/* 2D Scatter Plot */}
                    {params.dimensions >= 2 && (
                        <div>
                            <Scatter data={scatter2DData} options={scatter2DOptions} />
                        </div>
                    )}

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
                </div>

                {/* Status Indicators */}
                <div className="text-center">
                    <p className="font-medium">Current Iteration: {currentIteration} / {params.maxIterations}</p>
                    <p className="font-medium">Global Best Fitness: {fitnessHistory[fitnessHistory.length - 1]?.toFixed(4)}</p>
                    <p className="font-medium">
                        Global Best Position: [
                        {alpha ? alpha.position.map(pos => pos.toFixed(4)).join(', ') : 'N/A'}
                        ]
                    </p>
                </div>
            </div>
        </div>
    );

};

export default GWOVisualizer;
