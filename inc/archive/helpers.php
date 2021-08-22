<?php

if (! function_exists('blocksy_render_archive_cards')) {
	function blocksy_render_archive_cards($args = []) {
		global $wp_query;

		$args = wp_parse_args(
			$args,
			[
				'query' => $wp_query,
				'prefix' => blocksy_manager()->screen->get_prefix(),
				'has_pagination' => true
			]
		);

		$blog_post_structure = get_theme_mod($args['prefix'] . '_structure', 'grid');

		if ($args['query']->have_posts()) {
			$entries_open = '<div class="entries" ';

			$entries_open .= 'data-layout="' . esc_attr($blog_post_structure) . '"';
			$entries_open .= ' ' . blocksy_get_listing_card_type([
				'prefix' => $args['prefix']
			]);
			$entries_open .= ' ' . blocksy_listing_page_structure([
				'prefix' => $args['prefix']
			]);
			$entries_open .= ' ' . blocksy_schema_org_definitions('blog');

			$archive_order = get_theme_mod(
				$args['prefix'] . '_archive_order',
				[]
			);

			foreach ($archive_order as $archive_layer) {
				if (! $archive_layer['enabled']) {
					continue;
				}

				if ($archive_layer['id'] === 'featured_image') {
					$hover_effect = blocksy_akg(
						'image_hover_effect',
						$archive_layer,
						'none'
					);

					if ($hover_effect !== 'none') {
						$entries_open .= ' data-hover="' . $hover_effect . '"';
					}
				}
			}

			$entries_open .= ' ' . blocksy_generic_get_deep_link([
				'prefix' => $args['prefix']
			]) . '>';

			do_action('blocksy:loop:before');

			echo $entries_open;

			while ($args['query']->have_posts()) {
				$args['query']->the_post();

				blocksy_render_archive_card([
					'prefix' => $args['prefix']
				]);
			}

			echo '</div>';

			do_action('blocksy:loop:after');

			/**
			 * Note to code reviewers: This line doesn't need to be escaped.
			 * Function blocksy_display_posts_pagination() used here escapes the value properly.
			 */
			if ($args['has_pagination']) {
				echo blocksy_display_posts_pagination([
					'query' => $args['query'],
					'prefix' => $args['prefix']
				]);
			}
		} else {
			get_template_part('template-parts/content', 'none');
		}
	}
}

