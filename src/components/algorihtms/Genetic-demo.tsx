'use client'

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Interface for GA data structure
interface Node {
    id: string;
    parentIds: string[];
    isMutated: boolean;
}

interface Link {
    source: string;
    target: string;
}

const GATreeVisualizer: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        // Set dimensions and margins
        const width = 800;
        const height = 600;

        // Sample data (parents and children)
        const nodes: Node[] = [
            { id: 'P1', parentIds: [], isMutated: false },
            { id: 'P2', parentIds: [], isMutated: false },
            { id: 'C1', parentIds: ['P1', 'P2'], isMutated: false },
            { id: 'C2', parentIds: ['P1', 'P2'], isMutated: true }, // Mutated
            { id: 'C3', parentIds: ['C1', 'C2'], isMutated: false },
        ];

        // Create links based on parent-child relationships
        const links: Link[] = nodes.flatMap(node =>
            node.parentIds.map(parentId => ({ source: parentId, target: node.id }))
        );

        // Select the SVG and set its width and height
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .style('border', '1px solid black');

        // Create a simulation for force-directed graph
        const simulation = d3.forceSimulation<Node>()
            .force('link', d3.forceLink<Link>().id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));

        // Add links (edges)
        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('stroke', '#999')
            .attr('stroke-width', 2);

        // Add nodes (chromosomes)
        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('r', 10)
            .attr('fill', d => (d.isMutated ? 'red' : 'blue'));

        // Add labels to nodes
        const labels = svg.append('g')
            .selectAll('text')
            .data(nodes)
            .enter()
            .append('text')
            .attr('dy', -15)
            .attr('text-anchor', 'middle')
            .text(d => d.id);

        // Update simulation on tick
        simulation.nodes(nodes).on('tick', () => {
            node.attr('cx', d => d.x!).attr('cy', d => d.y!);
            labels.attr('x', d => d.x!).attr('y', d => d.y!);
            link.attr('x1', d => d.source.x!)
                .attr('y1', d => d.source.y!)
                .attr('x2', d => d.target.x!)
                .attr('y2', d => d.target.y!);
        });

        simulation.force<Link>('link')!.links(links);

        return () => {
            // Cleanup simulation on unmount
            simulation.stop();
        };
    }, []);

    return (
        <div className="w-full flex justify-center">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default GATreeVisualizer;
