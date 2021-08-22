<?php

$wrapper_attr = array_merge([
	''
], $attr);

?>

<div <?php echo blocksy_attr_to_html($attr) ?>>
	<header class="entry-header">
		<?php echo $elements ?>
	</header>
</div>
