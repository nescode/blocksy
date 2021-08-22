import { createElement } from '@wordpress/element'

import BlockWidgetArea from './widget-area/BlockWidgetArea'
import LegacyWidgetArea from './widget-area/LegacyWidgetArea'

const WidgetArea = ({ ...props }) => {
	let hasBlockWidgets = ct_customizer_localizations.has_new_widgets

	if (hasBlockWidgets) {
		return <BlockWidgetArea {...props} />
	}

	return <LegacyWidgetArea {...props} />
}

WidgetArea.renderingConfig = { design: 'none' }

export default WidgetArea
