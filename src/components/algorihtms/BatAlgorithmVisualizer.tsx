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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Bat Algorithm parameters interface
interface BatParams {
    populationSize: number;
    dimensions: 2 | 3;
    maxIterations: number;
    frequencyMin: number;
    frequencyMax: number;
    pulseRate: number; // Pulse rate
    loudness: number;  // Loudness
}

// Individual bat interface
interface Bat {
    position: number[];
    velocity: number[];
    fitness: number;
    frequency: number;
    pulseRate: number;
    loudness: number;
}

const BatAlgorithmVisualizer: React.FC = () => {
    const defaultParams: BatParams = {
        populationSize: 30,
        dimensions: 3, 
        maxIterations: 100,
        frequencyMin: 0,
        frequencyMax: 2,
        pulseRate: 0.5,
        loudness: 0.5,
    };

    const minBound = -5.12;
    const maxBound = 5.12;

    const [params, setParams] = useState<BatParams>(defaultParams);
    const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
    const [population, setPopulation] = useState<Bat[]>([]);
    const [bestSolution, setBestSolution] = useState<Bat | null>(null);
    const [currentIteration, setCurrentIteration] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const populationRef = useRef<Bat[]>([]);
    const animationFrameRef = useRef<NodeJS.Timeout | null>(null);
    const shouldStopRef = useRef<boolean>(false);

    // Rastrigin function (fitness evaluation)
    const rastrigin = (X: number[]): number => {
        const A = 10;
        return A * X.length + X.reduce((sum, x) => sum + (x ** 2 - A * Math.cos(2 * Math.PI * x)), 0);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setParams(prev => ({
            ...prev,
            [name]: parseFloat(value)
        }));
    };

    const initializeBatAlgorithm = (): void => {
        const { populationSize, dimensions } = params;
        const initialPopulation: Bat[] = Array.from({ length: populationSize }, () => {
            const position = Array.from({ length: dimensions }, () => Math.random() * (maxBound - minBound) + minBound);
            const velocity = Array.from({ length: dimensions }, () => 0);
            const fitness = rastrigin(position);
            const frequency = Math.random();
            const pulseRate = params.pulseRate;
            const loudness = params.loudness;
            return { position, velocity, fitness, frequency, pulseRate, loudness };
        });

        populationRef.current = initialPopulation;
        setPopulation([...populationRef.current]);

        const gBest = initialPopulation.reduce((best, current) => current.fitness < best.fitness ? current : best);
        setBestSolution(gBest);
        setFitnessHistory([gBest.fitness]);
        setCurrentIteration(0);
        shouldStopRef.current = false;
    };

    const batStep = (): void => {
        const { populationSize, dimensions, frequencyMin, frequencyMax } = params;
        const alpha = 0.9; // Loudness reduction
        const gamma = 0.9; // Pulse rate increase
        const newPopulation: Bat[] = [];

        for (let i = 0; i < populationSize; i++) {
            const bat = populationRef.current[i];
            const newBat = { ...bat };

            // Update frequency
            newBat.frequency = frequencyMin + Math.random() * (frequencyMax - frequencyMin);

            // Update velocity and position
            newBat.velocity = bat.velocity.map((v, idx) =>
                v + (newBat.frequency * (bat.position[idx] - bestSolution!.position[idx]))
            );
            newBat.position = bat.position.map((p, idx) =>
                Math.max(minBound, Math.min(maxBound, p + newBat.velocity[idx]))
            );

            // Local search
            if (Math.random() > newBat.pulseRate) {
                newBat.position = newBat.position.map(p => p + newBat.loudness * (Math.random() - 0.5));
            }

            newBat.fitness = rastrigin(newBat.position);

            // Accept new solution if it's better
            if (newBat.fitness < bat.fitness && Math.random() < newBat.loudness) {
                newPopulation.push(newBat);
            } else {
                newPopulation.push(bat);
            }

            // Update pulse rate and loudness
            newBat.pulseRate *= gamma;
            newBat.loudness *= alpha;
        }

        populationRef.current = newPopulation;
        setPopulation([...populationRef.current]);

        const gBest = newPopulation.reduce((best, current) => current.fitness < best.fitness ? current : best);
        setBestSolution(gBest);
        setFitnessHistory(prev => [...prev, gBest.fitness]);
        setCurrentIteration(prev => prev + 1);
    };

    const animateBat = (): void => {
        if (currentIteration < params.maxIterations && !shouldStopRef.current) {
            batStep();
            animationFrameRef.current = setTimeout(animateBat, 100); 
        } else {
            setIsRunning(false);
        }
    };

    const startBat = (): void => {
        if (!isRunning) {
            initializeBatAlgorithm();
            setIsRunning(true);
        }
    };

    const stopBat = (): void => {
        if (isRunning) {
            shouldStopRef.current = true;
            if (animationFrameRef.current) {
                clearTimeout(animationFrameRef.current);
            }
            setIsRunning(false);
        }
    };

    useEffect(() => {
        if (isRunning) {
            animateBat();
        }

        return () => {
            if (animationFrameRef.current) {
                clearTimeout(animationFrameRef.current);
            }
        };
    }, [isRunning, currentIteration]);

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
            legend: { position: 'top' as const },
            title: { display: true, text: 'Bat Algorithm Fitness Over Generations' },
        },
        scales: {
            x: { title: { display: true, text: 'Generation' } },
            y: { title: { display: true, text: 'Fitness' } },
        },
    };

    const scatter2DData = {
        datasets: [
            { label: 'Population', data: population.map(b => ({ x: b.position[0], y: b.position[1] })), backgroundColor: 'rgba(54, 162, 235, 1)' },
            { label: 'Best Solution', data: bestSolution ? [{ x: bestSolution.position[0], y: bestSolution.position[1] }] : [], backgroundColor: 'rgba(255, 99, 132, 1)', pointRadius: 8 },
        ],
    };

    const scatter2DOptions = {
        responsive: true,
        plugins: { legend: { position: 'top' as const }, title: { display: true, text: 'Bat Population Positions (2D)' } },
        scales: {
            x: { title: { display: true, text: 'X' }, min: minBound, max: maxBound },
            y: { title: { display: true, text: 'Y' }, min: minBound, max: maxBound },
        },
    };

    const plotlyData = [
        { x: population.map(b => b.position[0]), y: population.map(b => b.position[1]), z: params.dimensions === 3 ? population.map(b => b.position[2]) : [], mode: 'markers', type: 'scatter3d', marker: { size: 5, color: 'rgba(54, 162, 235, 0.8)' }, name: 'Population' },
        { x: bestSolution ? [bestSolution.position[0]] : [], y: bestSolution ? [bestSolution.position[1]] : [], z: params.dimensions === 3 && bestSolution ? [bestSolution.position[2]] : [], mode: 'markers', type: 'scatter3d', marker: { size: 10, color: 'rgba(255, 99, 132, 1)' }, name: 'Best Solution' },
    ];

    return (
        <div className="flex flex-col items-center p-8">
            <h2 className="text-2xl font-bold mb-4">Bat Algorithm (الگوریتم خفاش)</h2>

            <form onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()} className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(params).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                            <label htmlFor={key} className="font-semibold">{key}</label>
                            <input type="number" name={key} value={value} onChange={handleChange} className="border p-2" />
                        </div>
                    ))}
                </div>
                <Button onClick={startBat} color="green" className="mt-4" disabled={isRunning}>Start</Button>
                <Button onClick={stopBat} color="red" className="mt-4 ml-2" disabled={!isRunning}>Stop</Button>
            </form>

            <div className="flex flex-col w-full">
                <div className="mb-8">
                    <Line data={lineChartData} options={lineChartOptions} />
                </div>

                <div className="mb-8">
                    {params.dimensions === 2 ? (
                        <Scatter data={scatter2DData} options={scatter2DOptions} />
                    ) : (
                        <Plot data={plotlyData} layout={{ title: 'Bat Population Positions (3D)', autosize: true }} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BatAlgorithmVisualizer;
