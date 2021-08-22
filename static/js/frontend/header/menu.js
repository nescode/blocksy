const isRtl = () => document.querySelector('html').dir === 'rtl'

const isEligibleForSubmenu = (el) =>
	el.classList.contains('animated-submenu') &&
	(!el.parentNode.classList.contains('menu') ||
		(el.className.indexOf('ct-mega-menu') === -1 &&
			el.parentNode.classList.contains('menu')))

function furthest(el, s) {
	var nodes = []

	while (el.parentNode) {
		if (
			el.parentNode &&
			el.parentNode.matches &&
			el.parentNode.matches(s)
		) {
			nodes.push(el.parentNode)
		}

		el = el.parentNode
	}

	return nodes[nodes.length - 1]
}

const getPreferedPlacementFor = (el) => {
	const farmost = furthest(el, 'li.menu-item')

	if (!farmost) {
		return isRtl() ? 'left' : 'right'
	}

	if (!farmost.querySelector('.sub-menu .sub-menu .sub-menu')) {
		return isRtl() ? 'left' : 'right'
	}

	return farmost.getBoundingClientRect().left > innerWidth / 2
		? 'left'
		: 'right'
}

const computeItemSubmenuFor = (
	reference,
	{
		// left -- 1st level menu items
		// end  -- submenus
		startPosition = 'end',
	}
) => {
	const menu = reference.querySelector('.sub-menu')
	const placement = getPreferedPlacementFor(menu)

	const { left, width, right } = menu.getBoundingClientRect()

	let futurePlacement = placement
	let referenceRect = reference.getBoundingClientRect()

	if (placement === 'left') {
		let referencePoint =
			startPosition === 'end' ? referenceRect.left : referenceRect.right

		if (referencePoint - width < 0) {
			futurePlacement = 'right'
		}
	}

	if (placement === 'right') {
		let referencePoint =
			startPosition === 'end' ? referenceRect.right : referenceRect.left

		if (referencePoint + width > innerWidth) {
			futurePlacement = 'left'
		}
	}

	reference.dataset.submenu = futurePlacement

	reference.addEventListener('click', () => {})
}

export const mountMenuLevel = (menuLevel, args = {}) => {
	;[...menuLevel.children]
		.filter((el) =>
			el.matches('.menu-item-has-children, .page_item_has_children')
		)
		.map((el) => {
			if (el.classList.contains('ct-mega-menu-custom-width')) {
				const menu = el.querySelector('.sub-menu')
				const elRect = el.getBoundingClientRect()
				const menuRect = menu.getBoundingClientRect()

				if (
					elRect.left + elRect.width / 2 + menuRect.width / 2 >
					innerWidth
				) {
					el.dataset.submenu = 'left'
				}

				if (elRect.left + elRect.width / 2 - menuRect.width / 2 < 0) {
					el.dataset.submenu = 'right'
				}
			}

			if (isEligibleForSubmenu(el)) {
				computeItemSubmenuFor(el, args)
			}
		})
}

const mouseenterHandler = ({ target }) => {
	if (!target.matches('.menu-item-has-children, .page_item_has_children')) {
		target = target.closest(
			'.menu-item-has-children, .page_item_has_children'
		)
	}

	if (
		target.parentNode.classList.contains('menu') &&
		target.className.indexOf('ct-mega-menu') > -1 &&
		target.className.indexOf('ct-mega-menu-custom-width') === -1 &&
		wp &&
		wp.customize &&
		wp.customize('active_theme')
	) {
		const menu = target.querySelector('.sub-menu')

		menu.style.left = `${
			Math.round(
				target
					.closest('[class*="ct-container"]')
					.firstElementChild.getBoundingClientRect().x
			) - Math.round(target.closest('nav').getBoundingClientRect().x)
		}px`
	}

	if (!isEligibleForSubmenu(target)) {
		return
	}

	const menu = target.querySelector('.sub-menu')

	mountMenuLevel(menu)

	if (menu._timeout_id) {
		clearTimeout(menu._timeout_id)
	}

	menu.parentNode.addEventListener(
		'mouseleave',
		() => {
			menu._timeout_id = setTimeout(() => {
				menu._timeout_id = null
				;[...menu.children]
					.filter((el) => isEligibleForSubmenu(el))
					.map((el) => el.removeAttribute('data-submenu'))
			}, 200)
		},
		{ once: true }
	)
}

export const handleUpdate = (menu) => {
	if (!menu.parentNode) {
		menu = document.querySelector(`[class="${menu.className}"]`)
	}

	if (!menu) {
		return
	}

	if (
		!menu.querySelector('.menu-item-has-children') &&
		!menu.querySelector('.page_item_has_children')
	) {
		return
	}

	menu.removeEventListener('mouseenter', mouseenterHandler)
	menu.addEventListener('mouseenter', mouseenterHandler)

	menu.removeEventListener('focusin', mouseenterHandler)
	menu.addEventListener('focusin', mouseenterHandler)
}
