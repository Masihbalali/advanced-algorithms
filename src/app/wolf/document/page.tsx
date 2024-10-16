// src/components/documentation/WorldDocumentation.jsx

import React from 'react';

// Optional: If you want syntax highlighting, you can use react-syntax-highlighter
// Uncomment the following lines and install the package if desired.
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

const WorldDocumentation = () => {
    return (
        <div className="documentation-container p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Grey Wolf Optimizer (GWO) Visualization Component Documentation</h1>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Table of Contents</h2>
            <ul className="list-disc list-inside mb-8">
                <li><a href="#overview" className="text-blue-600 hover:underline">Overview</a></li>
                <li><a href="#component-structure" className="text-blue-600 hover:underline">Component Structure</a>
                    <ul className="list-disc list-inside ml-5">
                        <li><a href="#imports-and-dependencies" className="text-blue-600 hover:underline">Imports and Dependencies</a></li>
                        <li><a href="#typescript-interfaces" className="text-blue-600 hover:underline">TypeScript Interfaces</a></li>
                    </ul>
                </li>
                <li><a href="#state-management" className="text-blue-600 hover:underline">State Management</a></li>
                <li><a href="#core-functions" className="text-blue-600 hover:underline">Core Functions</a>
                    <ul className="list-disc list-inside ml-5">
                        <li><a href="#rastrigin-function" className="text-blue-600 hover:underline">Rastrigin Function</a></li>
                        <li><a href="#handling-input-changes" className="text-blue-600 hover:underline">Handling Input Changes</a></li>
                        <li><a href="#initialization-initializegwo" className="text-blue-600 hover:underline">Initialization (initializeGWO)</a></li>
                        <li><a href="#gwo-iteration-step-gwostep" className="text-blue-600 hover:underline">GWO Iteration Step (gwoStep)</a></li>
                        <li><a href="#animation-loop-animategwo" className="text-blue-600 hover:underline">Animation Loop (animateGWO)</a></li>
                        <li><a href="#start-and-stop-functions" className="text-blue-600 hover:underline">Start and Stop Functions</a></li>
                    </ul>
                </li>
                <li><a href="#effect-hooks" className="text-blue-600 hover:underline">Effect Hooks</a></li>
                <li><a href="#data-preparation-for-visualization" className="text-blue-600 hover:underline">Data Preparation for Visualization</a>
                    <ul className="list-disc list-inside ml-5">
                        <li><a href="#line-chart-data" className="text-blue-600 hover:underline">Line Chart Data</a></li>
                        <li><a href="#2d-scatter-plot-data" className="text-blue-600 hover:underline">2D Scatter Plot Data</a></li>
                        <li><a href="#3d-scatter-plot-data" className="text-blue-600 hover:underline">3D Scatter Plot Data</a></li>
                    </ul>
                </li>
                <li><a href="#rendering-the-ui" className="text-blue-600 hover:underline">Rendering the UI</a>
                    <ul className="list-disc list-inside ml-5">
                        <li><a href="#input-controls" className="text-blue-600 hover:underline">Input Controls</a></li>
                        <li><a href="#charts" className="text-blue-600 hover:underline">Charts</a></li>
                        <li><a href="#status-indicators" className="text-blue-600 hover:underline">Status Indicators</a></li>
                    </ul>
                </li>
                <li><a href="#how-it-works" className="text-blue-600 hover:underline">How It Works</a></li>
                <li><a href="#usage" className="text-blue-600 hover:underline">Usage</a></li>
                <li><a href="#conclusion" className="text-blue-600 hover:underline">Conclusion</a></li>
            </ul>

            <section id="overview">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Overview</h2>
                <p>
                    The <code>GWOVisualizer</code> component serves as an educational and analytical tool to demonstrate how the <strong>Grey Wolf Optimizer (GWO)</strong> functions. By allowing users to adjust key parameters and observe the algorithm's progress through dynamic charts, it offers insights into optimization techniques and algorithm behavior.
                </p>
            </section>

            <section id="component-structure">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Component Structure</h2>

                <section id="imports-and-dependencies">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Imports and Dependencies</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto ">
                        <SyntaxHighlighter language="typescript" style={coy}>

                            {`import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
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
import { Button } from '@material-tailwind/react';`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>React and Hooks</strong>: For building the component and managing state.</li>
                        <li><strong>Charting Libraries</strong>:
                            <ul className="list-disc list-inside ml-5">
                                <li><strong>react-chartjs-2</strong> and <strong>Chart.js</strong>: For 2D line and scatter plots.</li>
                                <li><strong>react-plotly.js</strong>: For 3D scatter plots.</li>
                            </ul>
                        </li>
                        <li><strong>Material Tailwind</strong>: For styled buttons.</li>
                    </ul>
                </section>

                <section id="typescript-interfaces">
                    <h3 className="text-xl font-semibold mt-4 mb-2">TypeScript Interfaces</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`interface GWOParams {
    populationSize: number;
    dimensions: 2 | 3;
    maxIterations: number;
    a: number; // Decreasing parameter 'a' from 2 to 0
}

interface Wolf {
    position: number[];
    fitness: number;
}`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>GWOParams</strong>: Defines the parameters for the GWO algorithm.</li>
                        <li><strong>Wolf</strong>: Represents an individual wolf with its position in the search space and its fitness value.</li>
                    </ul>
                </section>
            </section>

            <section id="state-management">
                <h2 className="text-2xl font-semibold mt-6 mb-4">State Management</h2>
                <p>
                    The component utilizes React's <code>useState</code> and <code>useRef</code> hooks to manage its state and mutable variables.
                </p>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    <SyntaxHighlighter language="typescript" style={coy}>
                        {`const [params, setParams] = useState<GWOParams>(defaultParams);
const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
const [population, setPopulation] = useState<Wolf[]>([]);
const [alpha, setAlpha] = useState<Wolf | null>(null);
const [beta, setBeta] = useState<Wolf | null>(null);
const [delta, setDelta] = useState<Wolf | null>(null);
const [currentIteration, setCurrentIteration] = useState<number>(0);
const [isRunning, setIsRunning] = useState<boolean>(false);

const populationRef = useRef<Wolf[]>([]);
const animationFrameRef = useRef<NodeJS.Timeout | null>(null);
const shouldStopRef = useRef<boolean>(false>;`}
                    </SyntaxHighlighter>
                </pre>
                <ul className="list-disc list-inside mt-2">
                    <li><strong>params</strong>: Stores the current parameters of the GWO algorithm.</li>
                    <li><strong>fitnessHistory</strong>: Tracks the best fitness value at each iteration.</li>
                    <li><strong>population</strong>: Current population of wolves.</li>
                    <li><strong>alpha, beta, delta</strong>: The top three wolves representing the best solutions.</li>
                    <li><strong>currentIteration</strong>: Tracks the current iteration count.</li>
                    <li><strong>isRunning</strong>: Indicates whether the GWO algorithm is currently running.</li>
                    <li><strong>Refs</strong>: Used for mutable variables that don't trigger re-renders, such as the population array and animation frame.</li>
                </ul>
            </section>

            <section id="core-functions">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Core Functions</h2>

                <section id="rastrigin-function">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Rastrigin Function</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`const rastrigin = (X: number[]): number => {
    const A = 10;
    return A * X.length + X.reduce((sum, x) => sum + (x ** 2 - A * Math.cos(2 * Math.PI * x)), 0);
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Purpose</strong>: Defines the Rastrigin function, a common non-convex function used as a performance test problem for optimization algorithms.</li>
                        <li><strong>Usage</strong>: Evaluates the fitness of each wolf based on its position.</li>
                    </ul>
                </section>

                <section id="handling-input-changes">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Handling Input Changes</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
        ...prev,
        [name]: name === 'dimensions' || name === 'populationSize' || name === 'maxIterations'
            ? parseInt(value)
            : parseFloat(value)
    }));
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Functionality</strong>: Updates the GWO parameters based on user input.</li>
                        <li><strong>Type Handling</strong>: Converts input values to appropriate types (<code>int</code> or <code>float</code>).</li>
                    </ul>
                </section>

                <section id="initialization-initializegwo">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Initialization (<code>initializeGWO</code>)</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`const initializeGWO = (): void => {
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
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Purpose</strong>: Sets up the initial state of the GWO algorithm.</li>
                        <li><strong>Process</strong>:
                            <ul className="list-disc list-inside ml-5">
                                <li><strong>Population Initialization</strong>: Creates a population of wolves with random positions within the defined bounds.</li>
                                <li><strong>Fitness Evaluation</strong>: Calculates the fitness of each wolf using the Rastrigin function.</li>
                                <li><strong>Hierarchy Establishment</strong>: Sorts the population to identify the top three wolves (alpha, beta, delta).</li>
                                <li><strong>State Updates</strong>: Initializes the fitness history and iteration count.</li>
                            </ul>
                        </li>
                    </ul>
                </section>

                <section id="gwo-iteration-step-gwostep">
                    <h3 className="text-xl font-semibold mt-4 mb-2">GWO Iteration Step (<code>gwoStep</code>)</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`const gwoStep = (): void => {
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
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Purpose</strong>: Executes a single iteration of the GWO algorithm.</li>
                        <li><strong>Process</strong>:
                            <ol className="list-decimal list-inside ml-5">
                                <li><strong>Parameter Update</strong>: Decreases the parameter <code>a</code> linearly from 2 to 0.</li>
                                <li><strong>Position Update</strong>: For each wolf, updates its position based on the positions of alpha, beta, and delta wolves using coefficient vectors <code>A</code> and <code>C</code>.</li>
                                <li><strong>Exploration vs. Exploitation</strong>: Introduces randomness to balance exploration and exploitation.</li>
                                <li><strong>Boundary Handling</strong>: Ensures that wolves remain within the defined search space.</li>
                                <li><strong>Fitness Evaluation</strong>: Recalculates the fitness of each wolf after movement.</li>
                                <li><strong>Hierarchy Update</strong>: Re-identifies the top three wolves.</li>
                                <li><strong>State Updates</strong>: Updates the population, fitness history, parameter <code>a</code>, and iteration count.</li>
                            </ol>
                        </li>
                    </ul>
                </section>

                <section id="animation-loop-animategwo">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Animation Loop (<code>animateGWO</code>)</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`const animateGWO = (): void => {
    if (currentIteration < params.maxIterations && !shouldStopRef.current) {
        gwoStep();
        animationFrameRef.current = setTimeout(animateGWO, 100); // Adjust delay for animation speed
    } else {
        setIsRunning(false);
    }
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Purpose</strong>: Manages the iterative execution of the GWO algorithm.</li>
                        <li><strong>Mechanism</strong>: Recursively calls itself with a delay (e.g., 100ms) to create an animation effect.</li>
                        <li><strong>Termination</strong>: Stops when the maximum number of iterations is reached or when the user stops the algorithm.</li>
                    </ul>
                </section>

                <section id="start-and-stop-functions">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Start and Stop Functions</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`const startGWO = (): void => {
    if (!isRunning) {
        initializeGWO();
        setIsRunning(true);
    }
};

const stopGWO = (): void => {
    if (isRunning) {
        shouldStopRef.current = true;
        if (animationFrameRef.current) {
            clearTimeout(animationFrameRef.current);
        }
        setIsRunning(false);
    }
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>startGWO</strong>: Initializes and starts the GWO algorithm if it's not already running.</li>
                        <li><strong>stopGWO</strong>: Stops the GWO algorithm by setting a flag and clearing any pending animation frames.</li>
                    </ul>
                </section>
            </section>

            <section id="effect-hooks">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Effect Hooks</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    <SyntaxHighlighter language="typescript" style={coy}>
                        {`useEffect(() => {
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
}, [isRunning, currentIteration]);`}
                    </SyntaxHighlighter>
                </pre>
                <ul className="list-disc list-inside mt-2">
                    <li><strong>Functionality</strong>: Triggers the animation loop when <code>isRunning</code> is <code>true</code>.</li>
                    <li><strong>Cleanup</strong>: Ensures that any pending animation frames are cleared when the component unmounts to prevent memory leaks.</li>
                </ul>
            </section>

            <section id="data-preparation-for-visualization">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Data Preparation for Visualization</h2>

                <section id="line-chart-data">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Line Chart Data</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`const lineChartData = {
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
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Purpose</strong>: Visualizes the best fitness value over iterations.</li>
                        <li><strong>Components</strong>:
                            <ul className="list-disc list-inside ml-5">
                                <li><strong>Labels</strong>: Iteration numbers.</li>
                                <li><strong>Dataset</strong>: Best fitness values with styling for the line.</li>
                            </ul>
                        </li>
                    </ul>
                </section>

                <section id="2d-scatter-plot-data">
                    <h3 className="text-xl font-semibold mt-4 mb-2">2D Scatter Plot Data</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`const scatter2DData = {
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
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Purpose</strong>: Displays the positions of the population in a 2D space.</li>
                        <li><strong>Components</strong>:
                            <ul className="list-disc list-inside ml-5">
                                <li><strong>Population</strong>: All wolves plotted in blue.</li>
                                <li><strong>Alpha</strong>: The best wolf highlighted in red.</li>
                            </ul>
                        </li>
                    </ul>
                </section>

                <section id="3d-scatter-plot-data">
                    <h3 className="text-xl font-semibold mt-4 mb-2">3D Scatter Plot Data</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`const plotlyData = [
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
];`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Purpose</strong>: Provides a 3D visualization of the population when <code>dimensions</code> is set to 3.</li>
                        <li><strong>Components</strong>:
                            <ul className="list-disc list-inside ml-5">
                                <li><strong>Population</strong>: All wolves plotted in blue.</li>
                                <li><strong>Alpha</strong>: The best wolf highlighted in red with a diamond symbol.</li>
                            </ul>
                        </li>
                    </ul>
                </section>
            </section>

            <section id="rendering-the-ui">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Rendering the UI</h2>

                <section id="input-controls">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Input Controls</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="jsx" style={coy}>
                            {`<div className="flex justify-around items-center mb-4 w-full">
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
</div>`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Purpose</strong>: Allows users to adjust GWO parameters such as population size, dimensions, maximum iterations, and the parameter <code>a</code>.</li>
                        <li><strong>Features</strong>:
                            <ul className="list-disc list-inside ml-5">
                                <li><strong>Form Submission</strong>: Starts the GWO algorithm.</li>
                                <li><strong>Buttons</strong>: Start and Stop controls to manage the execution.</li>
                            </ul>
                        </li>
                    </ul>
                </section>

                <section id="charts">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Charts</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="jsx" style={coy}>
                            {`<div className="flex flex-col gap-8 w-full">
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
</div>`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Line Chart</strong>: Displays the progression of the best fitness value over iterations.</li>
                        <li><strong>2D Scatter Plot</strong>: Shows the positions of all wolves in a two-dimensional search space.</li>
                        <li><strong>3D Scatter Plot</strong>: When enabled, visualizes the positions in a three-dimensional space using Plotly.</li>
                        <li><strong>Status Indicators</strong>: Provides real-time information about the current iteration, best fitness, and the position of the alpha wolf.</li>
                    </ul>
                </section>

                <section id="status-indicators">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Status Indicators</h3>
                    <p>
                        - <strong>Current Iteration</strong>: Shows the progress of the algorithm.<br />
                        - <strong>Global Best Fitness</strong>: Displays the best fitness value found so far.<br />
                        - <strong>Global Best Position</strong>: Lists the coordinates of the best solution.
                    </p>
                </section>
            </section>

            <section id="how-it-works">
                <h2 className="text-2xl font-semibold mt-6 mb-4">How It Works</h2>
                <ol className="list-decimal list-inside mb-6">
                    <li><strong>Initialization</strong>:
                        <ul className="list-disc list-inside ml-5">
                            <li>Users set the GWO parameters via input fields.</li>
                            <li>Upon clicking "Start GWO," the <code>initializeGWO</code> function generates an initial population of wolves with random positions within the defined bounds.</li>
                            <li>The fitness of each wolf is evaluated using the Rastrigin function.</li>
                            <li>The top three wolves are identified as alpha, beta, and delta.</li>
                        </ul>
                    </li>
                    <li><strong>Iteration</strong>:
                        <ul className="list-disc list-inside ml-5">
                            <li>The <code>gwoStep</code> function updates each wolf's position based on the positions of alpha, beta, and delta wolves.</li>
                            <li>The parameter <code>a</code> decreases linearly from 2 to 0, controlling the exploration-exploitation balance.</li>
                            <li>After updating positions, the fitness of each wolf is recalculated.</li>
                            <li>The hierarchy (alpha, beta, delta) is updated based on the new fitness values.</li>
                            <li>Fitness history and iteration count are updated to reflect the progress.</li>
                        </ul>
                    </li>
                    <li><strong>Visualization</strong>:
                        <ul className="list-disc list-inside ml-5">
                            <li><strong>Line Chart</strong>: Continuously updates to show the best fitness over iterations.</li>
                            <li><strong>Scatter Plots</strong>: Display the current positions of all wolves. If in 3D mode, a Plotly 3D scatter plot provides an additional perspective.</li>
                            <li><strong>Status Indicators</strong>: Provide real-time feedback on the algorithm's progress and the best solution found.</li>
                        </ul>
                    </li>
                    <li><strong>Control</strong>:
                        <ul className="list-disc list-inside ml-5">
                            <li>Users can stop the algorithm at any time by clicking the "Stop GWO" button.</li>
                            <li>Parameter inputs are disabled while the algorithm is running to prevent changes mid-execution.</li>
                        </ul>
                    </li>
                </ol>
            </section>

            <section id="usage">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Usage</h2>
                <ol className="list-decimal list-inside mb-6">
                    <li><strong>Setting Parameters</strong>:
                        <ul className="list-disc list-inside ml-5">
                            <li><strong>Population Size</strong>: Number of wolves in the population (e.g., 30).</li>
                            <li><strong>Dimensions</strong>: Dimensionality of the search space (2 or 3).</li>
                            <li><strong>Max Iterations</strong>: Maximum number of iterations the algorithm will perform.</li>
                            <li><strong>Parameter a</strong>: Controls the exploration-exploitation balance, decreasing from 2 to 0 over iterations.</li>
                        </ul>
                    </li>
                    <li><strong>Starting the Algorithm</strong>:
                        <ul className="list-disc list-inside ml-5">
                            <li>Click the "Start GWO" button to begin the optimization process.</li>
                        </ul>
                    </li>
                    <li><strong>Observing the Process</strong>:
                        <ul className="list-disc list-inside ml-5">
                            <li>Watch the line chart to see how the best fitness value improves over time.</li>
                            <li>Observe the scatter plots to visualize the movement and convergence of wolves toward optimal solutions.</li>
                        </ul>
                    </li>
                    <li><strong>Stopping the Algorithm</strong>:
                        <ul className="list-disc list-inside ml-5">
                            <li>Click the "Stop GWO" button to halt the process at any point.</li>
                        </ul>
                    </li>
                </ol>
            </section>

            <section id="conclusion">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Conclusion</h2>
                <p>
                    The <code>GWOVisualizer</code> component is a comprehensive tool that effectively demonstrates the workings of the Grey Wolf Optimizer algorithm. By providing interactive controls and real-time visualizations, it serves as both an educational resource and an analytical tool for understanding optimization processes. Whether you're a student learning about optimization algorithms or a developer implementing GWO for practical applications, this component offers valuable insights into the algorithm's dynamics and performance.
                </p>
            </section>
        </div>
    );
};

export default WorldDocumentation;
