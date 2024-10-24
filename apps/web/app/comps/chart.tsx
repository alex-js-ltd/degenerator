'use client'

import {
	createChart,
	ColorType,
	ISeriesApi,
	IChartApi,
	TickMarkType,
} from 'lightweight-charts'
import React, { useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

interface ChartComponentProps {
	data?: { time: string; value: number }[]
	colors?: {
		backgroundColor?: string
		lineColor?: string
		textColor?: string
		areaTopColor?: string
		areaBottomColor?: string
	}
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
	data = initialData,
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
	const seriesRef = useRef<ISeriesApi<'Area'> | null>(null)

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

		const newSeries = chart.addAreaSeries({
			lineColor,
			topColor: areaTopColor,
			bottomColor: areaBottomColor,
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
	}, [
		data,
		backgroundColor,
		lineColor,
		textColor,
		areaTopColor,
		areaBottomColor,
	])

	return <div ref={chartContainerRef} />
}

const initialData = [
	{ time: '2018-12-22', value: 32.51 },
	{ time: '2018-12-23', value: 31.11 },
	{ time: '2018-12-24', value: 27.02 },
	{ time: '2018-12-25', value: 27.32 },
	{ time: '2018-12-26', value: 25.17 },
	{ time: '2018-12-27', value: 28.89 },
	{ time: '2018-12-28', value: 25.46 },
	{ time: '2018-12-29', value: 23.92 },
	{ time: '2018-12-30', value: 22.68 },
	{ time: '2018-12-31', value: 22.67 },
]
