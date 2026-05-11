import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Actor, Relation, ActorType, RelationType } from '../types';

interface NetworkGraphProps {
  actors: Actor[];
  relations: Relation[];
  onActorClick?: (actor: Actor) => void;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ actors, relations, onActorClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || actors.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Add zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Color scales
    const actorColors: Record<ActorType, string> = {
      Individual: '#3b82f6', // blue
      Government: '#ef4444', // red
      InternationalOrganization: '#10b981', // green
      Other: '#6b7280' // gray
    };

    const relationColors: Record<RelationType, string> = {
      Diplomacy: '#6366f1', // indigo
      Conflict: '#f87171', // light red
      Agreement: '#34d399', // light green
      Other: '#9ca3af' // light gray
    };

    // Prepare data
    const nodes = actors.map(d => ({ ...d }));
    const links = relations.map(d => ({ ...d }));

    // Simulation
    const simulation = d3.forceSimulation<any>(nodes)
      .force("link", d3.forceLink<any, any>(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Arrow markers
    svg.append("defs").selectAll("marker")
      .data(['Diplomacy', 'Conflict', 'Agreement', 'Other'])
      .enter().append("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", d => relationColors[d as RelationType])
      .attr("d", "M0,-5L10,0L0,5");

    // Links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", d => relationColors[d.type as RelationType])
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("marker-end", d => `url(#arrow-${d.type})`);

    // Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .attr("cursor", "pointer")
      .on("click", (event, d) => onActorClick && onActorClick(d as Actor))
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", d => d.type === 'Government' ? 12 : 8)
      .attr("fill", d => actorColors[d.type as ActorType])
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    node.append("text")
      .attr("dx", 15)
      .attr("dy", 4)
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("fill", "#1f2937")
      .text(d => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [actors, relations]);

  return (
    <div className="w-full h-full bg-slate-50 relative overflow-hidden rounded-xl border border-slate-200">
      <svg ref={svgRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm text-xs pointer-events-none">
        <div className="font-bold mb-2 text-slate-800">Legenda Aktera</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Pojedinac</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Vlada / Država</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Međunarodna Org.</span>
          </div>
        </div>
        <div className="font-bold mt-4 mb-2 text-slate-800">Legenda Odnosa</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-indigo-500" />
            <span>Diplomacija</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-400" />
            <span>Sukob</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-emerald-400" />
            <span>Sporazum</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
