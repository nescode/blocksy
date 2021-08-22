<?php

$structure = get_theme_mod($prefix . '_structure', 'grid');

if ($structure === 'grid') {
	$grid_columns = blocksy_expand_responsive_value(get_theme_mod(
		$prefix . '_columns',
		[
			'desktop' => 3,
			'tablet' => 2,
			'mobile' => 1
		]
	));

	$columns_for_output = [
		'desktop' => 'repeat(' . $grid_columns['desktop'] . ', 1fr)',
		'tablet' => 'repeat(' . $grid_columns['tablet'] . ', 1fr)',
		'mobile' => 'repeat(' . $grid_columns['mobile'] . ', 1fr)'
	];

	blocksy_output_responsive([
		'css' => $css,
		'tablet_css' => $tablet_css,
		'mobile_css' => $mobile_css,
		'selector' => blocksy_prefix_selector('.entries', $prefix),
		'variableName' => 'grid-template-columns',
		'value' => $columns_for_output,
		'unit' => ''
	]);
}

$card_type = get_theme_mod($prefix . '_card_type', 'boxed');

blocksy_output_font_css([
	'font_value' => get_theme_mod(
		$prefix . '_cardTitleFont',
		blocksy_typography_default_values([
			'size' => [
				'desktop' => '20px',
				'tablet'  => '20px',
				'mobile'  => '18px'
			],
			'line-height' => '1.3'
		])
	),
	'css' => $css,
	'tablet_css' => $tablet_css,
	'mobile_css' => $mobile_css,
	'selector' => blocksy_prefix_selector('.entry-card .entry-title', $prefix)
]);

blocksy_output_colors([
	'value' => get_theme_mod($prefix . '_cardTitleColor'),
	'default' => [
		'default' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
		'hover' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
	],
	'css' => $css,
	'variables' => [
		'default' => [
			'selector' => blocksy_prefix_selector('.entry-card .entry-title', $prefix),
			'variable' => 'heading-color'
		],
		'hover' => [
			'selector' => blocksy_prefix_selector('.entry-card .entry-title', $prefix),
			'variable' => 'linkHoverColor'
		],
	],
]);

blocksy_output_font_css([
	'font_value' => get_theme_mod(
		$prefix . '_cardExcerptFont',
		blocksy_typography_default_values([])
	),
	'css' => $css,
	'tablet_css' => $tablet_css,
	'mobile_css' => $mobile_css,
	'selector' => blocksy_prefix_selector('.entry-excerpt', $prefix)
]);

blocksy_output_colors([
	'value' => get_theme_mod($prefix . '_cardExcerptColor'),
	'default' => [
		'default' => ['color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT')]
	],
	'css' => $css,
	'variables' => [
		'default' => [
			'selector' => blocksy_prefix_selector('.entry-excerpt', $prefix),
			'variable' => 'color'
		]
	],
]);

blocksy_output_font_css([
	'font_value' => get_theme_mod(
		$prefix . '_cardMetaFont',
		blocksy_typography_default_values([
			'size' => [
				'desktop' => '12px',
				'tablet'  => '12px',
				'mobile'  => '12px'
			],
			'variation' => 'n6',
			'text-transform' => 'uppercase',
		])
	),
	'css' => $css,
	'tablet_css' => $tablet_css,
	'mobile_css' => $mobile_css,
	'selector' => blocksy_prefix_selector('.entry-card .entry-meta', $prefix)
]);

blocksy_output_colors([
	'value' => get_theme_mod($prefix . '_cardMetaColor'),
	'default' => [
		'default' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
		'hover' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
	],
	'css' => $css,
	'variables' => [
		'default' => [
			'selector' => blocksy_prefix_selector('.entry-card .entry-meta', $prefix),
			'variable' => 'color'
		],

		'hover' => [
			'selector' => blocksy_prefix_selector('.entry-card .entry-meta', $prefix),
			'variable' => 'linkHoverColor'
		],
	],
]);


blocksy_output_colors([
	'value' => get_theme_mod($prefix . '_card_meta_button_type_font_colors'),
	'default' => [
		'default' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
		'hover' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
	],
	'css' => $css,
	'variables' => [
		'default' => [
			'selector' => blocksy_prefix_selector('.entry-card [data-type="pill"]', $prefix),
			'variable' => 'buttonTextInitialColor'
		],

		'hover' => [
			'selector' => blocksy_prefix_selector('.entry-card [data-type="pill"]', $prefix),
			'variable' => 'buttonTextHoverColor'
		],
	],
]);

blocksy_output_colors([
	'value' => get_theme_mod($prefix . '_card_meta_button_type_background_colors'),
	'default' => [
		'default' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
		'hover' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
	],
	'css' => $css,
	'variables' => [
		'default' => [
			'selector' => blocksy_prefix_selector('.entry-card [data-type="pill"]', $prefix),
			'variable' => 'buttonInitialColor'
		],

		'hover' => [
			'selector' => blocksy_prefix_selector('.entry-card [data-type="pill"]', $prefix),
			'variable' => 'buttonHoverColor'
		],
	],
]);


blocksy_output_colors([
	'value' => get_theme_mod($prefix . '_cardButtonSimpleTextColor'),
	'default' => [
		'default' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
		'hover' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
	],
	'css' => $css,
	'variables' => [
		'default' => [
			'selector' => blocksy_prefix_selector('.entry-button[data-type="simple"]', $prefix),
			'variable' => 'linkInitialColor'
		],

		'hover' => [
			'selector' => blocksy_prefix_selector('.entry-button[data-type="simple"]', $prefix),
			'variable' => 'linkHoverColor'
		],
	],
]);

blocksy_output_colors([
	'value' => get_theme_mod($prefix . '_cardButtonBackgroundTextColor'),
	'default' => [
		'default' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
		'hover' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
	],
	'css' => $css,
	'variables' => [
		'default' => [
			'selector' => blocksy_prefix_selector('.entry-button[data-type="background"]', $prefix),
			'variable' => 'buttonTextInitialColor'
		],

		'hover' => [
			'selector' => blocksy_prefix_selector('.entry-button[data-type="background"]', $prefix),
			'variable' => 'buttonTextHoverColor'
		],
	],
]);

blocksy_output_colors([
	'value' => get_theme_mod($prefix . '_cardButtonOutlineTextColor'),
	'default' => [
		'default' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
		'hover' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
	],
	'css' => $css,
	'variables' => [
		'default' => [
			'selector' => blocksy_prefix_selector('.entry-button[data-type="outline"]', $prefix),
			'variable' => 'linkInitialColor'
		],

		'hover' => [
			'selector' => blocksy_prefix_selector('.entry-button[data-type="outline"]', $prefix),
			'variable' => 'linkHoverColor'
		],
	],
]);

blocksy_output_colors([
	'value' => get_theme_mod($prefix . '_cardButtonColor'),
	'default' => [
		'default' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
		'hover' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
	],
	'css' => $css,
	'variables' => [
		'default' => [
			'selector' => blocksy_prefix_selector('.entry-button', $prefix),
			'variable' => 'buttonInitialColor'
		],

		'hover' => [
			'selector' => blocksy_prefix_selector('.entry-button', $prefix),
			'variable' => 'buttonHoverColor'
		],
	],
]);

// simple card
if ($card_type === 'simple') {
	blocksy_output_border([
		'css' => $css,
		'selector' => blocksy_prefix_selector('[data-cards="simple"] .entry-card', $prefix),
		'variableName' => 'card-border',
		'value' => get_theme_mod($prefix . '_cardDivider'),
		'default' => [
			'width' => 1,
			'style' => 'dashed',
			'color' => [
				'color' => 'rgba(224, 229, 235, 0.8)',
			],
		],
	]);
}

// boxed card
if ($card_type === 'boxed') {

	$card_spacing = get_theme_mod($prefix . '_card_spacing', 30);

	if ($card_spacing !== 30) {
		blocksy_output_responsive([
			'css' => $css,
			'tablet_css' => $tablet_css,
			'mobile_css' => $mobile_css,
			'selector' => blocksy_prefix_selector('[data-cards="boxed"] .entry-card', $prefix),
			'variableName' => 'card-inner-spacing',
			'value' => $card_spacing
		]);
	}

	blocksy_output_colors([
		'value' => get_theme_mod($prefix . '_cardBackground'),
		'default' => [
			'default' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
		],
		'css' => $css,
		'variables' => [
			'default' => [
				'selector' => blocksy_prefix_selector('[data-cards="boxed"] .entry-card', $prefix),
				'variable' => 'card-background'
			],
		],
	]);

	blocksy_output_border([
		'css' => $css,
		'tablet_css' => $tablet_css,
		'mobile_css' => $mobile_css,
		'selector' => blocksy_prefix_selector('[data-cards="boxed"] .entry-card', $prefix),
		'variableName' => 'card-border',
		'value' => get_theme_mod($prefix . '_cardBorder'),
		'default' => [
			'width' => 1,
			'style' => 'none',
			'color' => [
				'color' => 'rgba(44,62,80,0.2)',
			],
		],
		'responsive' => true,
		'skip_none' => true
	]);

	// Border radius
	blocksy_output_spacing([
		'css' => $css,
		'tablet_css' => $tablet_css,
		'mobile_css' => $mobile_css,
		'selector' => blocksy_prefix_selector('[data-cards="boxed"] .entry-card', $prefix),
		'property' => 'borderRadius',
		'value' => get_theme_mod($prefix . '_cardRadius',
			blocksy_spacing_value([
				'linked' => true,
			])
		)
	]);

	// Box shadow
	blocksy_output_box_shadow([
		'css' => $css,
		'tablet_css' => $tablet_css,
		'mobile_css' => $mobile_css,
		'selector' => blocksy_prefix_selector('[data-cards="boxed"] .entry-card', $prefix),
		'value' => get_theme_mod($prefix . '_cardShadow', blocksy_box_shadow_value([
			'enable' => true,
			'h_offset' => 0,
			'v_offset' => 12,
			'blur' => 18,
			'spread' => -6,
			'inset' => false,
			'color' => [
				'color' => 'rgba(34, 56, 101, 0.04)',
			],
		])),
		'responsive' => true
	]);
}


foreach (get_theme_mod($prefix . '_archive_order', []) as $layer) {
	if (! $layer['enabled']) {
		continue;
	}

	if ($layer['id'] === 'divider') {
		blocksy_output_border([
			'css' => $css,
			'selector' => blocksy_prefix_selector('.entry-card', $prefix),
			'variableName' => 'entry-divider',
			'value' => get_theme_mod($prefix . '_entryDivider'),
			'default' => [
				'width' => 1,
				'style' => 'solid',
				'color' => [
					'color' => 'rgba(224, 229, 235, 0.8)',
				],
			]
		]);
	}

	if (isset($layer['typography'])) {
		blocksy_output_font_css([
			'font_value' => blocksy_akg(
				'typography',
				$layer,
				blocksy_typography_default_values([])
			),
			'css' => $css,
			'tablet_css' => $tablet_css,
			'mobile_css' => $mobile_css,
			'selector' => blocksy_prefix_selector('[data-id="' . substr(
				$layer['__id'],
				0, 6
			) . '"]', $prefix)
		]);
	}

	if (isset($layer['color'])) {
		blocksy_output_colors([
			'value' => blocksy_akg('color', $layer),
			'default' => [
				'default' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
				'hover' => [ 'color' => Blocksy_Css_Injector::get_skip_rule_keyword('DEFAULT') ],
			],
			'css' => $css,
			'variables' => [
				'default' => [
					'selector' => blocksy_prefix_selector('[data-id="' . substr(
						$layer['__id'],
						0, 6
					) . '"]', $prefix),
					'variable' => 'color'
				],

				'hover' => [
					'selector' => blocksy_prefix_selector('[data-id="' . substr(
						$layer['__id'],
						0, 6
					) . '"]', $prefix),
					'variable' => 'linkHoverColor'
				],
			],
		]);
	}
}

$cards_gap = get_theme_mod($prefix. '_cardsGap', 30);

if ($cards_gap !== 30) {
	blocksy_output_responsive([
		'css' => $css,
		'tablet_css' => $tablet_css,
		'mobile_css' => $mobile_css,
		'selector' => blocksy_prefix_selector('.entries', $prefix),
		'variableName' => 'grid-columns-gap',
		'value' => $cards_gap
	]);
}

// content alignment
blocksy_output_responsive([
	'css' => $css,
	'tablet_css' => $tablet_css,
	'mobile_css' => $mobile_css,
	'selector' => blocksy_prefix_selector('.entry-card', $prefix),
	'variableName' => 'horizontal-alignment',
	'value' => get_theme_mod($prefix. '_content_horizontal_alignment', 'CT_CSS_SKIP_RULE'),
	'unit' => '',
]);

// Featured Image Radius
blocksy_output_spacing([
	'css' => $css,
	'tablet_css' => $tablet_css,
	'mobile_css' => $mobile_css,
	'selector' => blocksy_prefix_selector('.entry-card .ct-image-container', $prefix),
	'property' => 'borderRadius',
	'value' => get_theme_mod(
		$prefix . '_cardThumbRadius',
		blocksy_spacing_value([
			'linked' => true,
		])
	)
]);
