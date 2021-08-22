import {
	useContext,
	createElement,
	useEffect,
	useRef,
} from '@wordpress/element'
import $ from 'jquery'

import { __ } from 'ct-i18n'

import { PanelContext } from '../../components/PanelLevel'

const BlockWidgetArea = ({
	value,
	option,
	option: { sidebarId = 'ct-footer-sidebar-1' },
	onChange,
}) => {
	const parentEl = useRef()

	const { panelsState, panelsHelpers, panelsDispatch } = useContext(
		PanelContext
	)

	useEffect(() => {
		const config = { attributes: true, childList: true, subtree: true }

		const callback = function (mutationsList, observer) {
			if (
				controlForSidebarId.container[0].closest('.ct-customizer-panel')
			) {
				return
			}

			const currentTab =
				document.querySelector(
					'.ct-customizer-panel .ct-current-tab'
				) ||
				document.querySelector(
					'.ct-customizer-panel .customizer-panel-content'
				)

			if (currentTab) {
				currentTab.prepend(controlForSidebarId.container[0])
			}
		}

		const observer = new MutationObserver(callback)

		let sidebarForCleanup = 'ct-footer-sidebar-1'

		if (sidebarId === 'ct-footer-sidebar-1') {
			sidebarForCleanup = 'ct-footer-sidebar-2'
		}

		const controlForSidebarId =
			wp.customize.control._value[`sidebars_widgets[${sidebarId}]`]

		wp.customize.control._value[
			`sidebars_widgets[${sidebarForCleanup}]`
		].subscribers.forEach((c) => {
			c(true)
		})

		requestAnimationFrame(() => {
			controlForSidebarId.subscribers.forEach((c) => {
				c(true)
			})
		})

		controlForSidebarId.oldContainer = controlForSidebarId.container
		controlForSidebarId.container = $(parentEl.current)

		setTimeout(() => {
			controlForSidebarId.inspector.open = () => {
				panelsHelpers.openSecondLevel()
			}

			panelsDispatch({
				type: 'PANEL_RECEIVE_META',
				payload: {
					secondLevelTitleLabel: __('Block Settings', 'blocksy'),
				},
			})
			setTimeout(() => {
				controlForSidebarId.inspector.oldExpanded =
					controlForSidebarId.inspector.expanded
				controlForSidebarId.inspector.expanded = () => true
				controlForSidebarId.inspector.expanded.get = () => true
				controlForSidebarId.inspector.expanded.set = () => {}

				parentEl.current
					.closest('.ct-customizer-panel')
					.lastElementChild.querySelector('.customizer-panel-content')
					.appendChild(
						controlForSidebarId.inspector.contentContainer[0].querySelector(
							'form'
						)
					)
			})
		}, 10)

		controlForSidebarId.oldContainer.remove()

		wp.customize.section(controlForSidebarId.section()).container = $(
			parentEl.current
		)

		observer.observe(parentEl.current.parentNode, config)

		return () => {
			controlForSidebarId.container = controlForSidebarId.oldContainer
			observer.disconnect()

			controlForSidebarId.inspector.expanded =
				controlForSidebarId.inspector.oldExpanded

			controlForSidebarId.inspector.contentContainer[0].appendChild(
				parentEl.current
					.closest('.ct-customizer-panel')
					.lastElementChild.querySelector(
						'.customizer-panel-content form'
					)
			)

			panelsDispatch({
				type: 'PANEL_RECEIVE_META',
				payload: {
					secondLevelTitleLabel: null,
				},
			})
		}
	}, [])

	return (
		<div
			className="ct-option-widget-area customize-control-sidebar_block_editor"
			ref={parentEl}></div>
	)
}

export default BlockWidgetArea
