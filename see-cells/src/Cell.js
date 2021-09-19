function Cell(props) {

	const { cell } = props;
	return (
		<div className="card">
			<div className="card-header">
				capacity: {parseInt(cell.output.capacity,16)}
			</div>
            Lock Script
			<ul className="list-group list-group-flush">
				<li className="list-group-item">code_hash: {cell.output.lock.code_hash}</li>
				<li className="list-group-item">hash_type: {cell.output.lock.hash_type}</li>
				<li className="list-group-item">args: {cell.output.lock.args}</li>
			</ul>
            Output Data
			<ul className="list-group list-group-flush">
				<li className="list-group-item">data: {cell.output_data}</li>
			</ul>
            OutPoint
			<ul className="list-group list-group-flush">
				<li className="list-group-item">tx_hash: {cell.out_point.tx_hash}</li>
				<li className="list-group-item">index: {cell.out_point.index}</li>
			</ul>
		</div>
	);
}

export default Cell;