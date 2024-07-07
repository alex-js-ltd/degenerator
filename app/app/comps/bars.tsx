'use client'

import React, { useMemo } from 'react'
import { Bar } from '@visx/shape'
import { Group } from '@visx/group'
import { GradientTealBlue } from '@visx/gradient'
import letterFrequency, {
	LetterFrequency,
} from '@visx/mock-data/lib/mocks/letterFrequency'
import { scaleBand, scaleLinear } from '@visx/scale'

// const data = letterFrequency.slice(5)
const verticalMargin = 120

// accessors
const getLetter = (d: LetterFrequency) => d.letter
const getLetterFrequency = (d: LetterFrequency) => Number(d.frequency) * 100

const getRange = (d: number) => d
const getRangeFrequency = (d: number) => d * 100

export type BarsProps = {
	width: number
	height: number
	events?: boolean
	data: number[]
}

export function Bars({ width, height, events = false, data }: BarsProps) {
	// bounds
	const xMax = width
	const yMax = height

	// scales, memoize for performance
	const xScale = useMemo(
		() =>
			scaleBand<number>({
				range: [0, xMax],
				round: true,
				domain: data.map(getRange),
				padding: 0.2,
			}),
		[xMax],
	)
	const yScale = useMemo(
		() =>
			scaleLinear<number>({
				range: [yMax, 0],
				round: true,
				domain: [0, Math.max(...data.map(getRangeFrequency))],
			}),
		[yMax],
	)

	return width < 10 ? null : (
		<svg width={width} height={height}>
			<GradientTealBlue id="teal" />
			<rect width={width} height={height} fill="url(#teal)" rx={2} />
			<Group top={0}>
				{data.map(d => {
					const letter = getRange(d)
					const barWidth = xScale.bandwidth()
					const barHeight = yMax - (yScale(getRangeFrequency(d)) ?? 0)
					const barX = xScale(letter)
					const barY = yMax - barHeight
					return (
						<Bar
							key={`bar-${letter}`}
							x={barX}
							y={barY}
							width={barWidth}
							height={barHeight}
							fill="rgba(23, 233, 217, .5)"
							onClick={() => {
								if (events)
									alert(`clicked: ${JSON.stringify(Object.values(d))}`)
							}}
						/>
					)
				})}
			</Group>
		</svg>
	)
}
