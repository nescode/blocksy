import ctEvents from 'ct-events'
import { getCurrentScreen } from '../helpers/current-screen'

const loadMenuEntry = () => import('../header/menu')

export const menuEntryPoints = [
	{
		els: ['header [data-device="desktop"] [data-id*="menu"] > .menu'],
		condition: () => getCurrentScreen() === 'desktop',
		load: loadMenuEntry,
		onLoad: false,
		mount: ({ el, mountMenuLevel }) =>
			mountMenuLevel(el, { startPosition: 'left' }),
		events: ['ct:general:device-change', 'ct:header:init-popper'],
	},

	{
		els: [
			'header [data-device="desktop"] [data-id*="menu"] > .menu .menu-item-has-children',
			'header [data-device="desktop"] [data-id*="menu"] > .menu .page_item_has_children',
		],
		load: loadMenuEntry,
		mount: ({ handleUpdate, el }) => handleUpdate(el),
		onLoad: false,
		events: ['ct:general:device-change', 'ct:header:init-popper'],
		condition: ({ allEls }) => getCurrentScreen() === 'desktop',
	},

	{
		els:
			'header [data-device="desktop"] [data-id^="menu"][data-responsive]',
		// load: () => new Promise((r) => r({ mount: mountResponsiveHeader })),
		load: () => import('../header/responsive-desktop-menu'),
		// onLoad: false,
		events: ['ct:general:device-change', 'ct:header:render-frame'],
		forcedEvents: ['ct:header:render-frame'],
		forcedEventsElsSkip: true,
		condition: () =>
			getCurrentScreen() === 'desktop' &&
			[
				...document.querySelectorAll(
					'header [data-device="desktop"] [data-id^="menu"][data-responsive]'
				),
			].some((menu) => {
				// true - no enough space
				// false enough space

				if (
					window.blocksyResponsiveMenuCache &&
					window.blocksyResponsiveMenuCache.enabled
				) {
					return window.blocksyResponsiveMenuCache.enabled
				}

				if (!menu.firstElementChild) {
					window.blocksyResponsiveMenuCache = {
						enabled: false,
					}
					return false
				}

				let baseContainer = menu.closest('[class*="ct-container"]')

				let hasResponsive =
					baseContainer.getBoundingClientRect().width -
						[
							...baseContainer.querySelectorAll(
								'[data-id]:not([data-id*="menu"])'
							),
						].reduce((t, item) => {
							let style = window.getComputedStyle(item)

							return (
								t +
								item.getBoundingClientRect().width +
								parseInt(
									style.getPropertyValue('margin-left')
								) +
								parseInt(style.getPropertyValue('margin-right'))
							)
						}, 0) <
					[
						...baseContainer.querySelectorAll(
							'[data-id*="menu"] > * > *'
						),
					].reduce((t, el) => t + el.getBoundingClientRect().width, 0)

				if (!hasResponsive) {
					menu.dataset.responsive = 'yes'
					ctEvents.trigger('ct:header:init-popper')
				}

				window.blocksyResponsiveMenuCache = {
					enabled: hasResponsive,
				}

				return hasResponsive
			}),
	},
]
