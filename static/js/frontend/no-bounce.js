import {
	clearAllBodyScrollLocks,
	enableBodyScroll,
	disableBodyScroll,
} from 'body-scroll-lock'

export var enable = function (el) {
	clearAllBodyScrollLocks()
	// enableBodyScroll(el, { reserveScrollBarGap: true })
}

export var disable = function (el) {
	disableBodyScroll(el, { reserveScrollBarGap: true })
}
