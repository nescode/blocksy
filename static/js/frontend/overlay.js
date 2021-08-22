import { enable, disable } from './no-bounce'
import focusLock from 'dom-focus-lock'
import ctEvents from 'ct-events'
import { loadStyle } from '../helpers'

import { mount as mountMobileMenu } from './mobile-menu'

const showOffcanvas = (settings) => {
	settings = {
		onClose: () => {},
		container: null,
		focus: true,
		forceOpen: false,
		...settings,
	}
	;[...document.querySelectorAll(`[href*="${settings.container.id}"]`)].map(
		(trigger) => {
			trigger.classList.add('active')
		}
	)

	if (settings.container) {
		settings.container.classList.add('active')
	}

	if (settings.focus) {
		setTimeout(() => {
			settings.container.querySelector('input') &&
				settings.container.querySelector('input').focus()
		}, 200)
	}

	if (settings.container.querySelector('.ct-panel-content')) {
		settings.container
			.querySelector('.ct-panel-content')
			.addEventListener('click', (event) => {
				Array.from(settings.container.querySelectorAll('select')).map(
					(select) =>
						select.selectr && select.selectr.events.dismiss(event)
				)
			})
	}

	if (
		settings.clickOutside &&
		settings.container.querySelector('.ct-panel-content')
	) {
		settings.container.addEventListener(
			'click',
			settings.handleContainerClick
		)
	}

	if (!settings.forceOpen) {
		document.body.dataset.panel = `in${
			settings.container.dataset.behaviour.indexOf('left') > -1
				? ':left'
				: settings.container.dataset.behaviour.indexOf('right') > -1
				? ':right'
				: ''
		}`

		document.addEventListener(
			'keyup',
			(event) => {
				const { keyCode, target } = event
				if (keyCode !== 27) return
				event.preventDefault()

				document.body.hasAttribute('data-panel') &&
					hideOffcanvas(settings)
			},
			{ once: true }
		)
	}

	settings.container &&
		settings.container.querySelector('.ct-close-button') &&
		settings.container.querySelector('.ct-close-button').addEventListener(
			'click',
			(event) => {
				event.preventDefault()
				hideOffcanvas(settings)
			},
			{ once: true }
		)

	if (
		settings.computeScrollContainer ||
		settings.container.querySelector('.ct-panel-content')
	) {
		disable(
			settings.computeScrollContainer
				? settings.computeScrollContainer()
				: settings.container.querySelector('.ct-panel-content')
		)

		// focusLock.on(settings.container.querySelector('.ct-panel-content'))
	}

	/**
	 * Add window event listener in the next frame. This allows us to freely
	 * propagate the current clck event up the chain -- without the modal
	 * getting closed.
	 */
	if (!settings.forceOpen) {
		requestAnimationFrame(() => {
			window.addEventListener('click', settings.handleWindowClick)
		})
	}

	ctEvents.trigger('ct:modal:opened', settings.container)
	;[...settings.container.querySelectorAll('.child-indicator')].map(
		(arrow) => {
			mountMobileMenu(arrow)
		}
	)
}

const hideOffcanvas = (settings, args = {}) => {
	settings = {
		onClose: () => {},
		container: null,
		...settings,
	}

	args = {
		closeInstant: false,
		...args,
	}

	if (!document.body.hasAttribute('data-panel')) {
		settings.container.classList.remove('active')
		settings.onClose()
		return
	}

	;[...document.querySelectorAll(`[href*="${settings.container.id}"]`)].map(
		(trigger) => {
			trigger.classList.remove('active')
		}
	)

	settings.container.classList.remove('active')

	if (args.closeInstant) {
		document.body.removeAttribute('data-panel')
		ctEvents.trigger('ct:modal:closed', settings.container)

		enable(
			settings.computeScrollContainer
				? settings.computeScrollContainer()
				: settings.container.querySelector('.ct-panel-content')
		)
	} else {
		document.body.dataset.panel = `out`

		settings.container.addEventListener(
			'transitionend',
			() => {
				setTimeout(() => {
					document.body.removeAttribute('data-panel')
					ctEvents.trigger('ct:modal:closed', settings.container)

					enable(
						settings.computeScrollContainer
							? settings.computeScrollContainer()
							: settings.container.querySelector(
									'.ct-panel-content'
							  )
					)

					/*
				focusLock.off(
					settings.container.querySelector('.ct-panel-content')
				)
                */
				}, 300)
			},
			{ once: true }
		)
	}

	const onEnd = (event) => {
		const { keyCode, target } = event
		if (keyCode !== 27) return
		event.preventDefault()
		document.removeEventListener('keyup', onEnd)
		closeModal(id, settings)
	}

	window.removeEventListener('click', settings.handleWindowClick)

	settings.container.removeEventListener(
		'click',
		settings.handleContainerClick
	)

	settings.onClose()
}

export const handleClick = (e, settings) => {
	if (e && e.preventDefault) {
		e.preventDefault()
	}

	settings = {
		onClose: () => {},
		container: null,
		focus: false,
		forceOpen: false,
		clickOutside: true,
		isModal: false,
		computeScrollContainer: null,
		closeWhenLinkInside: false,
		handleContainerClick: (event) => {
			let isInsidePanelContent = event.target.closest('.ct-panel-content')
			let isPanelContentItself =
				[
					...settings.container.querySelectorAll('.ct-panel-content'),
				].indexOf(event.target) > -1

			if (
				(settings.isModal &&
					!isPanelContentItself &&
					isInsidePanelContent) ||
				(!settings.isModal &&
					(isPanelContentItself || isInsidePanelContent)) ||
				event.target.closest('[class*="select2-container"]')
			) {
				return
			}

			if (window.getSelection().toString().length > 0) {
				return
			}

			document.body.hasAttribute('data-panel') && hideOffcanvas(settings)
		},
		handleWindowClick: (e) => {
			if (
				settings.container.contains(e.target) ||
				e.target === document.body ||
				event.target.closest('[class*="select2-container"]')
			) {
				return
			}

			if (
				e.target.classList.contains('ct-header-trigger') ||
				e.target.closest('.ct-header-trigger')
			) {
				return
			}

			document.body.hasAttribute('data-panel') && hideOffcanvas(settings)
		},
		...settings,
	}

	const actuallyOpen = () => {
		if (document.body.hasAttribute('data-panel') && !settings.forceOpen) {
			if (
				settings.isModal &&
				!settings.container.classList.contains('active')
			) {
				const menuToggle = document.querySelector('.ct-header-trigger')

				if (menuToggle) {
					menuToggle.click()
				}

				setTimeout(() => {
					showOffcanvas(settings)
				}, 600)
			} else {
				hideOffcanvas(settings)
			}
		} else {
			showOffcanvas(settings)
		}

		if (settings.closeWhenLinkInside) {
			if (!settings.container.hasListener) {
				settings.container.hasListener = true

				settings.container.addEventListener('click', (event) => {
					if (event.target && event.target.matches('a')) {
						hideOffcanvas(settings, {
							closeInstant:
								event.target.getAttribute('href')[0] !== '#',
						})
					}
				})
			}
		}
	}

	const maybeMatchingContainer = ct_localizations.dynamic_styles_selectors.find(
		(descriptor) => settings.container.matches(descriptor.selector)
	)

	if (!maybeMatchingContainer) {
		actuallyOpen()
	} else {
		loadStyle(maybeMatchingContainer.url).then(() => {
			actuallyOpen()
		})
	}
}

ctEvents.on('ct:offcanvas:force-close', (settings) => hideOffcanvas(settings))

export const mount = (el, { event, focus = false }) => {
	handleClick(event, {
		isModal: true,
		container: document.querySelector(el.hash),
		clickOutside: true,
		focus,
	})
}
