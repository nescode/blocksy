import './events'
import './public-path.js'

import ctEvents from 'ct-events'
import $ from 'jquery'

import { watchLayoutContainerForReveal } from './frontend/animated-element'
import { onDocumentLoaded, handleEntryPoints, loadStyle } from './helpers'

import { mountRenderHeaderLoop } from './frontend/header/render-loop'

import { getCurrentScreen } from './frontend/helpers/current-screen'
import { mountDynamicChunks } from './dynamic-chunks'

import { menuEntryPoints } from './frontend/entry-points/menus'
import { liveSearchEntryPoints } from './frontend/entry-points/live-search'
import { wooEntryPoints } from './frontend/woocommerce/main'

import { mountElementorIntegration } from './frontend/integration/elementor'

import { markImagesAsLoaded } from './frontend/lazy-load-helpers'

/**
 * iOS hover fix
 */
document.addEventListener('click', (x) => 0)

export const areWeDealingWithSafari = /apple/i.test(navigator.vendor)

export { getCurrentScreen } from './frontend/helpers/current-screen'

export const allFrontendEntryPoints = [
	...menuEntryPoints,
	...liveSearchEntryPoints,
	...wooEntryPoints,

	/*
	{
		els: '#main [data-sticky]',
		load: () => import('./frontend/sticky'),
		condition: () => areWeDealingWithSafari,
	},
    */

	{
		els: '[data-parallax]',
		load: () => import('./frontend/parallax/register-listener'),
		events: ['blocksy:parallax:init'],
	},

	{
		els: '.flexy-container[data-flexy*="no"]',
		load: () => import('./frontend/flexy'),
		events: ['ct:flexy:update'],
		trigger: ['hover-with-touch'],
	},

	{
		els: '.ct-share-box [data-network="pinterest"]',
		load: () => import('./frontend/social-buttons'),
		trigger: ['click'],
	},

	{
		els: '.ct-share-box [data-network]:not([data-network="pinterest"])',
		load: () => import('./frontend/social-buttons'),
		trigger: ['click'],
		condition: () =>
			!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			),
	},

	{
		els: [
			...(document.querySelector('.ct-header-cart > .ct-cart-content')
				? ['.ct-header-cart > .ct-cart-item']
				: []),
			'.ct-language-switcher > .ct-active-language',
		],
		load: () => import('./frontend/popper-elements'),
		trigger: ['hover'],
		events: ['ct:popper-elements:update'],
	},

	{
		els:
			'.ct-back-to-top, .ct-shortcuts-container [data-shortcut*="scroll_top"]',
		load: () => import('./frontend/back-to-top-link'),
		events: ['ct:back-to-top:mount'],
		trigger: ['scroll'],
	},

	{
		els: '.ct-pagination:not([data-pagination="simple"])',
		load: () => import('./frontend/layouts/infinite-scroll'),
	},

	{
		els: ['.entries[data-layout]', '[data-products].products'],
		load: () =>
			new Promise((r) => r({ mount: watchLayoutContainerForReveal })),
	},

	{
		els: ['.ct-modal-action'],
		load: () => import('./frontend/overlay'),
		events: ['ct:header:update'],
		trigger: ['click'],
	},

	{
		els: ['.ct-header-search'],
		load: () => import('./frontend/overlay'),
		mount: ({ mount, el, ...rest }) => {
			mount(el, {
				...rest,
				focus: true,
			})
		},
		events: [],
		trigger: ['click'],
	},
]

handleEntryPoints(allFrontendEntryPoints)

const initOverlayTrigger = () => {
	;[
		...document.querySelectorAll('.ct-header-trigger'),
		...document.querySelectorAll('.ct-offcanvas-trigger'),
		...document.querySelectorAll('.ct-header-search'),
		...document.querySelectorAll('.ct-open-quick-view'),
		...document.querySelectorAll(
			'.ct-header-account[href*="account-modal"]'
		),
	].map((menuToggle) => {
		menuToggle.addEventListener(
			'mouseover',
			(event) => {
				const maybeMatchingContainer = ct_localizations.dynamic_styles_selectors.find(
					(descriptor) => descriptor.selector === '.ct-panel'
				)

				loadStyle(maybeMatchingContainer.url).then(() => {})
			},
			{ once: true }
		)
	})
	;[
		...document.querySelectorAll('.ct-header-trigger'),
		...document.querySelectorAll('.ct-offcanvas-trigger'),
	].map((menuToggle) => {
		if (menuToggle && !menuToggle.hasListener) {
			menuToggle.hasListener = true

			menuToggle.addEventListener('click', (event) => {
				event.preventDefault()

				if (!menuToggle.hash) {
					return
				}

				let offcanvas = document.querySelector(menuToggle.hash)

				if (!offcanvas) {
					return
				}

				import('./frontend/overlay').then(({ handleClick }) =>
					handleClick(event, {
						container: offcanvas,
						closeWhenLinkInside: !menuToggle.closest(
							'.ct-header-cart'
						),
						computeScrollContainer: () =>
							offcanvas.querySelector('.cart_list')
								? offcanvas.querySelector('.cart_list')
								: getCurrentScreen() === 'mobile' &&
								  offcanvas.querySelector(
										'[data-device="mobile"]'
								  )
								? offcanvas.querySelector(
										'[data-device="mobile"]'
								  )
								: offcanvas.querySelector('.ct-panel-content'),
					})
				)
			})
		}
	})
}

const mountAsideType4 = () => {
	;[...document.querySelectorAll('aside[data-type="type-4"]')].map(
		(sidebar) => {
			let scrollbarWidth =
				window.innerWidth - document.documentElement.clientWidth

			if (scrollbarWidth > 0) {
				sidebar.style.setProperty(
					'--scrollbar-width',
					`${scrollbarWidth}px`
				)
			}

			sidebar.style.setProperty('--has-scrollbar', 1)
		}
	)
}

onDocumentLoaded(() => {
	document.body.addEventListener(
		'mouseover',
		() => {
			loadStyle(ct_localizations.dynamic_styles.lazy_load)
		},
		{ once: true }
	)

	let inputs = [
		...document.querySelectorAll(
			'.comment-form [class*="comment-form-field"]'
		),
	].filter((input) => input.type !== 'hidden' && input.type !== 'checkbox')

	const renderEmptiness = () => {
		inputs.map((input) => {
			input.parentNode.classList.remove('ct-not-empty')

			if (!input.value) {
				return
			}

			if (input.value.trim().length > 0) {
				input.parentNode.classList.add('ct-not-empty')
			}
		})
	}

	setTimeout(() => {
		renderEmptiness()
	})

	inputs.map((input) => input.addEventListener('input', renderEmptiness))

	mountDynamicChunks()
	mountAsideType4()
	setTimeout(() => document.body.classList.remove('ct-loading'), 1500)

	setTimeout(() => {
		initOverlayTrigger()
	})

	mountRenderHeaderLoop()

	mountElementorIntegration()
})

if ($) {
	$(document.body).on('wc_fragments_refreshed', () => {
		ctEvents.trigger('blocksy:frontend:init')
	})

	$(document.body).on('wc_fragments_loaded', () => {
		ctEvents.trigger('blocksy:frontend:init')
	})
}

ctEvents.on('blocksy:frontend:init', () => {
	handleEntryPoints(allFrontendEntryPoints, {
		immediate: true,
		skipEvents: true,
	})

	mountDynamicChunks()

	mountAsideType4()
	initOverlayTrigger()
})

ctEvents.on('ct:overlay:handle-click', ({ e, href, options = {} }) => {
	import('./frontend/overlay').then(({ handleClick }) => {
		handleClick(e, {
			container: document.querySelector(href),
			...options,
		})
	})
})

export { loadStyle, handleEntryPoints, onDocumentLoaded } from './helpers'
export { markImagesAsLoaded } from './frontend/lazy-load-helpers'
export { registerDynamicChunk } from './dynamic-chunks'
