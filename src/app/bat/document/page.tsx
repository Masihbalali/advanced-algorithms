import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BatDoc: React.FC = () => {
    return (
        <div className="documentation-container p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Bat Algorithm (BA) Visualization Component Documentation</h1>

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
                        <li><a href="#objective-function" className="text-blue-600 hover:underline">Objective Function</a></li>
                        <li><a href="#initializebats" className="text-blue-600 hover:underline">Initialization (initializeBats)</a></li>
                        <li><a href="#ba-step" className="text-blue-600 hover:underline">BA Step</a></li>
                        <li><a href="#animation-loop-animateba" className="text-blue-600 hover:underline">Animation Loop (animateBA)</a></li>
                    </ul>
                </li>
                <li><a href="#rendering-the-ui" className="text-blue-600 hover:underline">Rendering the UI</a></li>
                <li><a href="#usage" className="text-blue-600 hover:underline">Usage</a></li>
            </ul>

            <section id="overview">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Overview</h2>
                <p>
                    The <code>BatVisualizer</code> component visualizes the workings of the <strong>Bat Algorithm (BA)</strong>, an optimization algorithm inspired by the echolocation behavior of bats. Users can modify key parameters and observe the optimization process via real-time charts.
                </p>
            </section>

            <section id="component-structure">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Component Structure</h2>

                <section id="imports-and-dependencies">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Imports and Dependencies</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`import React, { useState, useEffect, useRef } from 'react';
import { Line, Scatter } from 'react-chartjs-2';
import Plot from 'react-plotly.js';
import { Button } from '@material-tailwind/react';`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>React and Hooks</strong>: Core framework and state management.</li>
                        <li><strong>Charting Libraries</strong>:
                            <ul className="list-disc list-inside ml-5">
                                <li><strong>react-chartjs-2</strong> and <strong>react-plotly.js</strong>: To visualize 2D/3D bat positions and fitness history.</li>
                            </ul>
                        </li>
                    </ul>
                </section>

                <section id="typescript-interfaces">
                    <h3 className="text-xl font-semibold mt-4 mb-2">TypeScript Interfaces</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`interface BAParams {
    numBats: number;
    dimensions: 2 | 3;
    maxIterations: number;
    pulseRate: number;
    loudness: number;
    frequency: number;
}

interface Bat {
    position: number[];
    velocity: number[];
    fitness: number;
}`}
                        </SyntaxHighlighter>
                    </pre>
                    <ul className="list-disc list-inside mt-2">
                        <li><strong>BAParams</strong>: Configures the Bat Algorithm parameters.</li>
                        <li><strong>Bat</strong>: Defines an individual bat's attributes, including its position, velocity, and fitness score.</li>
                    </ul>
                </section>
            </section>

            <section id="state-management">
                <h2 className="text-2xl font-semibold mt-6 mb-4">State Management</h2>
                <p>The component employs React's <code>useState</code> and <code>useRef</code> hooks to manage the state and mutable variables:</p>
                <ul className="list-disc list-inside mt-2">
                    <li><strong>params</strong>: Holds the adjustable BA parameters.</li>
                    <li><strong>fitnessHistory</strong>: Stores the best fitness per iteration.</li>
                    <li><strong>positions</strong>: Tracks all bats' current positions.</li>
                    <li><strong>bestPosition</strong>: Saves the global best bat's position.</li>
                    <li><strong>isRunning</strong>: Signals if BA is actively running.</li>
                    <li><strong>ref variables</strong>: For mutable variables like positions and velocity, avoiding unnecessary re-renders.</li>
                </ul>
            </section>

            <section id="core-functions">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Core Functions</h2>

                <section id="objective-function">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Objective Function</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`const objectiveFunction = (X: number[]): number => {
    // Replace with an optimization-specific function
    return X.reduce((sum, x) => sum + x ** 2, 0);
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <p>The objective function calculates each bat's fitness, determining the optimization problem.</p>
                </section>

                <section id="initializebats">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Initialization (initializeBats)</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`const initializeBats = () => {
    // Initializes bats with random positions and velocities
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <p>This function initializes each bat's position and velocity randomly within the search space.</p>
                </section>

                <section id="ba-step">
                    <h3 className="text-xl font-semibold mt-4 mb-2">BA Step</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`const baStep = () => {
    // Updates bats' positions based on frequency, pulse, and loudness
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <p>Each iteration updates bats' positions and velocities based on BA's frequency and pulse mechanisms.</p>
                </section>

                <section id="animation-loop-animateba">
                    <h3 className="text-xl font-semibold mt-4 mb-2">Animation Loop (animateBA)</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        <SyntaxHighlighter language="typescript" style={coy}>
                            {`const animateBA = () => {
    // Triggers BA steps and updates visualization
};`}
                        </SyntaxHighlighter>
                    </pre>
                    <p>This function handles the animation loop, updating the positions and re-rendering the charts in real-time.</p>
                </section>
            </section>

            <section id="rendering-the-ui">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Rendering the UI</h2>
                <p>
                    The UI allows for parameter adjustments, charting the fitness over time and showing bat positions on 2D or 3D plots.
                </p>
            </section>

            <section id="usage">
                <h2 className="text-2xl font-semibold mt-6 mb-4">Usage</h2>
                <p>Include <code>BatVisualizer</code> in your main app file and adjust parameters as needed for optimization experimentation.</p>
            </section>
        </div>
    );
};

export default BatDoc;
