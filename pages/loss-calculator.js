import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

const Home = () => {
	const [userInput, setUserInput] = useState('')
	const [qty, setQty] = useState(1);
	const [price, setPrice] = useState(0)
	const [isGenerating, setIsGenerating] = useState(false);
	const [list, setList] = useState([])
	const [grand, setGrand] = useState(0);
	
	useEffect(() => {
		let ttl = 0;
		list.map(l => ttl += Number(l.ttl))
		setGrand(ttl)
	}, [list])
	
	const callGenerateEndpoint = async () => {
		if(!userInput) return;
		setIsGenerating(true);
		let value;
		if(price) {
			value = `$${price}`;
		} else {
			console.log('calling api..');
			const response = await fetch('/api/generateCalculator', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userInput })
			});
			
			const data = await response.json();
			const { output } = data;
			value = output.text;
			console.log('api replied...', value);
		}
		
		const v = Number(value.replace('$','')).toFixed()
		const total = Number(qty * v)
		
		setList(prevState => ([
			...prevState,
			{
				item:userInput,
				value: v,
				qty: qty,
				ttl: total
			}
		]))
		setQty(1)
		setPrice(0)
		setUserInput('')
		setIsGenerating(false)
	}
	
	const onUserChangedText = (event) => {
		setUserInput(event.target.value);
	}

	const removeItem = (i) => {
		setList(list.filter(l => l.item != i))
		// n.filter(l => l.item != i)
		// console.log(n)
		// setList(n)
	}
	
	return (
		<div className="root calc">
			<Head>
				<title>Loss Calculator</title>
			</Head>
			<div className="container container-left">
				<div className="header">
					<div className="header-title">
						<h2>Enter your item</h2>
					</div>
				</div>
				<div className="prompt-container">
					<div className="prompt-inputs">
						<input type="text" placeholder="Start typing here..." className="prompt-box" value={userInput} onChange={onUserChangedText} />
					</div>
					<div className="prompt-inputs">
						<label>Know the price?</label>
						<div className="price-field">
							<input type="number" className="prompt-box price" value={price} onChange={e => setPrice(e.target.value)} />
						</div>
					</div>
					<div className="prompt-inputs">
						<input type="number" className="prompt-box qty" value={qty} onChange={e => setQty(e.target.value)} />
						<a className={isGenerating ? "generate-button loading" : "generate-button"} onClick={callGenerateEndpoint}>
							<div className="generate">
								{isGenerating ? <span className='loader'></span> : <p>Add</p>}
							</div>
						</a>
					</div>
				</div>
			</div>
			<div className="container container-right output">
				<div className="header">
					<div className="header-title">
						<h2>List • ${grand} </h2>
					</div>
				</div>
				<div className="output-content">
					<div className="table-header"><span>Item</span><span>Value</span><span>Qty</span><span>Total</span><i className="delete" /></div>
					{list && list.map(l => <div><span>{l.item}</span><span>${l.value}</span><span>{l.qty}</span><span>${l.ttl}</span><i className="delete" onClick={() => removeItem(l.item)}>x</i></div>)}
				</div>
			</div>
		</div>
	);
};
	
export default Home;
	