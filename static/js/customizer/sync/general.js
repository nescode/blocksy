wp.customize('content_link_type', (val) =>
	val.bind((to) => (document.body.dataset.link = to))
)

wp.customize('left_right_wide', (val) => {
	val.bind((to) => {
		const els = Array.from(
			document.querySelectorAll('[class*="align-wrap-"]')
		)

		els.map((el) => el.classList.remove('alignwide'))

		if (to === 'yes') {
			els.map((el) => el.classList.add('alignwide'))
		}
	})
})

wp.customize('quantity_type', (val) => {
	val.bind((to) => {
		const els = Array.from(
			document.querySelectorAll('.quantity[data-type]')
		)

		els.map((el) => {
			el.classList.add('ct-disable-transitions')

			setTimeout(() => {
				el.dataset.type = to

				setTimeout(() => {
					el.classList.remove('ct-disable-transitions')
				}, 1000)
			}, 100)
		})
	})
})
