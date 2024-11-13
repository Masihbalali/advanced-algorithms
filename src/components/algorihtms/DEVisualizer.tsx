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
interface DEParams {
    populationSize: number;
    dimensions: 2 | 3;
    maxIterations: number;
    mutationFactor: number;   // F
    crossoverRate: number;    // CR
}

// Define TypeScript interfaces for individual solutions
interface Individual {
    vector: number[];
    fitness: number;
}

const DEVisualizer: React.FC = () => {
    // Default DE Parameters
    const defaultParams: DEParams = {
        populationSize: 30,
        dimensions: 3, // Supports 2D and 3D
        maxIterations: 100,
        mutationFactor: 0.8, // Commonly between 0.4 and 1.0
        crossoverRate: 0.9,  // Commonly between 0.5 and 1.0
    };

    // Bounds for the search space
    const minBound = -5.12;
    const maxBound = 5.12;

    // State variables
    const [params, setParams] = useState<DEParams>(defaultParams);
    const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
    const [population, setPopulation] = useState<Individual[]>([]);
    const [bestSolution, setBestSolution] = useState<Individual | null>(null);
    const [currentIteration, setCurrentIteration] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const inputContainerStyles = "flex justify-center items-center flex-col"
    const inputStyles = "text-black w-14 rounded text-center"


    // References to store mutable variables without causing re-renders
    const populationRef = useRef<Individual[]>([]);
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

    // Initialize DE
    const initializeDE = (): void => {
        const { populationSize, dimensions } = params;

        // Initialize population with random vectors
        const initialPopulation: Individual[] = Array.from({ length: populationSize }, () => {
            const vector = Array.from({ length: dimensions }, () => Math.random() * (maxBound - minBound) + minBound);
            const fitness = rastrigin(vector);
            return { vector, fitness };
        });

        populationRef.current = initialPopulation;
        setPopulation([...populationRef.current]);

        // Identify the global best
        const gBest = initialPopulation.reduce((best, current) => {
            return current.fitness < best.fitness ? current : best;
        }, initialPopulation[0]);

        setBestSolution(gBest);
        setFitnessHistory([gBest.fitness]);
        setCurrentIteration(0);
        shouldStopRef.current = false;
    };

    // DE Iteration Step
    const deStep = (): void => {
        const { populationSize, dimensions, mutationFactor, crossoverRate } = params;
        const newPopulation: Individual[] = [];

        for (let i = 0; i < populationSize; i++) {
            const target = populationRef.current[i];

            // Mutation: select three distinct individuals different from target
            let indices = new Set<number>();
            indices.add(i);
            while (indices.size < 4) { // target + 3 others
                indices.add(Math.floor(Math.random() * populationSize));
            }
            const [_, a, b, c] = Array.from(indices);

            const mutantVector = populationRef.current[a].vector.map((val, idx) =>
                populationRef.current[c].vector[idx] + mutationFactor * (populationRef.current[b].vector[idx] - populationRef.current[c].vector[idx])
            );

            // Crossover: binomial crossover
            const trialVector = target.vector.map((val, idx) => {
                if (Math.random() < crossoverRate || idx === 0) { // Ensure at least one parameter is taken from mutant
                    return mutantVector[idx];
                }
                return val;
            });

            // Ensure trialVector is within bounds
            const clampedTrialVector = trialVector.map(val => Math.max(minBound, Math.min(maxBound, val)));

            const trialFitness = rastrigin(clampedTrialVector);

            // Selection: if trial is better, replace target
            if (trialFitness < target.fitness) {
                newPopulation.push({ vector: clampedTrialVector, fitness: trialFitness });
            } else {
                newPopulation.push(target);
            }
        }

        populationRef.current = newPopulation;
        setPopulation([...populationRef.current]);

        // Identify the global best
        const gBest = newPopulation.reduce((best, current) => {
            return current.fitness < best.fitness ? current : best;
        }, newPopulation[0]);

        setBestSolution(gBest);
        setFitnessHistory(prev => [...prev, gBest.fitness]);
        setCurrentIteration(prev => prev + 1);
    };

    // Animation Loop
    const animateDE = (): void => {
        if (currentIteration < params.maxIterations && !shouldStopRef.current) {
            deStep();
            animationFrameRef.current = setTimeout(animateDE, 100); // Adjust delay for animation speed
        } else {
            setIsRunning(false);
        }
    };

    // Start DE
    const startDE = (): void => {
        if (!isRunning) {
            initializeDE();
            setIsRunning(true);
        }
    };

    // Stop DE
    const stopDE = (): void => {
        if (isRunning) {
            shouldStopRef.current = true;
            if (animationFrameRef.current) {
                clearTimeout(animationFrameRef.current);
            }
            setIsRunning(false);
        }
    };

    // Effect to start animation when DE starts
    useEffect(() => {
        if (isRunning) {
            animateDE();
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
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
                text: 'DE Best Fitness Over Generations',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Generation',
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
                data: population.map(ind => ({ x: ind.vector[0], y: ind.vector[1] })),
                backgroundColor: 'rgba(54, 162, 235, 1)',
            },
            {
                label: 'Best Solution',
                data: bestSolution ? [{ x: bestSolution.vector[0], y: bestSolution.vector[1] }] : [],
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
                text: 'DE Population Positions (2D)',
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
            x: population.map(ind => ind.vector[0]),
            y: population.map(ind => ind.vector[1]),
            z: params.dimensions === 3 ? population.map(ind => ind.vector[2]) : [],
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 5,
                color: 'rgba(54, 162, 235, 0.8)',
            },
            name: 'Population',
        },
        {
            x: bestSolution ? [bestSolution.vector[0]] : [],
            y: bestSolution ? [bestSolution.vector[1]] : [],
            z: params.dimensions === 3 && bestSolution ? [bestSolution.vector[2]] : [],
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 10,
                color: 'rgba(255, 99, 132, 1)',
                symbol: 'diamond',
            },
            name: 'Best Solution',
        },
    ];

    const plotlyLayout = {
        title: 'DE Population Positions (3D)',
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
            <h1>Differential Evolution (DE) Visualization</h1>

            {/* Input Controls */}
            <div className=' flex justify-around items-center' style={{ marginBottom: '20px' }}>
                <h2>DE Parameters</h2>
                <form
                    onSubmit={(e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        if (!isRunning) {
                            startDE();
                        }
                    }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}
                >
                    <div className={inputContainerStyles}>
                        <label htmlFor="populationSize">Population Size:</label><br />
                        <input
                            className={inputStyles}
                            type="number"
                            id="populationSize"
                            name="populationSize"
                            // min="10"
                            max="1000"
                            value={params.populationSize}
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
                        <label htmlFor="mutationFactor">Mutation Factor (F):</label><br />
                        <input
                            className={inputStyles}
                            type="number"
                            id="mutationFactor"
                            name="mutationFactor"
                            step="0.1"
                            min="0.1"
                            max="2"
                            value={params.mutationFactor}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                        />
                    </div>
                    <div className={inputContainerStyles}>
                        <label htmlFor="crossoverRate">Crossover Rate (CR):</label><br />
                        <input
                            className={inputStyles}
                            type="number"
                            id="crossoverRate"
                            name="crossoverRate"
                            step="0.1"
                            min="0"
                            max="1"
                            value={params.crossoverRate}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                        />
                    </div>
                    <div style={{ alignSelf: 'flex-end' }}>
                        <Button
                            color='green'
                            type="submit"
                            disabled={isRunning}
                            style={{ padding: '10px 20px', fontSize: '16px' }}>
                            Start DE
                        </Button>
                        <Button
                            color='green'
                            type="button"
                            onClick={stopDE}
                            disabled={!isRunning}
                            style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}
                        >
                            Stop DE
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
                    <div className='w-full'>
                        {/* 2D Scatter Plot */}
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
                        {bestSolution ? bestSolution.vector.map(pos => pos.toFixed(4)).join(', ') : 'N/A'}
                        ]
                    </p>
                </div>
            </div>
        </div>
    );

};

export default DEVisualizer;
