import ctEvents from 'ct-events'
import { select, useSelect } from '@wordpress/data'
import { handleSingleVariableFor, mountAstCache } from 'customizer-sync-helpers'
import { getValueFromInput } from 'blocksy-options'
import { gutenbergVariables } from './variables'

mountAstCache()

wp.data.subscribe(() => {
	const device = select('core/edit-post').__experimentalGetPreviewDeviceType()
	const themeStyles = select('core/edit-post').isFeatureActive('themeStyles')

	document.body.classList.remove('ct-tablet-view', 'ct-mobile-view')
	document.body.classList.remove('ct-theme-editor-styles')

	if (themeStyles) {
		document.body.classList.add('ct-theme-editor-styles')
	}

	if (device.toLowerCase() === 'tablet') {
		document.body.classList.add('ct-tablet-view')
	}

	if (device.toLowerCase() === 'mobile') {
		document.body.classList.add('ct-tablet-view')
		document.body.classList.add('ct-mobile-view')
	}
})

const syncContentBlocks = ({ atts }) => {
	let page_structure_type = atts.content_block_structure || 'type-4'

	document.body.classList.remove('ct-structure-narrow', 'ct-structure-normal')

	if (atts.has_content_block_structure !== 'yes') {
		document.body.classList.add(`ct-structure-normal`)
		return
	}

	document.body.classList.add(
		`ct-structure-${page_structure_type === 'type-4' ? 'normal' : 'narrow'}`
	)
}

export const mountSync = (atts = {}) => {
	atts = {
		...(select('core/editor').getEditedPostAttribute('blocksy_meta') || {}),
		...atts,
	}

	if (document.body.classList.contains('post-type-ct_content_block')) {
		syncContentBlocks({ atts })
		return
	}

	let page_structure_type = atts.page_structure_type || 'default'

	if (page_structure_type === 'default') {
		page_structure_type = ct_editor_localizations.default_page_structure
	}

	document.body.classList.remove('ct-structure-narrow', 'ct-structure-normal')

	document.body.classList.add(
		`ct-structure-${page_structure_type === 'type-4' ? 'normal' : 'narrow'}`
	)
}

export const handleMetaboxValueChange = (optionId, optionValue) => {
	if (
		optionId === 'page_structure_type' ||
		optionId === 'has_content_block_structure' ||
		optionId === 'content_block_structure'
	) {
		mountSync({
			[optionId]: optionValue,
		})
	}

	const atts = {
		...getValueFromInput(
			ct_editor_localizations.post_options,
			wp.data
				.select('core/editor')
				.getEditedPostAttribute('blocksy_meta') || {}
		),
		[optionId]: optionValue,
	}

	if (gutenbergVariables[optionId]) {
		;(Array.isArray(gutenbergVariables[optionId])
			? gutenbergVariables[optionId]
			: [gutenbergVariables[optionId]]
		).map((d) =>
			handleSingleVariableFor(
				d,
				d.fullValue ? atts : optionValue,
				({
					replaceVariableInStyleTag,
					value,
					variableDescriptor,
					device,
				}) => {
					replaceVariableInStyleTag(
						{
							...variableDescriptor,
							selector: `${
								device === 'tablet'
									? '.ct-tablet-view '
									: device === 'mobile'
									? '.ct-mobile-view '
									: ''
							}${variableDescriptor.selector}`,
						},
						value,
						'desktop'
					)
				}
			)
		)
	}
}
