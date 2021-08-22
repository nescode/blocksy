import {
	applyPrefixFor,
	handleResponsiveSwitch,
	getPrefixFor,
} from '../../helpers'
import { handleBackgroundOptionFor } from '../../variables/background'
import { getSingleShareBoxVariables } from './share-box'

import { maybePromoteScalarValueIntoResponsive } from 'customizer-sync-helpers/dist/promote-into-responsive'

let prefix = getPrefixFor()

export const getSingleElementsVariables = () => ({
	...getSingleShareBoxVariables(),

	// Autor Box
	[`${prefix}_single_author_box_spacing`]: {
		selector: applyPrefixFor('.author-box', prefix),
		variable: 'spacing',
		responsive: true,
		unit: '',
	},

	[`${prefix}_single_author_box_background`]: {
		selector: applyPrefixFor('.author-box[data-type="type-1"]', prefix),
		variable: 'background-color',
		type: 'color',
	},

	[`${prefix}_single_author_box_shadow`]: {
		selector: applyPrefixFor('.author-box[data-type="type-1"]', prefix),
		type: 'box-shadow',
		variable: 'box-shadow',
		responsive: true,
	},

	[`${prefix}_single_author_box_border`]: {
		selector: applyPrefixFor('.author-box[data-type="type-2"]', prefix),
		variable: 'border-color',
		type: 'color',
	},

	// Related Posts
	[`${prefix}_related_visibility`]: [
		handleResponsiveSwitch({
			selector: applyPrefixFor('.ct-related-posts', prefix),
			on: 'grid',
		}),

		handleResponsiveSwitch({
			selector: applyPrefixFor('.ct-related-posts-container', prefix),
			on: 'block',
		}),
	],

	[`${prefix}_related_label_alignment`]: {
		selector: applyPrefixFor('.ct-related-posts .ct-block-title', prefix),
		variable: 'horizontal-alignment',
		responsive: true,
		unit: '',
	},

	...handleBackgroundOptionFor({
		id: `${prefix}_related_posts_background`,
		selector: applyPrefixFor('.ct-related-posts-container', prefix),
	}),

	[`${prefix}_related_posts_container_spacing`]: {
		selector: applyPrefixFor('.ct-related-posts-container', prefix),
		variable: 'padding',
		responsive: true,
		unit: '',
	},

	[`${prefix}_related_posts_label_color`]: {
		selector: applyPrefixFor('.ct-related-posts .ct-block-title', prefix),
		variable: 'heading-color',

		type: 'color:default',
	},

	[`${prefix}_related_posts_link_color`]: [
		{
			selector: applyPrefixFor('.related-entry-title', prefix),
			variable: 'heading-color',
			type: 'color:default',
		},

		{
			selector: applyPrefixFor('.related-entry-title', prefix),
			variable: 'linkHoverColor',
			type: 'color:hover',
		},
	],

	[`${prefix}_related_posts_meta_color`]: [
		{
			selector: applyPrefixFor('.ct-related-posts .entry-meta', prefix),
			variable: 'color',
			type: 'color:default',
		},

		{
			selector: applyPrefixFor('.ct-related-posts .entry-meta', prefix),
			variable: 'linkHoverColor',
			type: 'color:hover',
		},
	],

	[`${prefix}_related_thumb_radius`]: {
		selector: applyPrefixFor(
			'.ct-related-posts .ct-image-container',
			prefix
		),
		type: 'spacing',
		variable: 'borderRadius',
		responsive: true,
	},

	[`${prefix}_related_narrow_width`]: {
		selector: applyPrefixFor('.ct-related-posts-container', prefix),
		variable: 'narrow-container-max-width',
		unit: 'px',
	},

	[`${prefix}_related_posts_columns`]: [
		{
			selector: applyPrefixFor('.ct-related-posts', prefix),
			variable: 'grid-template-columns',
			responsive: true,
			extractValue: (val) => {
				const responsive = maybePromoteScalarValueIntoResponsive(val)

				return {
					desktop: `repeat(${responsive.desktop}, 1fr)`,
					tablet: `repeat(${responsive.tablet}, 1fr)`,
					mobile: `repeat(${responsive.mobile}, 1fr)`,
				}
			},
		},
	],

	// Posts Navigation
	[`${prefix}_post_nav_spacing`]: {
		selector: applyPrefixFor('.post-navigation', prefix),
		variable: 'margin',
		responsive: true,
		unit: '',
	},

	[`${prefix}_posts_nav_font_color`]: [
		{
			selector: applyPrefixFor('.post-navigation', prefix),
			variable: 'linkInitialColor',
			type: 'color:default',
		},

		{
			selector: applyPrefixFor('.post-navigation', prefix),
			variable: 'linkHoverColor',
			type: 'color:hover',
		},
	],
})
