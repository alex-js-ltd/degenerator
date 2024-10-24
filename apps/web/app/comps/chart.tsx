'use client'

import {
	createChart,
	ColorType,
	ISeriesApi,
	IChartApi,
	TickMarkType,
	LineData,
	Time,
} from 'lightweight-charts'
import React, { useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

interface ChartComponentProps {
	colors?: {
		backgroundColor?: string
		lineColor?: string
		textColor?: string
		areaTopColor?: string
		areaBottomColor?: string
	}
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
	colors: {
		backgroundColor = 'white',
		lineColor = '#2962FF',
		textColor = 'black',
		areaTopColor = '#2962FF',
		areaBottomColor = 'rgba(41, 98, 255, 0.28)',
	} = {},
}) => {
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
				background: { type: ColorType.Solid, color: backgroundColor },
				textColor,
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
	}, [backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor])

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
	time: dayjs.unix(el.time).utc().format('YYYY-MM-DD'), // Correct format
}))
console.log(data)
