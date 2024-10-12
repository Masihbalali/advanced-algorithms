'use client'
// components/PSOVisualizer.js

import React, { useState, useEffect, useRef } from 'react';
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

const PSOVisualizer = () => {
    // Default PSO Parameters
    const defaultParams = {
        numParticles: 30,
        dimensions: 3, // Changed to 3 for 3D visualization
        maxIterations: 100,
        w: 0.5,    // Inertia weight
        c1: 1.5,   // Cognitive coefficient
        c2: 1.5,   // Social coefficient
    };

    // Bounds for the search space
    const minBound = -5.12;
    const maxBound = 5.12;

    // State variables
    const [params, setParams] = useState(defaultParams);
    const [fitnessHistory, setFitnessHistory] = useState([]);
    const [positions, setPositions] = useState([]);
    const [bestPosition, setBestPosition] = useState([]);
    const [currentIteration, setCurrentIteration] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // References to store mutable variables without causing re-renders
    const positionsRef = useRef([]);
    const velocitiesRef = useRef([]);
    const pBestRef = useRef([]);
    const pBestScoresRef = useRef([]);
    const gBestRef = useRef([]);
    const animationFrameRef = useRef();
    const shouldStopRef = useRef(false);

    // Define the Rastrigin function
    const rastrigin = (X) => {
        const A = 10;
        return A * X.length + X.reduce((sum, x) => sum + (x ** 2 - A * Math.cos(2 * Math.PI * x)), 0);
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setParams(prev => ({
            ...prev,
            [name]: name === 'dimensions' || name === 'numParticles' || name === 'maxIterations' ? parseInt(value) : parseFloat(value)
        }));
    };

    // Initialize PSO
    const initializePSO = () => {
        const { numParticles, dimensions } = params;

        // Initialize positions and velocities
        const initialPositions = Array.from({ length: numParticles }, () =>
            Array.from({ length: dimensions }, () => Math.random() * (maxBound - minBound) + minBound)
        );
        const initialVelocities = Array.from({ length: numParticles }, () =>
            Array.from({ length: dimensions }, () => Math.random() * 2 - 1) // Velocities between -1 and 1
        );

        positionsRef.current = initialPositions.map(pos => [...pos]);
        velocitiesRef.current = initialVelocities.map(vel => [...vel]);

        // Initialize pBest and gBest
        pBestRef.current = initialPositions.map(pos => [...pos]);
        pBestScoresRef.current = initialPositions.map(pos => rastrigin(pos));

        const gBestIndex = pBestScoresRef.current.indexOf(Math.min(...pBestScoresRef.current));
        gBestRef.current = [...pBestRef.current[gBestIndex]];

        // Initialize state
        setPositions([...positionsRef.current]);
        setBestPosition([...gBestRef.current]);
        setFitnessHistory([rastrigin(gBestRef.current)]);
        setCurrentIteration(0);
        shouldStopRef.current = false;
    };

    // PSO Iteration Step
    const psoStep = () => {
        const { dimensions, w, c1, c2 } = params;
        const numParticles = params.numParticles;

        for (let i = 0; i < numParticles; i++) {
            for (let d = 0; d < dimensions; d++) {
                const r1 = Math.random();
                const r2 = Math.random();
                // Update velocity
                velocitiesRef.current[i][d] = w * velocitiesRef.current[i][d] +
                    c1 * r1 * (pBestRef.current[i][d] - positionsRef.current[i][d]) +
                    c2 * r2 * (gBestRef.current[d] - positionsRef.current[i][d]);
            }

            for (let d = 0; d < dimensions; d++) {
                // Update position
                positionsRef.current[i][d] += velocitiesRef.current[i][d];
                // Clamp to bounds
                positionsRef.current[i][d] = Math.max(minBound, Math.min(maxBound, positionsRef.current[i][d]));
            }

            // Evaluate fitness
            const fitness = rastrigin(positionsRef.current[i]);

            // Update pBest
            if (fitness < pBestScoresRef.current[i]) {
                pBestRef.current[i] = [...positionsRef.current[i]];
                pBestScoresRef.current[i] = fitness;

                // Update gBest
                if (fitness < rastrigin(gBestRef.current)) {
                    gBestRef.current = [...positionsRef.current[i]];
                }
            }
        }

        // Update state
        setPositions([...positionsRef.current]);
        setBestPosition([...gBestRef.current]);
        setFitnessHistory(prev => [...prev, rastrigin(gBestRef.current)]);
        setCurrentIteration(prev => prev + 1);
    };

    // Animation Loop
    const animatePSO = () => {
        if (currentIteration < params.maxIterations && !shouldStopRef.current) {
            psoStep();
            animationFrameRef.current = setTimeout(animatePSO, 100); // Adjust delay for animation speed
        } else {
            setIsRunning(false);
        }
    };

    // Start PSO
    const startPSO = () => {
        if (!isRunning) {
            initializePSO();
            setIsRunning(true);
        }
    };

    // Stop PSO
    const stopPSO = () => {
        if (isRunning) {
            shouldStopRef.current = true;
            clearTimeout(animationFrameRef.current);
            setIsRunning(false);
        }
    };

    // Effect to start animation when PSO starts
    useEffect(() => {
        if (isRunning) {
            animatePSO();
        }

        // Cleanup on unmount
        return () => {
            clearTimeout(animationFrameRef.current);
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
                position: 'top',
            },
            title: {
                display: true,
                text: 'PSO Best Fitness Over Iterations',
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

    // Prepare data for Scatter Plot
    const scatterData = {
        datasets: [
            {
                label: 'Particles',
                data: positions.map(pos => ({ x: pos[0], y: pos[1] })),
                backgroundColor: 'rgba(54, 162, 235, 1)',
            },
            {
                label: 'Global Best',
                data: [{ x: bestPosition[0], y: bestPosition[1] }],
                backgroundColor: 'rgba(255, 99, 132, 1)',
                pointRadius: 8,
            },
        ],
    };

    const scatterOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'PSO Particle Positions (2D)',
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
            x: positions.map(pos => pos[0]),
            y: positions.map(pos => pos[1]),
            z: positions.map(pos => pos[2]),
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 5,
                color: 'rgba(54, 162, 235, 0.8)',
            },
            name: 'Particles',
        },
        {
            x: [bestPosition[0]],
            y: [bestPosition[1]],
            z: [bestPosition[2]],
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
        title: 'PSO Particle Positions (3D)',
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
            <h1>Particle Swarm Optimization (PSO) Visualization</h1>

            {/* Input Controls */}
            <div style={{ marginBottom: '20px' }} className=' flex justify-around items-center'>
                <h2>PSO Parameters</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!isRunning) {
                            startPSO();
                        }
                    }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}
                >
                    <div>
                        <label htmlFor="numParticles">Number of Particles:</label><br />
                        <input
                            className='text-black'
                            type="number"
                            id="numParticles"
                            name="numParticles"
                            min="10"
                            max="1000"
                            value={params.numParticles}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="dimensions">Dimensions:</label><br />
                        <input
                            className='text-black'
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
                    <div>
                        <label htmlFor="maxIterations">Max Iterations:</label><br />
                        <input
                            className='text-black'
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
                    <div>
                        <label htmlFor="w">Inertia Weight (w):</label><br />
                        <input
                            className='text-black'
                            type="number"
                            id="w"
                            name="w"
                            step="0.1"
                            min="0"
                            max="1"
                            value={params.w}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="c1">Cognitive Coefficient (c1):</label><br />
                        <input
                            className='text-black'
                            type="number"
                            id="c1"
                            name="c1"
                            step="0.1"
                            min="0"
                            max="5"
                            value={params.c1}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="c2">Social Coefficient (c2):</label><br />
                        <input
                            className='text-black'
                            type="number"
                            id="c2"
                            name="c2"
                            step="0.1"
                            min="0"
                            max="5"
                            value={params.c2}
                            onChange={handleChange}
                            disabled={isRunning}
                            required
                        />
                    </div>
                    <div style={{ alignSelf: 'flex-end' }}>
                        <Button type="submit" disabled={isRunning} >
                            Start PSO
                        </Button>

                        <Button
                            type="button"
                            onClick={stopPSO}
                            disabled={!isRunning}
                        >
                            Stop PSO
                        </Button>
                    </div>
                </form>
            </div>
            <hr />

            {/* Charts */}
            <div className='p-20' style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {/* Line Chart */}

                <div className='flex flex-row gap-5 w-full'>
                    <div className='w-full'>
                        <Line data={lineChartData} options={lineChartOptions} />
                    </div>

                    {/* 2D Scatter Plot */}
                    {params.dimensions >= 2 && (
                        <div className='w-full'>
                            <Scatter data={scatterData} options={scatterOptions} />
                        </div>
                    )}
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
                    {params.dimensions === 3 && (
                        <p>Global Best Position: [{bestPosition.map(pos => pos.toFixed(4)).join(', ')}]</p>
                    )}
                    {params.dimensions === 2 && (
                        <p>Global Best Position: [{bestPosition.map(pos => pos.toFixed(4)).join(', ')}]</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PSOVisualizer;
