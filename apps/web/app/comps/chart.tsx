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

interface ChartComponentProps {}

const colors = {
	backgroundColor: 'white',
	lineColor: '#2962FF',
	textColor: '#2962FF',
	areaTopColor: '#2962FF',
	areaBottomColor: 'rgba(41, 98, 255, 0.28)',
}

export function ChartComponent({}: ChartComponentProps) {
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
				background: { type: ColorType.Solid, color: colors.backgroundColor },
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
			color: '#2962FF',
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

	return <div ref={chartContainerRef} />
}

const data = [
	{ value: 0, time: 1642425322 },
	{ value: 8, time: 1642511722 },
	{ value: 10, time: 1642598122 },
	{ value: 20, time: 1642684522 },
	{ value: 3, time: 1642770922 },
	{ value: 43, time: 1642857322 },
	{ value: 41, time: 1642943722 },
	{ value: 43, time: 1643030122 },
	{ value: 56, time: 1643116522 },
	{ value: 46, time: 1643202922 },
].map(el => ({
	value: el.value,
	time: el.time as UTCTimestamp,
}))
console.log(data)
