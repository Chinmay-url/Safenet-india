'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface Node {
  id: string
  type: 'scammer' | 'mule' | 'victim' | 'hub'
  risk: number
}

interface Link {
  source: string
  target: string
  value: number
}

interface GraphData {
  nodes: Node[]
  links: Link[]
}

const nodeColor = {
  scammer: '#FF3B3B',
  hub: '#FF8C00',
  mule: '#FFB800',
  victim: '#6B6B80',
}

export default function NetworkGraph({ data }: { data: GraphData }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current || !data.nodes.length) return
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const width = ref.current.clientWidth
    const height = ref.current.clientHeight

    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))

    const g = svg.append('g')

    svg.call(
      d3.zoom<SVGSVGElement, unknown>().on('zoom', (e: any) => g.attr('transform', e.transform)) as any
    )

    const link = g.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', '#2A2A3A')
      .attr('stroke-width', (d) => Math.sqrt(d.value))

    const node = g.append('g')
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', (d) => d.type === 'hub' ? 14 : d.type === 'scammer' ? 10 : 7)
      .attr('fill', (d) => nodeColor[d.type])
      .attr('stroke', '#0A0A0F')
      .attr('stroke-width', 2)
      .call(
        d3.drag<SVGCircleElement, any>()
          .on('start', (e: any, d: any) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
          .on('drag', (e: any, d: any) => { d.fx = e.x; d.fy = e.y })
          .on('end', (e: any, d: any) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null }) as any
      )

    const label = g.append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .text((d) => d.id)
      .attr('font-size', 10)
      .attr('fill', '#6B6B80')
      .attr('text-anchor', 'middle')
      .attr('dy', 22)

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)
      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y)
      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y)
    })

    return () => { simulation.stop() }
  }, [data])

  return (
    <svg
      ref={ref}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  )
}
