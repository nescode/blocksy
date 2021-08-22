<?php

add_action(
	'enqueue_block_editor_assets',
	function () {
		if (get_current_screen()->base === 'widgets') {
			return;
		}

		$theme = blocksy_get_wp_parent_theme();
		global $post;

		$m = new Blocksy_Fonts_Manager();
		$m->load_editor_fonts();

		$options = blocksy_get_options('meta/' . get_post_type($post));

		if (blocksy_manager()->post_types->is_supported_post_type()) {
			$options = blocksy_get_options('meta/default', [
				'post_type' => get_post_type_object(get_post_type($post))
			]);
		}

		$options = apply_filters(
			'blocksy:editor:post_meta_options',
			$options,
			get_post_type($post)
		);

		wp_enqueue_style(
			'ct-main-editor-styles',
			get_template_directory_uri() . '/static/bundle/editor.min.css',
			[],
			$theme->get('Version')
		);

		if (is_rtl()) {
			wp_enqueue_style(
				'ct-main-editor-rtl-styles',
				get_template_directory_uri() . '/static/bundle/editor-rtl.min.css',
				['ct-main-editor-styles'],
				$theme->get('Version')
			);
		}

		wp_enqueue_script(
			'ct-main-editor-scripts',
			get_template_directory_uri() . '/static/bundle/editor.js',
			['wp-plugins', 'wp-edit-post', 'wp-element', 'ct-options-scripts'],
			$theme->get('Version'),
			true
		);

		$post_type = get_current_screen()->post_type;
		$maybe_cpt = blocksy_manager()
			->post_types
			->is_supported_post_type();

		if ($maybe_cpt) {
			$post_type = $maybe_cpt;
		}

		$prefix = blocksy_manager()->screen->get_admin_prefix($post_type);

		$page_structure = get_theme_mod(
			$prefix . '_structure',
			($prefix === 'single_blog_post') ? 'type-3' : 'type-4'
		);

		$background_source = get_theme_mod(
			$prefix . '_background',
			blocksy_background_default_value([
				'backgroundColor' => [
					'default' => [
						'color' => Blocksy_Css_Injector::get_skip_rule_keyword()
					],
				],
			])
		);

		if (
			isset($background_source['background_type'])
			&&
			$background_source['background_type'] === 'color'
			&&
			isset($background_source['backgroundColor']['default']['color'])
			&&
			$background_source['backgroundColor']['default']['color'] === Blocksy_Css_Injector::get_skip_rule_keyword()
		) {
			$background_source = get_theme_mod(
				'site_background',
				blocksy_background_default_value([
					'backgroundColor' => [
						'default' => [
							'color' => '#f8f9fb'
						],
					],
				])
			);
		}

		$localize = [
			'post_options' => $options,
			'default_page_structure' => $page_structure,

			'default_background' => $background_source,
			'default_content_style' => get_theme_mod(
				$prefix . '_content_style',
				blocksy_get_content_style_default($prefix)
			),

			'default_content_background' => get_theme_mod(
				$prefix . '_content_background',
				blocksy_background_default_value([
					'backgroundColor' => [
						'default' => [
							'color' => '#ffffff'
						],
					],
				])
			),

			'default_boxed_content_spacing' => get_theme_mod(
				$prefix . '_boxed_content_spacing',
				[
					'desktop' => blocksy_spacing_value([
						'linked' => true,
						'top' => '40px',
						'left' => '40px',
						'right' => '40px',
						'bottom' => '40px',
					]),
					'tablet' => blocksy_spacing_value([
						'linked' => true,
						'top' => '35px',
						'left' => '35px',
						'right' => '35px',
						'bottom' => '35px',
					]),
					'mobile'=> blocksy_spacing_value([
						'linked' => true,
						'top' => '20px',
						'left' => '20px',
						'right' => '20px',
						'bottom' => '20px',
					]),
				]
			),

			'default_content_boxed_radius' => get_theme_mod(
				$prefix . '_content_boxed_radius',
				blocksy_spacing_value([
					'linked' => true,
					'top' => '3px',
					'left' => '3px',
					'right' => '3px',
					'bottom' => '3px',
				])
			),

			'default_content_boxed_shadow' => get_theme_mod(
				$prefix . '_content_boxed_shadow',
				blocksy_box_shadow_value([
					'enable' => true,
					'h_offset' => 0,
					'v_offset' => 12,
					'blur' => 18,
					'spread' => -6,
					'inset' => false,
					'color' => [
						'color' => 'rgba(34, 56, 101, 0.04)',
					],
				])
			)
		];

		wp_localize_script(
			'ct-main-editor-scripts',
			'ct_editor_localizations',
			$localize
		);
	}
);

add_filter(
	'admin_body_class',
	function ($classes) {
		global $post;

		$current_screen = get_current_screen();

		if (
			! $current_screen->is_block_editor()
			||
			get_current_screen()->base === 'widgets'
		) {
			return $classes;
		}

		$page_structure = blocksy_default_akg(
			'page_structure_type',
			blocksy_get_post_options($post->ID),
			'default'
		);

		if ($page_structure === 'default') {
			$post_type = get_current_screen()->post_type;
			$maybe_cpt = blocksy_manager()
				->post_types
				->is_supported_post_type();

			if ($maybe_cpt) {
				$post_type = $maybe_cpt;
			}

			$prefix = blocksy_manager()->screen->get_admin_prefix($post_type);

			$page_structure = get_theme_mod(
				$prefix . '_structure',
				($prefix === 'single_blog_post') ? 'type-3' : 'type-4'
			);
		}

		$class = 'narrow';

		if ($page_structure === 'type-4') {
			$class = 'normal';
		}

		$class = 'ct-structure-' . $class;

		if (get_post_type($post) === 'ct_content_block') {
			$atts = blocksy_get_post_options($post->ID);
			$template_type = get_post_meta($post->ID, 'template_type', true);

			if (blocksy_default_akg(
				'has_content_block_structure',
				$atts,
				$template_type === 'hook' ? 'no' : 'yes'
			)) {
				$page_structure = blocksy_default_akg(
					'content_block_structure',
					$atts,
					'type-4'
				);

				$class = 'narrow';

				if ($page_structure === 'type-4') {
					$class = 'normal';
				}

				$class = 'ct-structure-' . $class;
			} else {
				$class = '';
			}
		}

		$classes .= ' ' . $class;

		return $classes;
	}
);

