import React from 'react';

function TextField(props) {
	const { label, id, value, onValueChange } = props;
	return (
		<>
			<label htmlFor={id}>
				{' '}
				{label}
				<input
					id={id}
					value={value}
					onChange={e => {
						onValueChange(e.target.value);
					}}
				/>
			</label>
		</>
	);
}

export default TextField;
