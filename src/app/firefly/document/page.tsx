import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FireflyDoc: React.FC = () => {
    return (
        <div className="documentation-container p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Firefly Algorithm (FA) Visualization Component Documentation</h1>

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
                        <li><a href="#initialization-initializefa" className="text-blue-600 hover:underline">Initialization (initializeFA)</a></li>
                        <li><a href="#fa-iteration-step-fastep" className="text-blue-600 hover:underline">FA Iteration Step (faStep)</a></li>
                        <li><a href="#animation-loop-animatefa" className="text-blue-600 hover:underline">Animation Loop (animateFA)</a></li>
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
                    The <code>FAVisualizer</code> component serves as an educational and analytical tool to demonstrate how the <strong>Firefly Algorithm (FA)</strong> operates. By allowing users to adjust key parameters and observe the algorithm's progress through dynamic charts, it provides insights into optimization techniques and the behavior of the Firefly Algorithm.
                </p>
            </section>

            <section id="component-structure">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Component Structure</h2>

                <section id="imports-and-dependencies">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Imports and Dependencies</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
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
{`interface FAParams {
    numFireflies: number;
    dimensions: 2 | 3;
    maxIterations: number;
    alpha: number;    // Randomness parameter
    beta0: number;    // Initial attractiveness
    gamma: number;    // Light absorption coefficient
}

interface Firefly {
    position: number[];
    fitness: number;
}`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>FAParams</strong>: Defines the parameters for the FA algorithm.</li>
                        <li><strong>Firefly</strong>: Represents an individual firefly with its position in the search space and its fitness value.</li>
                    </ul>
                </section>
            </section>

            <section id="state-management">
                <h2 className="text-2xl font-semibold mt-6 mb-4">State Management</h2>
                <p>
                    The component utilizes React's <code>useState</code> and <code>useRef</code> hooks to manage its state and mutable variables:
                </p>
                <ul className="list-disc list-inside mt-2">
                    <li><strong>params</strong>: Stores the current parameters of the FA algorithm.</li>
                    <li><strong>fitnessHistory</strong>: Keeps track of the best fitness value at each iteration.</li>
                    <li><strong>positions</strong>: Holds the current positions of all fireflies.</li>
                    <li><strong>bestPosition</strong>: Stores the position of the global best firefly.</li>
                    <li><strong>currentIteration</strong>: Tracks the current iteration number.</li>
                    <li><strong>isRunning</strong>: Indicates whether the FA is currently running.</li>
                    <li><strong>positionsRef</strong>, <strong>brightnessRef</strong>, <strong>animationFrameRef</strong>, <strong>shouldStopRef</strong>: References to mutable variables that persist across renders without causing re-renders.</li>
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
                    <p>
                        The <strong>Rastrigin function</strong> is a non-convex function used as a performance test problem for optimization algorithms. It is highly multimodal, meaning it has many local minima, which makes it challenging for algorithms to find the global minimum.
                    </p>
                </section>

                <section id="handling-input-changes">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Handling Input Changes</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
{`const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
        ...prev,
        [name]: name === 'dimensions' || name === 'numFireflies' || name === 'maxIterations'
            ? parseInt(value)
            : parseFloat(value)
    }));
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <p>
                        This function handles changes in the input fields, updating the corresponding parameters in the state. It ensures that numerical values are correctly parsed and stored.
                    </p>
                </section>

                <section id="initialization-initializefa">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Initialization (<code>initializeFA</code>)</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
{`const initializeFA = (): void => {
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
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <p>
                        The <strong>initializeFA</strong> function sets up the initial state of the Firefly Algorithm by:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                        <li>Randomly initializing the positions of all fireflies within the defined search space.</li>
                        <li>Calculating the initial brightness (fitness) of each firefly using the Rastrigin function.</li>
                        <li>Identifying the global best firefly based on the lowest fitness value.</li>
                        <li>Setting the initial state variables, including positions, best position, fitness history, and iteration count.</li>
                    </ul>
                </section>

                <section id="fa-iteration-step-fastep">
                    <h3 className="text-xl font-semibold mt-4 mb-2">FA Iteration Step (<code>faStep</code>)</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
{`const faStep = (): void => {
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
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <p>
                        The <strong>faStep</strong> function performs a single iteration of the Firefly Algorithm by:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                        <li>Comparing each pair of fireflies and moving the less bright firefly towards the brighter one.</li>
                        <li>Calculating the attractiveness based on the distance between fireflies and the light absorption coefficient.</li>
                        <li>Updating the position of the firefly with added randomness to avoid local minima.</li>
                        <li>Clamping the firefly's position within the defined search space bounds.</li>
                        <li>Updating the brightness (fitness) of the moved firefly.</li>
                        <li>Tracking and updating the global best firefly if a better solution is found.</li>
                        <li>Recording the best fitness value for visualization purposes.</li>
                    </ul>
                </section>

                <section id="animation-loop-animatefa">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Animation Loop (<code>animateFA</code>)</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
{`const animateFA = (): void => {
    if (currentIteration < params.maxIterations && !shouldStopRef.current) {
        faStep();
        animationFrameRef.current = setTimeout(animateFA, 100); // Adjust delay for animation speed
    } else {
        setIsRunning(false);
    }
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <p>
                        The <strong>animateFA</strong> function controls the animation loop of the Firefly Algorithm by:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                        <li>Checking if the maximum number of iterations has been reached or if a stop has been requested.</li>
                        <li>Performing an iteration step using <code>faStep</code>.</li>
                        <li>Scheduling the next iteration using <code>setTimeout</code> to create an animation effect.</li>
                        <li>Stopping the animation and updating the running state when the algorithm completes.</li>
                    </ul>
                </section>

                <section id="start-and-stop-functions">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Start and Stop Functions</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
{`// Start FA
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
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <p>
                        These functions control the execution of the Firefly Algorithm:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>startFA</strong>: Initializes the algorithm and starts the animation loop if it's not already running.</li>
                        <li><strong>stopFA</strong>: Stops the animation loop and updates the running state.</li>
                    </ul>
                </section>
            </section>

            <section id="effect-hooks">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Effect Hooks</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    <SyntaxHighlighter language="typescript" style={coy}>
{`useEffect(() => {
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
}, [isRunning, currentIteration]);`}
                        </SyntaxHighlighter>
                </pre>
                <p>
                    The <code>useEffect</code> hook monitors the <code>isRunning</code> and <code>currentIteration</code> states to manage the animation loop. It ensures that the algorithm starts animating when triggered and cleans up any pending timeouts when the component unmounts or the animation stops.
                </p>
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
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <p>
                        Prepares the data and configuration for the <strong>Line Chart</strong> that visualizes the best fitness value over each iteration of the algorithm.
                    </p>
                </section>

                <section id="2d-scatter-plot-data">
                    <h3 className="text-xl font-semibold mt-4 mb-2">2D Scatter Plot Data</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
{`const scatter2DData = {
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
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <p>
                        Configures the <strong>2D Scatter Plot</strong> to display the positions of all fireflies and highlight the global best firefly.
                    </p>
                </section>

                <section id="3d-scatter-plot-data">
                    <h3 className="text-xl font-semibold mt-4 mb-2">3D Scatter Plot Data</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
{`const plotlyData: any[] = [
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
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <p>
                        Prepares the data and layout for the <strong>3D Scatter Plot</strong> using Plotly, which visualizes the positions of fireflies in a three-dimensional space when the algorithm is set to operate in 3D.
                    </p>
                </section>
            </section>

            <section id="rendering-the-ui">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Rendering the UI</h2>

                <section id="input-controls">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Input Controls</h3>
                    <p>
                        The input controls allow users to configure the parameters of the Firefly Algorithm before starting the visualization. These controls include:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Number of Fireflies</strong>: Sets how many fireflies are involved in the optimization process.</li>
                        <li><strong>Dimensions</strong>: Chooses between 2D and 3D optimization spaces.</li>
                        <li><strong>Max Iterations</strong>: Defines the maximum number of iterations the algorithm will perform.</li>
                        <li><strong>Randomness (alpha)</strong>: Controls the randomness in the movement of fireflies.</li>
                        <li><strong>Initial Attractiveness (beta0)</strong>: Determines the initial attractiveness of fireflies.</li>
                        <li><strong>Light Absorption (gamma)</strong>: Influences how light absorption affects the attractiveness over distance.</li>
                    </ul>
                </section>

                <section id="charts">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Charts</h3>
                    <p>
                        The component renders three types of charts to visualize the algorithm's progress:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Line Chart</strong>: Displays the best fitness value over each iteration, showing the algorithm's convergence.</li>
                        <li><strong>2D Scatter Plot</strong>: Visualizes the positions of all fireflies and highlights the global best in a two-dimensional space.</li>
                        <li><strong>3D Scatter Plot</strong>: (Optional) When set to 3D, this chart provides a three-dimensional view of firefly positions.</li>
                    </ul>
                </section>

                <section id="status-indicators">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Status Indicators</h3>
                    <p>
                        The status indicators provide real-time information about the algorithm's current state:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>Current Iteration</strong>: Shows the current iteration number out of the maximum iterations.</li>
                        <li><strong>Global Best Fitness</strong>: Displays the best fitness value found so far.</li>
                        <li><strong>Global Best Position</strong>: Lists the coordinates of the global best firefly.</li>
                    </ul>
                </section>
            </section>

            <section id="how-it-works">
                <h2 className="text-2xl font-semibold mt-6 mb-4">How It Works</h2>
                <p>
                    The Firefly Algorithm (FA) is a nature-inspired optimization algorithm based on the flashing behavior of fireflies. The <code>FAVisualizer</code> component demonstrates the FA by simulating a population of fireflies searching for the optimal solution in a defined search space.
                </p>
                <p>
                    Here's a step-by-step overview of how the component operates:
                </p>
                <ol className="list-decimal list-inside mt-2">
                    <li><strong>Initialization</strong>: Fireflies are randomly positioned within the search space. Each firefly's brightness is determined by its fitness value, calculated using the Rastrigin function.</li>
                    <li><strong>Iteration</strong>: In each iteration, fireflies move towards brighter (better) fireflies based on their attractiveness, which decreases with distance due to light absorption.</li>
                    <li><strong>Movement</strong>: The movement of each firefly is influenced by both the attractiveness of brighter fireflies and a randomness factor to maintain diversity in the population.</li>
                    <li><strong>Updating Best Solution</strong>: After each movement, the algorithm checks if any firefly has achieved a better fitness value than the current global best and updates accordingly.</li>
                    <li><strong>Visualization</strong>: Throughout the iterations, the component updates the charts to reflect the movement of fireflies and the improvement in fitness values.</li>
                    <li><strong>Termination</strong>: The algorithm runs until the maximum number of iterations is reached or the user stops the process manually.</li>
                </ol>
            </section>

            <section id="usage">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Usage</h2>
                <p>
                    To integrate the <code>FAVisualizer</code> component into your project, follow these steps:
                </p>
                <ol className="list-decimal list-inside mt-2">
                    <li>
                        <strong>Install Dependencies</strong>: Ensure that the required libraries are installed in your project.
                        <pre className="bg-gray-100 p-4 rounded overflow-auto mt-2">
                            <SyntaxHighlighter language="bash" style={coy}>
{`npm install react-chartjs-2 chart.js react-plotly.js @material-tailwind/react react-syntax-highlighter`}
                            </SyntaxHighlighter>
                        </pre>
                    </li>
                    <li>
                        <strong>Import and Use the Component</strong>: Import the <code>FAVisualizer</code> component and include it in your JSX.
                        <pre className="bg-gray-100 p-4 rounded overflow-auto mt-2">
                            <SyntaxHighlighter language="typescript" style={coy}>
{`import FAVisualizer from './path-to-component/FAVisualizer';

const App: React.FC = () => {
    return (
        <div>
            <FAVisualizer />
        </div>
    );
};

export default App;`}
                            </SyntaxHighlighter>
                        </pre>
                    </li>
                    <li>
                        <strong>Customize Parameters</strong>: Adjust the default parameters as needed to explore different optimization scenarios.
                    </li>
                </ol>
            </section>

            <section id="conclusion">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Conclusion</h2>
                <p>
                    The <code>FAVisualizer</code> component provides an interactive and visual representation of the Firefly Algorithm, making it easier to understand and analyze its behavior in solving optimization problems. By manipulating various parameters and observing the resulting changes in real-time, users can gain deeper insights into the dynamics of nature-inspired optimization techniques.
                </p>
                <p>
                    Whether you're an educator, student, or developer, this tool serves as a valuable resource for exploring and demonstrating the capabilities of the Firefly Algorithm in a clear and engaging manner.
                </p>
            </section>
        </div>
    );
};

export default FireflyDoc;
