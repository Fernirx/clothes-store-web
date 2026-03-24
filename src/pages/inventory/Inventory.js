import React from 'react';

const variantStockData = [
	{
		variant: 'Áo thun / Đỏ / M',
		sku: 'SP001-RED-M',
		stock: '2',
		stockClass: 'stock-crit',
		minimum: '5',
		status: 'Nguy hiểm',
		statusClass: 'b-cancelled',
	},
	{
		variant: 'Quần jean / Đen / 30',
		sku: 'SP002-BLK-30',
		stock: '1',
		stockClass: 'stock-crit',
		minimum: '5',
		status: 'Nguy hiểm',
		statusClass: 'b-cancelled',
	},
	{
		variant: 'Váy hoa / Trắng / S',
		sku: 'SP003-WHT-S',
		stock: '4',
		stockClass: 'stock-warn',
		minimum: '5',
		status: 'Sắp hết',
		statusClass: 'b-pending',
	},
	{
		variant: 'Áo khoác / Navy / L',
		sku: 'SP004-NVY-L',
		stock: '3',
		stockClass: 'stock-warn',
		minimum: '5',
		status: 'Sắp hết',
		statusClass: 'b-pending',
	},
	{
		variant: 'Áo thun / Xanh / L',
		sku: 'SP001-BLU-L',
		stock: '28',
		stockClass: 'stock-good',
		minimum: '5',
		status: 'Đủ hàng',
		statusClass: 'b-active',
	},
	{
		variant: 'Polo / Hồng / XL',
		sku: 'SP005-PNK-XL',
		stock: '18',
		stockClass: 'stock-good',
		minimum: '5',
		status: 'Đủ hàng',
		statusClass: 'b-active',
	},
];

const purchaseReceiptsData = [
	{
		code: 'PUR-00043',
		supplier: 'Công ty A',
		total: '12.5M',
		status: 'Hoàn tất',
		statusClass: 'b-completed',
	},
	{
		code: 'PUR-00042',
		supplier: 'Xưởng B',
		total: '8.2M',
		status: 'Đang về',
		statusClass: 'b-shipping',
	},
	{
		code: 'PUR-00041',
		supplier: 'Công ty A',
		total: '20.1M',
		status: 'Hoàn tất',
		statusClass: 'b-completed',
	},
	{
		code: 'PUR-00040',
		supplier: 'NCC C',
		total: '5.7M',
		status: 'Nháp',
		statusClass: 'b-draft',
	},
];

export default function Inventory() {
	return (
		<div className="page-content">
			<div className="stats inv-stats">
				<div className="sc c1">
					<div className="sc-label">Tổng SKU</div>
					<div className="sc-val">284</div>
					<div className="sc-ch inv-muted">Tất cả biến thể</div>
				</div>

				<div className="sc sc-danger">
					<div className="sc-label">SKU cần nhập</div>
					<div className="sc-val inv-danger-text">12</div>
					<div className="sc-ch dn">Dưới mức tối thiểu</div>
				</div>

				<div className="sc c3">
					<div className="sc-label">Phiếu nhập tháng</div>
					<div className="sc-val">8</div>
					<div className="sc-ch up">Tổng 48.5M đ</div>
				</div>
			</div>

			<div className="g2">
				<div className="card">
					<div className="card-hd">
						<span className="card-ttl">Tồn kho theo variant</span>
						<div className="inv-card-actions">
							<select className="f-select inv-select-sm" defaultValue="Tất cả sản phẩm">
								<option value="Tất cả sản phẩm">Tất cả sản phẩm</option>
								<option value="SP001">SP001</option>
								<option value="SP002">SP002</option>
							</select>
						</div>
					</div>

					<div className="tbl-wrap">
						<table>
							<thead>
								<tr>
									<th>Variant</th>
									<th>SKU</th>
									<th>Tồn kho</th>
									<th>Tối thiểu</th>
									<th>Trạng thái</th>
								</tr>
							</thead>
							<tbody>
								{variantStockData.map((item) => (
									<tr key={item.sku}>
										<td className="td-b">{item.variant}</td>
										<td className="td-mono">{item.sku}</td>
										<td>
											<span className={item.stockClass}>{item.stock}</span>
										</td>
										<td>{item.minimum}</td>
										<td>
											<span className={`badge ${item.statusClass}`}>{item.status}</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className="card">
					<div className="card-hd">
						<span className="card-ttl">Phiếu nhập gần đây</span>
						<span className="card-act">Tất cả →</span>
					</div>

					<div className="tbl-wrap">
						<table>
							<thead>
								<tr>
									<th>Mã phiếu</th>
									<th>NCC</th>
									<th>Tổng tiền</th>
									<th>Trạng thái</th>
								</tr>
							</thead>
							<tbody>
								{purchaseReceiptsData.map((receipt) => (
									<tr key={receipt.code}>
										<td className="td-mono">{receipt.code}</td>
										<td className="inv-supplier-cell">{receipt.supplier}</td>
										<td className="td-b">{receipt.total}</td>
										<td>
											<span className={`badge ${receipt.statusClass}`}>{receipt.status}</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
