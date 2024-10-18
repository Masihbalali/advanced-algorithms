'use client'

import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { Line, Scatter } from 'react-chartjs-2';
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

// Define TypeScript interfaces for Genetic Algorithm parameters
interface GAParams {
    populationSize: number;
    crossoverRate: number;
    mutationRate: number;
    maxGenerations: number;
    dimensions: number; // Supports 2D and 3D
}

const GeneticAlgorithmVisualizer: React.FC = () => {
    // Default GA Parameters
    const defaultParams: GAParams = {
        populationSize: 50,
        crossoverRate: 0.7,
        mutationRate: 0.01,
        maxGenerations: 100,
        dimensions: 3, // 2D or 3D visualization
    };

    // Bounds for the search space
    const minBound = -5.12;
    const maxBound = 5.12;

    // State variables
    const [params, setParams] = useState<GAParams>(defaultParams);
    const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
    const [positions, setPositions] = useState<number[][]>([]);
    const [bestPosition, setBestPosition] = useState<number[]>([]);
    const [currentGeneration, setCurrentGeneration] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const inputContainerStyles = "flex justify-center items-center flex-col";
    const inputStyles = "text-black w-14 rounded text-center";

    // References to store mutable variables without causing re-renders
    const populationRef = useRef<number[][]>([]);
    const fitnessRef = useRef<number[]>([]);
    const bestFitnessRef = useRef<number>(Infinity);
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
            [name]: name === 'populationSize' || name === 'maxGenerations'
                ? parseInt(value)
                : parseFloat(value)
        }));
    };

    // Initialize the Genetic Algorithm
    const initializeGA = (): void => {
        const { populationSize, dimensions } = params;

        // Initialize population positions
        const initialPopulation: number[][] = Array.from({ length: populationSize }, () =>
            Array.from({ length: dimensions }, () => Math.random() * (maxBound - minBound) + minBound)
        );

        populationRef.current = initialPopulation.map(pos => [...pos]);

        // Initialize fitness based on the population
        const initialFitness: number[] = initialPopulation.map(pos => rastrigin(pos));
        fitnessRef.current = [...initialFitness];

        // Identify the global best
        const bestIndex: number = initialFitness.indexOf(Math.min(...initialFitness));
        const bestPos: number[] = [...initialPopulation[bestIndex]];

        // Initialize state
        setPositions([...populationRef.current]);
        setBestPosition([...bestPos]);
        setFitnessHistory([rastrigin(bestPos)]);
        setCurrentGeneration(0);
        bestFitnessRef.current = rastrigin(bestPos);
        shouldStopRef.current = false;
    };

    // Genetic Algorithm Step (Selection, Crossover, Mutation)
    const gaStep = (): void => {
        const { populationSize, crossoverRate, mutationRate, dimensions } = params;

        // Selection (Tournament selection or roulette wheel)
        const selectedParents = selectParents();

        // Crossover
        const offspring = performCrossover(selectedParents);

        // Mutation
        mutateOffspring(offspring);

        // Evaluate new population fitness
        const newFitness: number[] = offspring.map(pos => rastrigin(pos));

        // Update population and fitness
        populationRef.current = [...offspring];
        fitnessRef.current = [...newFitness];

        // Update best position
        const bestIndex: number = newFitness.indexOf(Math.min(...newFitness));
        const currentBestPos: number[] = [...offspring[bestIndex]];

        // Update best position and fitness
        if (newFitness[bestIndex] < bestFitnessRef.current) {
            setBestPosition([...currentBestPos]);
            bestFitnessRef.current = newFitness[bestIndex];
        }

        // Update fitness history
        setFitnessHistory(prev => [...prev, Math.min(...newFitness)]);

        // Update positions and generation count
        setPositions([...populationRef.current]);
        setCurrentGeneration(prev => prev + 1);
    };

    // Selection Method (Roulette Wheel)
    const selectParents = (): number[][] => {
        const { populationSize } = params;
        const totalFitness = fitnessRef.current.reduce((sum, fit) => sum + 1 / fit, 0);

        return Array.from({ length: populationSize }, () => {
            let pick = Math.random() * totalFitness;
            let cumulativeFitness = 0;

            for (let i = 0; i < populationSize; i++) {
                cumulativeFitness += 1 / fitnessRef.current[i];
                if (cumulativeFitness >= pick) {
                    return [...populationRef.current[i]];
                }
            }

            return populationRef.current[0];
        });
    };

    // Perform Crossover (Single-Point Crossover)
    const performCrossover = (parents: number[][]): number[][] => {
        const { crossoverRate, dimensions } = params;
        const offspring: number[][] = [];

        for (let i = 0; i < parents.length; i += 2) {
            const parent1 = parents[i];
            const parent2 = parents[i + 1] || parents[0];

            if (Math.random() < crossoverRate) {
                const crossoverPoint = Math.floor(Math.random() * dimensions);
                offspring.push([
                    ...parent1.slice(0, crossoverPoint),
                    ...parent2.slice(crossoverPoint)
                ]);
                offspring.push([
                    ...parent2.slice(0, crossoverPoint),
                    ...parent1.slice(crossoverPoint)
                ]);
            } else {
                offspring.push([...parent1]);
                offspring.push([...parent2]);
            }
        }

        return offspring;
    };

    // Mutate Offspring
    const mutateOffspring = (offspring: number[][]): void => {
        const { mutationRate, dimensions } = params;

        for (const individual of offspring) {
            for (let d = 0; d < dimensions; d++) {
                if (Math.random() < mutationRate) {
                    individual[d] += (Math.random() * 2 - 1);
                    individual[d] = Math.max(minBound, Math.min(maxBound, individual[d])); // Clamp values
                }
            }
        }
    };

    // Animation Loop
    const animateGA = (): void => {
        if (currentGeneration < params.maxGenerations && !shouldStopRef.current) {
            gaStep();
            animationFrameRef.current = setTimeout(animateGA, 100); // Adjust delay for animation speed
        } else {
            setIsRunning(false);
        }
    };

    // Start GA
    const startGA = (): void => {
        if (!isRunning) {
            initializeGA();
            setIsRunning(true);
        }
    };

    // Stop GA
    const stopGA = (): void => {
        if (isRunning) {
            shouldStopRef.current = true;
            if (animationFrameRef.current) {
                clearTimeout(animationFrameRef.current);
            }
            setIsRunning(false);
        }
    };

    // Effect to start animation when GA starts
    useEffect(() => {
        if (isRunning) {
            animateGA();
        }

        // Cleanup on unmount
        return () => {
            if (animationFrameRef.current) {
                clearTimeout(animationFrameRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning, currentGeneration]);

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
                text: 'Genetic Algorithm Progress',
            },
        },
    };

    return (
        <div className="w-full flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-4">Genetic Algorithm Visualizer</h1>

            {/* Input Parameters */}
            <div className={inputContainerStyles}>
                <label>Population Size:</label>
                <input type="number" name="populationSize" value={params.populationSize} onChange={handleChange} className={inputStyles} />
                <label>Crossover Rate:</label>
                <input type="number" name="crossoverRate" value={params.crossoverRate} onChange={handleChange} className={inputStyles} step="0.01" />
                <label>Mutation Rate:</label>
                <input type="number" name="mutationRate" value={params.mutationRate} onChange={handleChange} className={inputStyles} step="0.01" />
                <label>Max Generations:</label>
                <input type="number" name="maxGenerations" value={params.maxGenerations} onChange={handleChange} className={inputStyles} />
                <label>Dimensions:</label>
                <input type="number" name="dimensions" value={params.dimensions} onChange={handleChange} className={inputStyles} />
            </div>

            {/* Control Buttons */}
            <div className="flex justify-between mt-4">
                <Button onClick={startGA} disabled={isRunning}>Start</Button>
                <Button onClick={stopGA} disabled={!isRunning}>Stop</Button>
            </div>

            {/* Line Chart */}
            <div className="w-full mt-6">
                <Line data={lineChartData} options={lineChartOptions} />
            </div>

            {/* Scatter Plot */}
            {params.dimensions === 2 && (
                <div className="w-full mt-6">
                    <Scatter
                        data={{
                            datasets: [
                                {
                                    label: 'Positions',
                                    data: positions.map(p => ({ x: p[0], y: p[1] })),
                                    backgroundColor: 'rgba(255, 99, 132, 1)',
                                },
                                {
                                    label: 'Best Position',
                                    data: [{ x: bestPosition[0], y: bestPosition[1] }],
                                    backgroundColor: 'rgba(0, 255, 0, 1)',
                                    pointRadius: 5,
                                },
                            ],
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default GeneticAlgorithmVisualizer;
