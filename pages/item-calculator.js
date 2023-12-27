import { useState, useEffect } from 'react';
import Head from 'next/head';

const Home = () => {
	const [userInput, setUserInput] = useState('')
	const [qty, setQty] = useState(1);
	const [price, setPrice] = useState(0)
	const [isGenerating, setIsGenerating] = useState(false);
	const [list, setList] = useState([])
	const [grand, setGrand] = useState(0);
	const [fetched, setFetched] = useState(false)

	useEffect(() => {
		(async () => {
			setIsGenerating(true)
			const response = await fetch('/api/getData', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const data = await response.json()
			if(!data.error) {
				if(data.hasItems) setList(data.items)
				setFetched(true)
			} else {
				console.error(data.error)
			}
			setIsGenerating(false)
        })()
    }, [])
	
	useEffect(() => {
		let ttl = 0;
		list.map(l => ttl += Number(l.ttl))
		setGrand(ttl)
		if(fetched) saveData()
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
			value = output;
			console.log('api replied...', value);
			const firstChar = value.trim().charAt(0)
			if(!/^[0-9]/.test(value) && firstChar != '$') {
				alert(`${value} \nYou can try it again or change the input for better result.`)
				setIsGenerating(false)
				return;
			}
		}
		
		const v = Number(value.replace('$','')).toFixed()
		const total = Number(qty * v)
		const update = {
			id: new Date().getTime(),
			item: userInput,
			value: v,
			qty: qty,
			ttl: total
		}

		// await saveData(update)
		
		setList(prevState => ([
			...prevState,
			update
		]))
		setQty(1)
		setPrice(0)
		setUserInput('')
		setIsGenerating(false)
	}

	const saveData = async () => {
		setIsGenerating(true)
		try {
			const send = await fetch('/api/saveData', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify([...list])
			});
		} catch (e) {
			console.error(e)
		}
		setIsGenerating(false)
	}
	
	const onUserChangedText = (event) => {
		setUserInput(event.target.value);
	}

	const removeItem = (i) => {
		setList(list.filter(l => l.id != i))		
	}
	
	return (
		<div className="root calc">
			<Head>
				<title>Item Calculator</title>
				<meta name="robots" content="noindex,nofollow" />
				<meta name="googlebot" content="noindex,nofollow" />
				<meta property="og:title" content="Item Calculator" key="title"/>
				<meta property="og:description" content="calculate your item prices!" key="description"/>
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
						<h2>List • ${grand} {isGenerating && <span className='loader'></span>}</h2>
						<div className="print" onClick={() => window.print()}>print</div>
					</div>
				</div>
				<div className="output-content">
					<div className="table-header"><span>Item</span><span>Value</span><span>Qty</span><span>Total</span><i className="delete" /></div>
					{list && list.map((l, i) => <div key={`${i}${l.item}`}><span>{l.item}</span><span>${l.value}</span><span>{l.qty}</span><span>${l.ttl}</span><i className="delete" onClick={() => removeItem(l.id)}>x</i></div>)}
				</div>
			</div>
			<footer>Data is retrieved via OpenAI ChatGPT (gpt-4). 2024.</footer>
		</div>
	);
};
	
export default Home;
	