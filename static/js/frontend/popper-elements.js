export const mount = (reference) => {
	if (!reference.nextElementSibling) {
		return
	}

	const target = reference.nextElementSibling

	let placement = 'right'

	if (
		reference.getBoundingClientRect().left +
			target.getBoundingClientRect().width >
		innerWidth
	) {
		placement = 'left'
	}

	target.dataset.placement = placement
}
