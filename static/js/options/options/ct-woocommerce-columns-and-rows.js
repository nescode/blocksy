import {
	createElement,
	Component,
	useState,
	Fragment,
} from '@wordpress/element'
import cls from 'classnames'
import { __, sprintf } from 'ct-i18n'
import NumberOption from './ct-number'
import classnames from 'classnames'

const WooColumnsAndRows = ({
	onChange,
	value,
	option,
	option: { columns_id, rows_id },
	device,
	onChangeFor,
	values,
	values: { woocommerce_catalog_columns, woocommerce_catalog_rows },
}) => {
	const rowsValue = rows_id ? values[rows_id] : woocommerce_catalog_rows

	return (
		<div
			className={classnames('ct-woo-columns-and-rows', {})}
			{...(device !== 'desktop' ? { 'data-disabled-last': '' } : {})}>
			<div>
				<NumberOption
					option={option}
					value={
						!columns_id && device === 'desktop'
							? woocommerce_catalog_columns
							: value
					}
					onChange={(val) => {
						device === 'desktop' && !columns_id
							? onChangeFor('woocommerce_catalog_columns', val)
							: onChange(val)
					}}
				/>
				<p className="ct-option-description">
					{__('Number of columns', 'blc')}
				</p>
			</div>

			<div>
				<NumberOption
					option={{
						min: 1,
						max: 100,
						responsive: false,
						value: 4,
					}}
					value={device === 'desktop' ? rowsValue : 'auto'}
					onChange={(val) => {
						device === 'desktop' &&
							onChangeFor(
								rows_id || 'woocommerce_catalog_rows',
								val
							)

						if (
							!rows_id &&
							wp.customize &&
							wp.customize.previewer
						) {
							wp.customize.previewer.send(
								'ct:sync:refresh_partial',
								{
									id: 'woocommerce_catalog_rows',
								}
							)
						}
					}}
				/>
				<p className="ct-option-description">
					{__('Number of rows', 'blc')}
				</p>
			</div>
		</div>
	)
}

export default WooColumnsAndRows
