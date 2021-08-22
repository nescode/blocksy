<?php

if (! isset($device)) {
	$device = 'desktop';
}

$trigger_type = blocksy_default_akg('mobile_menu_trigger_type', $atts, 'type-1');
$trigger_design = blocksy_default_akg('trigger_design', $atts, 'simple');
$trigger_label = blocksy_expand_responsive_value(
	blocksy_default_akg('trigger_label', $atts, __('Menu', 'blocksy'))
)[$device];

$label_class = 'ct-label';

$label_class .= ' ' . blocksy_visibility_classes(blocksy_akg('trigger_label_visibility', $atts,
	[
		'desktop' => false,
		'tablet' => false,
		'mobile' => false,
	]
));

$trigger_label_alignment = blocksy_expand_responsive_value(
	blocksy_akg('trigger_label_alignment', $atts, 'right')
);

?>

<a
	href="#offcanvas"
	class="ct-header-trigger"
	data-design="<?php echo $trigger_design ?>"
	data-label="<?php echo $trigger_label_alignment[$device] ?>"
	aria-label="<?php echo $trigger_label ?>"
	<?php echo blocksy_attr_to_html($attr) ?>>

	<span class="<?php echo $label_class ?>"><?php echo $trigger_label ?></span>

	<svg
		class="ct-trigger ct-icon"
		width="18" height="14" viewBox="0 0 18 14"
		aria-label="<?php echo __('Off-canvas trigger icon', 'blocksy') ?>"
		data-type="<?php echo esc_attr($trigger_type) ?>">

		<rect y="0.00" width="18" height="1.7" rx="1"/>
		<rect y="6.15" width="18" height="1.7" rx="1"/>
		<rect y="12.3" width="18" height="1.7" rx="1"/>
	</svg>

</a>
