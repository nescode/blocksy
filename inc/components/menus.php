<?php

function blocksy_menu_get_child_svgs() {
	return [
		'default' => '<svg width="8" height="8" viewBox="0 0 15 15" aria-label="'  . __('Menu dropdown icon', 'blocksy') . '"><path d="M2.1,3.2l5.4,5.4l5.4-5.4L15,4.3l-7.5,7.5L0,4.3L2.1,3.2z"/></svg>',
		'bordered' => '<svg width="12" height="12" viewBox="0 0 15 15" aria-label="'  . __('Menu dropdown icon', 'blocksy') . '"><path d="M1 15a1 1 0 01-.71-.29 1 1 0 010-1.41l5.8-5.8-5.8-5.8A1 1 0 011.7.29l5.8 5.8 5.8-5.8a1 1 0 011.41 1.41l-5.8 5.8 5.8 5.8a1 1 0 01-1.41 1.41l-5.8-5.8-5.8 5.8A1 1 0 011 15z"></path></svg>'
	];
}

if (! function_exists('blocksy_main_menu_fallback')) {
	function blocksy_main_menu_fallback($args) {
		extract($args);

		$list_pages_args = [
			'sort_column' => 'menu_order, post_title',
			'menu_id' => 'primary-menu',
			'menu_class' => 'primary-menu menu',
			'container' => 'ul',
			'echo' => false,
			'link_before' => '',
			'link_after' => '',
			'before' => '<ul>',
			'after' => '</ul>',
			'item_spacing' => 'discard',
			'walker' => new Blocksy_Walker_Page(),
			'title_li' => ''
		];

		if (isset($args['blocksy_mega_menu'])) {
			$list_pages_args['blocksy_mega_menu'] = $args['blocksy_mega_menu'];
		}

		$menu = wp_list_pages($list_pages_args);

		if (! isset($child_indicator_type)) {
			$child_indicator_type = 'default';
		}

		$svg = blocksy_html_tag(
			'span',
			[
				'class' => 'child-indicator'
			],
			blocksy_menu_get_child_svgs()[$child_indicator_type]
		);

		if ($args['depth'] === 1) {
			$svg = '';
		}

		$menu = str_replace(
			'~',
			$svg,
			$menu
		);

		if (empty(trim($menu))) {
			$args['echo'] = false;
			$menu = blocksy_link_to_menu_editor($args);
		} else {
			$attrs = '';

			if (! empty($args['menu_id'])) {
				$attrs .= ' id="' . esc_attr($args['menu_id']) . '"';
			}

			if (! empty($args['menu_class'])) {
				$attrs .= ' class="' . esc_attr($args['menu_class']) . '"';
			}

			$menu = "<ul{$attrs}>" . $menu . "</ul>";
		}

		if ($echo) {
			echo $menu;
		}

		return $menu;
	}
}

if (! function_exists('blocksy_handle_nav_menu_item_title')) {
	function blocksy_handle_nav_menu_item_title($item_output, $item, $args, $depth) {
		$classes = empty($item->classes) ? [] : (array) $item->classes;
		$classes[] = 'menu-item-' . $item->ID;

		$class_names = join(' ', array_filter($classes));

		$child_indicator_type = 'default';

		if (isset($args->child_indicator_type)) {
			$child_indicator_type = $args->child_indicator_type;
		}

		$svg = blocksy_menu_get_child_svgs()[$child_indicator_type];

		if (
			strpos($class_names, 'has-children') !== false
			||
			strpos($class_names, 'has_children') !== false
		) {
			return $item_output . '<span class="child-indicator" aria-label="'  . __('Menu dropdown indicator', 'blocksy') . '">' . $svg . '</span>';
		}

		return $item_output;
	}
}

add_filter(
	'page_css_class',
	function ($css_class, $page, $depth, $args, $current_page) {
		if (isset($args['pages_with_children'][$page->ID])) {
			$css_class[] = 'menu-item-has-children';
		}

		if (! empty($current_page)) {
			$_current_page = get_post($current_page);

			if (
				$_current_page
				&&
				in_array($page->ID, $_current_page->ancestors)
			) {
				$css_class[] = 'current-menu-ancestor';
			}

			if ($page->ID === $current_page) {
				$css_class[] = 'current-menu-item';
			} elseif (
				$_current_page
				&&
				$page->ID === $_current_page->post_parent
			) {
				$css_class[] = 'current-menu-parent';
			}
		} elseif (get_option('page_for_posts') === $page->ID) {
			$css_class[] = 'current-menu-parent';
		}

		if (
			! isset($args['blocksy_mega_menu'])
			||
			! $args['blocksy_mega_menu']
		) {
			return $css_class;
		}

		$classes_str = implode(' ', $css_class);

		if (
			strpos($classes_str, 'has-children') === false
			&&
			strpos($classes_str, 'has_children') === false
		) {
			return $css_class;
		}

		$css_class[] = 'animated-submenu';

		return $css_class;
	},
	10, 5
);

add_filter(
	'nav_menu_css_class',
	function ($classes, $item, $args, $depth) {
		if (
			! isset($args->blocksy_mega_menu)
			||
			! $args->blocksy_mega_menu
		) {
			return $classes;
		}

		$classes_str = implode(' ', $classes);

		if (
			strpos($classes_str, 'has-children') === false
			&&
			strpos($classes_str, 'has_children') === false
		) {
			return $classes;
		}

		if (
			apply_filters('blocksy:menu:has_animated_submenu', true, $item, $args)
			||
			$depth === 0
		) {
			$classes[] = 'animated-submenu';
		}

		return $classes;
	},
	50, 4
);

if (! function_exists('blocksy_get_menus_items')) {
	function blocksy_get_menus_items($location = '') {
		$menus = [
			// 'blocksy_location' => $location
			'blocksy_location' => __('Default', 'blocksy')
		];

		$all_menus = get_terms('nav_menu', ['hide_empty' => true]);

		if (is_array($all_menus) && count($all_menus)) {
			foreach($all_menus as $row) {
				$menus[$row->term_id] = $row->name;
			}
		}

		$result = [];

		foreach ($menus as $id => $menu){
			$result[$id] = $menu;
		}

		return $result;
	}
}

