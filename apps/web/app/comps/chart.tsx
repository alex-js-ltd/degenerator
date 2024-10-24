'use client'

import {
	createChart,
	ColorType,
	ISeriesApi,
	IChartApi,
	TickMarkType,
	LineData,
	Time,
	UTCTimestamp,
	SolidColor,
} from 'lightweight-charts'
import React, { useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

interface ChartComponentProps {
	data: { value: number; time: UTCTimestamp }[]
}

const colors = {
	backgroundColor: 'white',
	lineColor: '#2962FF',
	textColor: '#2962FF',
	areaTopColor: '#2962FF',
	areaBottomColor: 'rgba(41, 98, 255, 0.28)',
}

export function ChartComponent({ data }: ChartComponentProps) {
	const chartContainerRef = useRef<HTMLDivElement | null>(null)
	const chartRef = useRef<IChartApi | null>(null)
	const seriesRef = useRef<ISeriesApi<'Line'> | null>(null)

	useEffect(() => {
		if (!chartContainerRef.current) return

		const handleResize = () => {
			if (chartRef.current) {
				chartRef.current.applyOptions({
					width: chartContainerRef.current!.clientWidth,
				})
			}
		}

		const chart = createChart(chartContainerRef.current, {
			layout: {
				background: { color: '#1F2937' },
				textColor: '#DDD',
			},
			grid: {
				vertLines: { color: '#444' },
				horzLines: { color: '#444' },
			},
			width: chartContainerRef.current.clientWidth,
			height: 300,

			timeScale: {
				tickMarkFormatter: (time: number, tickMarkType: TickMarkType) => {
					return dayjs(time).utc().format('H:mm')
				},
			},
		})

		chartRef.current = chart
		chart.timeScale().fitContent()

		const newSeries = chart.addLineSeries({
			color: '#4FD1C5',
		})
		seriesRef.current = newSeries
		newSeries.setData(data)

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			if (chartRef.current) {
				chartRef.current.remove()
			}
		}
	}, [])

	return <div className="rounded-md overflow-hidden" ref={chartContainerRef} />
}
