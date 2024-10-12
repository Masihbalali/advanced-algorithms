# Evolutionary Algorithms Visualization

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-13.4.7-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Chart.js](https://img.shields.io/badge/Chart.js-4.3.0-blue)
![Plotly.js](https://img.shields.io/badge/Plotly.js-2.20.0-blue)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Algorithms](#algorithms)
  - [Particle Swarm Optimization (PSO)](#particle-swarm-optimization-pso)
  - [Differential Evolution (DE)](#differential-evolution-de)
  - [Firefly Algorithm (FA)](#firefly-algorithm-fa)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Future Work](#future-work)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Welcome to the **Evolutionary Algorithms Visualization** project! This repository contains interactive visualizations of three powerful evolutionary and bio-inspired optimization algorithms:

1. **Particle Swarm Optimization (PSO)**
2. **Differential Evolution (DE)**
3. **Firefly Algorithm (FA)**

Built with **Next.js** and **React**, these visualizations utilize **Chart.js** and **Plotly.js** to provide real-time insights into the optimization processes, helping users understand how these algorithms explore and exploit the search space to find optimal solutions.

## Features

- **Interactive Controls**: Customize PSO parameters such as the number of particles, dimensions, inertia weight, cognitive and social coefficients.
- **Real-Time Visualization**: Watch algorithms run and visualize their progress through dynamic charts.
- **2D and 3D Charts**: Utilize both 2D scatter plots and 3D scatter plots to observe particle movements in the search space.
- **Start/Stop Functionality**: Begin or halt the optimization process at any time.
- **Responsive Design**: Ensure visualizations are accessible and well-displayed on various devices.

## Algorithms

### Particle Swarm Optimization (PSO)

**Particle Swarm Optimization (PSO)** is a population-based stochastic optimization technique inspired by the social behavior of birds flocking or fish schooling. It optimizes a problem by iteratively trying to improve a candidate solution with regard to a given measure of quality.

- **Key Concepts**:
  - **Particles**: Represent potential solutions.
  - **Velocity**: Determines the movement of particles in the search space.
  - **Personal Best (pBest)**: The best position a particle has achieved so far.
  - **Global Best (gBest)**: The best position found by the entire swarm.

### Differential Evolution (DE)

**Differential Evolution (DE)** is a simple yet powerful evolutionary algorithm suitable for continuous optimization problems. It optimizes a problem by iteratively improving a candidate solution based on the differences between randomly selected individuals in the population.

- **Key Concepts**:
  - **Population**: A set of candidate solutions.
  - **Mutation**: Creates a mutant vector by adding the weighted difference between two population vectors to a third vector.
  - **Crossover**: Combines the mutant vector with the target vector to produce a trial vector.
  - **Selection**: Chooses between the trial vector and the target vector based on fitness.

### Firefly Algorithm (FA)

**Firefly Algorithm (FA)** is inspired by the flashing behavior of fireflies. It is designed to solve optimization problems by exploiting the attractiveness of brighter fireflies to guide the search process.

- **Key Concepts**:
  - **Fireflies**: Represent candidate solutions.
  - **Brightness (Intensity)**: Represents the fitness of a firefly.
  - **Attractiveness**: Determines how much a firefly is attracted to another based on brightness and distance.
  - **Movement**: Fireflies move towards brighter ones, with some randomness to maintain diversity.

## Demo

![PSO Visualization](./screenshots/pso-demo.gif)

_Interactive visualization of Particle Swarm Optimization running in real-time._

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/evolutionary-algorithms-visualization.git
   cd evolutionary-algorithms-visualization
   ```

2. **Install Dependencies**

   Ensure you have [Node.js](https://nodejs.org/) installed. Then, install the required packages:

   ```bash
   npm install
   ```

   Or with Yarn:

   ```bash
   yarn install
   ```

## Usage

1. **Run the Development Server**

   ```bash
   npm run dev
   ```

   Or with Yarn:

   ```bash
   yarn dev
   ```

2. **Open in Browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

3. **Interact with the Visualizations**

   - **Set Parameters**: Adjust the number of particles, dimensions, inertia weight, cognitive and social coefficients.
   - **Start PSO**: Click the "Start PSO" button to begin the optimization process.
   - **Stop PSO**: Click the "Stop PSO" button to halt the process at any time.
   - **View Charts**: Observe the best fitness improving over iterations and the real-time positions of particles in the search space.

## Screenshots

### Particle Swarm Optimization (PSO)

![PSO Line Chart](./screenshots/pso-line-chart.png)
_Line chart showing the best fitness over iterations._

![PSO Scatter Plot](./screenshots/pso-scatter-plot.png)
_2D scatter plot displaying particle positions._

![PSO 3D Scatter Plot](./screenshots/pso-3d-scatter-plot.png)
_3D scatter plot visualizing particle movements._

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.
- **React**: JavaScript library for building user interfaces.
- **Chart.js**: JavaScript library for 2D charting.
- **react-chartjs-2**: React wrapper for Chart.js.
- **Plotly.js**: Open-source graphing library for interactive, publication-quality graphs.
- **react-plotly.js**: React wrapper for Plotly.js.

## Future Work

- **Implement Differential Evolution (DE) and Firefly Algorithm (FA)**:
  - Develop interactive visualizations for DE and FA similar to PSO.
  - Allow users to adjust specific parameters unique to DE and FA.
- **Enhanced Visualizations**:
  - Introduce animated 3D visualizations for deeper insights.
  - Incorporate additional charts such as average fitness and population diversity.
- **Optimization Comparisons**:
  - Enable side-by-side comparisons of PSO, DE, and FA performance on various benchmark functions.
- **User Interface Improvements**:
  - Add more responsive and user-friendly controls.
  - Implement real-time parameter tuning without restarting the algorithm.
- **Research Integration**:
  - Provide detailed explanations and research insights on each algorithm.
  - Include references to academic papers and resources for further reading.

## Contributing

Contributions are welcome! Please follow these steps to contribute to this project:

1. **Fork the Repository**

   Click the "Fork" button at the top right of this page.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/your-username/evolutionary-algorithms-visualization.git
   cd evolutionary-algorithms-visualization
   ```

3. **Create a New Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Make Changes**

   Implement your feature or bug fix.

5. **Commit Your Changes**

   ```bash
   git commit -m "Add your detailed description of changes"
   ```

6. **Push to Your Fork**

   ```bash
   git push origin feature/YourFeatureName
   ```

7. **Create a Pull Request**

   Navigate to the original repository and click the "New Pull Request" button.

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
    Developed with ❤️ by Masih Balali (https://github.com/Masihbalali)
</p>
