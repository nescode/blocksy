<?php

$class = 'ct-header-cta';

$visibility = blocksy_default_akg('visibility', $atts, [
	'tablet' => true,
	'mobile' => true,
]);

$class .= ' ' . blocksy_visibility_classes($visibility);

$header_button_open = blocksy_akg(
	'header_button_open',
	$atts,
	'link'
);

$type = blocksy_default_akg('header_button_type', $atts, 'type-1');
$size = blocksy_default_akg('header_button_size', $atts, 'small');
$link = blocksy_translate_dynamic(
	blocksy_default_akg('header_button_link', $atts, ''),
	'header:' . $section_id . ':' . $item_id . ':header_button_link'
);

if (
	$header_button_open === 'popup'
	&&
	function_exists('blocksy_get_default_content_block')
	&&
	blocksy_get_default_content_block(null, [
		'template_type' => 'popup'
	])
) {
	$default_popup_id = blocksy_get_default_content_block(null, [
		'template_type' => 'popup'
	]);

	$popup_id = blocksy_akg(
		'header_button_select_popup',
		$atts,
		$default_popup_id
	);

	if (! $popup_id) {
		$popup_id = $default_popup_id;
	}

	$link = '#ct-popup-' . $popup_id;
}

$link_attr = [];

if (blocksy_default_akg('header_button_target', $atts, 'no') === 'yes') {
	$link_attr['target'] = '_blank';
	$link_attr['rel'] = 'noopener noreferrer';
}

if (blocksy_default_akg('header_button_nofollow', $atts, 'no') === 'yes') {
	if (! isset($link_attr['rel'])) {
		$link_attr['rel'] = '';
	}

	$link_attr['rel'] .= ' nofollow';
	$link_attr['rel'] = trim($link_attr['rel']);
}

$button_class = 'ct-button';

if ($type === 'type-2') {
	$button_class = 'ct-button-ghost';
}

$text = blocksy_translate_dynamic(
	blocksy_default_akg('header_button_text', $atts, __('Download', 'blocksy')),
	'header:' . $section_id . ':' . $item_id . ':header_button_text'
);

$icon = '';

$icon_position = blocksy_akg('icon_position', $atts, 'left');

if (function_exists('blc_get_icon')) {
	$icon = blc_get_icon([
		'icon_descriptor' => blocksy_akg(
			'icon',
			$atts,
			['icon' => '']
		),
		'class' => 'ct-' . $icon_position
	]);
}

if ($icon_position === 'left') {
	$text = $icon . $text;
}

if ($icon_position === 'right') {
	$text .= $icon;
}

?>

<div
	class="<?php echo esc_attr(trim($class)) ?>"
	<?php echo blocksy_attr_to_html($attr) ?>>

	<a
		href="<?php echo esc_url($link) ?>"
		class="<?php echo $button_class ?>"
		data-size="<?php echo esc_attr($size) ?>"
		<?php echo blocksy_attr_to_html($link_attr) ?>>
		<?php echo $text ?>
	</a>
</div>

