//https://codesandbox.io/s/react-bootstrap-demo-forked-tsy8jb

import React, { useState, useEffect, useRef } from 'react';

import './styles.css';

//********************************drum_button_component
const ButtonComponent = (props) => {
	//console.log("DrumButton component rendered");
	const { num, keyPressedValue, keystrokesNumber, calculatorHandler } = props;

	const btnBasicStyle = {
		backgroundColor: '#007bff',
		border: 'none',
		boxShadow: '6px 3px 2px gray',
		fontFamily: "'Share Tech Mono', monospace",
		height: '100%',
		width: '100%',
	};
	const btnEnableStyle = {
		backgroundColor: '#007bff',
	};
	const btnActiveStyle = {
		backgroundColor: 'yellow',
		boxShadow: 'none',
	};

	const [buttonStateStyle, setButtonStyle] = useState(btnBasicStyle);

	//console.log(keySound.volume);
	const padPressed = () => {
		calculatorHandler(num);
		setButtonStyle(btnActiveStyle);
		setTimeout(() => setButtonStyle(btnEnableStyle), 150);
	};
	//console.log(keyTrigger + " button rendered");
	const handelKeyPress = (keyPressCode) => {
		//console.log(keyPressCode);
		if (keyPressCode === 'Enter' && num === '=') {
			padPressed();
		} else if (keyPressCode === 'Escape' && num === 'ACC') {
			padPressed();
		} else if (keyPressCode === '*' && num === 'X') {
			padPressed();
		} else if (Number(keyPressCode) === num) {
			padPressed();
		} else if (keyPressCode === num) {
			padPressed();
		}
	};

	useEffect(() => {
		handelKeyPress(keyPressedValue);
	}, [keyPressedValue, keystrokesNumber]);
	return (
		<button
			className="btn-lg flex-fill btn btn-primary"
			style={{ ...btnBasicStyle, ...buttonStateStyle }}
			onClick={padPressed}>
			{num}
		</button>
	);
};
//**********************buttons_panel_component*************************/
const ButtonsPanel = (props) => {
	//console.log("ButtonsPanel component rendered");
	const { keyPressedValue, keystrokesNumber, setDisplay } = props;

	const numberPicker = new RegExp('^[0-9]*$');
	const dotPicker = /\./i;

	const [equationObj, setEquationObj] = useState({
		equationArr: [0],
		activeArrayElement: 0,
	});

	//**********************************equations handler*******/
	const removeLastCharFromCurrActiveElInEquiationArray = () => {
		let getValFromArray =
			equationObj.equationArr[equationObj.activeArrayElement];
		let slicedValue = getValFromArray.slice(0, -1);
		let copyCurrEquiationArr = [...equationObj.equationArr];
		copyCurrEquiationArr[equationObj.activeArrayElement] = slicedValue;
		setEquationObj((prevState) => ({
			equationArr: copyCurrEquiationArr,
			activeArrayElement: prevState.activeArrayElement,
		}));
	};
	const removeLastELFromEquiationArray = () => {
		let copyCurrEquiationArr = [...equationObj.equationArr];
		let slicedArray = copyCurrEquiationArr.slice(0, -1);
		//console.log(slicedArray);
		setEquationObj((prevState) => ({
			equationArr: slicedArray,
			activeArrayElement: prevState.activeArrayElement - 1,
		}));
	};
	const replaceCurrActiveElementInEquiationArray = (symbol) => {
		//replace element to equiation array
		const getValFromArray =
			equationObj.equationArr[equationObj.activeArrayElement];
		//console.log("getValFromArray " + getValFromArray);
		let addButtonSymbolToValFromArray;
		if (['/', 'x', '-', '+'].includes(getValFromArray)) {
			addButtonSymbolToValFromArray = symbol;
		} else {
			addButtonSymbolToValFromArray = getValFromArray + symbol;
		}

		let copyCurrEquiationArr = [...equationObj.equationArr];

		copyCurrEquiationArr[
			equationObj.activeArrayElement
		] = addButtonSymbolToValFromArray;

		//console.log(copyCurrEquiationArr);

		setEquationObj((prevState) => ({
			equationArr: copyCurrEquiationArr,
			activeArrayElement: prevState.activeArrayElement,
		}));
	};
	const addElementToEquationArr = (symbolForDisplay) => {
		let getIndexOfActiveEl = equationObj.activeArrayElement;
		let newIndexOfActiveEl = getIndexOfActiveEl + 1;
		//console.log("IAEl " + newIndexOfActiveEl);
		setEquationObj((prevState) => ({
			equationArr: [...prevState.equationArr, symbolForDisplay],
			activeArrayElement: newIndexOfActiveEl,
		}));
	};

	const calculatorHandler = (buttonSymbol) => {
		if (buttonSymbol === 'ACC') {
			//console.log("ACC is active");
			setEquationObj({
				equationArr: [0],
				activeArrayElement: 0,
			});
			// if number
		} else if (numberPicker.test(buttonSymbol)) {
			//if first element of array is 0 and length of array is 1 replace
			if (
				equationObj.equationArr[0] === 0 &&
				equationObj.activeArrayElement === 0
			) {
				setEquationObj((prevState) => ({
					equationArr: [buttonSymbol],
					activeArrayElement: prevState.activeArrayElement,
				}));
			}
			// if active element includes  "/", "x", "-", "+" then add number to equationArr
			else if (
				['/', 'x', '-', '+'].includes(
					equationObj.equationArr[equationObj.activeArrayElement],
				)
			) {
				addElementToEquationArr(buttonSymbol);
			}
			// if active element don't includes  "/", "x", "-", "+"
			// then add value to current active element
			else {
				replaceCurrActiveElementInEquiationArray(buttonSymbol);
			}
		} //if dot
		else if (dotPicker.test(buttonSymbol)) {
			//if string tempNumericValue doesn't has dot
			//and last symbol isn't dot
			if (
				!dotPicker.test(equationObj.equationArr[equationObj.activeArrayElement])
			) {
				replaceCurrActiveElementInEquiationArray(buttonSymbol);
			}
			//if buttonSymbol includes /*-+
		} else if (['/', 'X', '-', '+'].includes(buttonSymbol)) {
			//if last character of active element in array includes dot
			//then remove dot
			if (
				dotPicker.test(
					equationObj.equationArr[equationObj.activeArrayElement][
						equationObj.equationArr[equationObj.activeArrayElement].length - 1
					],
				)
			) {
				removeLastCharFromCurrActiveElInEquiationArray();
			}
			//if buttonSymbol = X then toLowerCase buttonSymbol
			let symbolForDisplay =
				buttonSymbol === 'X' ? buttonSymbol.toLowerCase() : buttonSymbol;
			//id array last element includes /*-+
			if (
				['/', 'x', '-', '+'].includes(
					equationObj.equationArr[equationObj.activeArrayElement],
				)
			) {
				// console.log(equationObj.activeArrayElement);
				replaceCurrActiveElementInEquiationArray(symbolForDisplay);
			} else {
				addElementToEquationArr(symbolForDisplay);
			}
			//console.log("operator" + buttonSymbol);
		} else if (buttonSymbol === '=') {
			//check if dot
			if (
				dotPicker.test(
					equationObj.equationArr[equationObj.activeArrayElement][
						equationObj.equationArr[equationObj.activeArrayElement].length - 1
					],
				)
			) {
				removeLastCharFromCurrActiveElInEquiationArray();
			} else if (
				!numberPicker.test(
					equationObj.equationArr[equationObj.activeArrayElement],
				)
			) {
				removeLastELFromEquiationArray();
			}
			addElementToEquationArr(buttonSymbol);
		}
	};

	useEffect(() => {
		if (equationObj.equationArr[equationObj.activeArrayElement] === '=') {
			let copyArr = [...equationObj.equationArr];
			let slicedArr = copyArr.slice(0, -1);
			let joinedArr = slicedArr.join('');
			let replaceXtoStar = joinedArr.replace(/x/g, '*');
			let result = eval(replaceXtoStar);
			addElementToEquationArr(result);
		} else {
			setDisplay(equationObj.equationArr);
		}
	}, [equationObj]);

	return (
		<div id="buttonsPanel" className="mx-1 row">
			<div className="col-6 col">
				<div className="calcButtonsRow row">
					<div className="col-12 p-1 col">
						<ButtonComponent
							num={'ACC'}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
				<div className="calcButtonsRow row">
					<div className="col-6 p-1 col">
						<ButtonComponent
							num={'7'}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
					<div className="col-6 p-1 col">
						<ButtonComponent
							num={'8'}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
				<div className="calcButtonsRow row">
					<div className="col-6 p-1 col">
						<ButtonComponent
							num={'4'}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
					<div className="col-6 p-1 col">
						<ButtonComponent
							num={'5'}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
				<div className="calcButtonsRow row">
					<div className="col-6 p-1 col">
						<ButtonComponent
							num={'1'}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
					<div className="col-6 p-1 col">
						<ButtonComponent
							num={'2'}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
				<div className="calcButtonsRow row">
					<div className="col-12 p-1 col">
						<ButtonComponent
							num={0}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
			</div>
			<div className="col-3 col">
				<div className="calcButtonsRow row">
					<div className="p-1 col">
						<ButtonComponent
							num={'/'}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
				<div className="calcButtonsRow row">
					<div className="p-1 col">
						<ButtonComponent
							num={9}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
				<div className="calcButtonsRow row">
					<div className="p-1 col">
						<ButtonComponent
							num={6}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
				<div className="calcButtonsRow row">
					<div className="p-1 col">
						<ButtonComponent
							num={3}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
				<div className="calcButtonsRow row">
					<div className="p-1 col">
						<ButtonComponent
							num={'.'}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
			</div>
			<div className="col-3 col">
				<div className="calcButtonsRow row">
					<div className="p-1 col">
						<ButtonComponent
							num={'X'}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
				<div className="calcButtonsRow row">
					<div className="p-1 col">
						<ButtonComponent
							num={'+'}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
				<div className="calcButtonsRow row">
					<div className="p-1 col">
						<ButtonComponent
							num={'-'}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
				<div className="row">
					<div
						className="p-1 col"
						style={{
							height: '120px',
						}}>
						<ButtonComponent
							num={'='}
							keyPressedValue={keyPressedValue}
							keystrokesNumber={keystrokesNumber}
							calculatorHandler={calculatorHandler}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
//*********************************main_app*********************************
const App = () => {
	//console.log("App rendered");
	const cardStyle = {
		width: '350px',
		border: '0.3rem solid #0848A3',
		borderRadius: '0.5rem',
	};

	const appDivRef = useRef();

	//console.log("component App rendered");
	const [bgColor] = useState('aliceblue');
	const [display, setDisplay] = useState(0);
	const [keyPressedValue, setKeyPressedValue] = useState();
	const [keystrokesNumber, setKeystrokesNumber] = useState(0);
	//console.log("app render");
	const handelKeyPress = (e) => {
		//console.log("key pressed");
		setKeyPressedValue(e.key);
		keystrokesNumber > 10
			? setKeystrokesNumber(0)
			: setKeystrokesNumber(keystrokesNumber + 1);
	};

	//focus on the app's div for keyDown react listner
	useEffect(() => {
		//appDivRef.current.focus();
	}, []);

	return (
		<div ref={appDivRef} onKeyDown={handelKeyPress} tabIndex="0">
			<div
				id="quote-box"
				className="vh-100 d-flex align-items-center container-fluid"
				style={{ backgroundColor: bgColor, minWidth: '250px' }}>
				<div className="w-100 d-flex justify-content-center">
					<div style={cardStyle} className="inner-container card">
						<div id="text" className="text-right mr-2 mb-0 card-title h5">
							FCC
							<i className="inner-logo fa fa-free-code-camp ml-1" />
						</div>
						<div className="d-flex flex-wrap align-items-center justify-content-center pt-0 card-body">
							<div
								className="flex-row-reverse p-2 m-2 align-items-end row"
								style={{
									backgroundColor: 'aquamarine',
									height: 'auto',
									width: '294px',
									fontFamily: "'Share Tech Mono', monospace",
									fontSize: '30px',
									wordBreak: 'break-all',
									lineHeight: '30px',
									overflow: 'hidden',
								}}>
								{display}
							</div>
							<ButtonsPanel
								keyPressedValue={keyPressedValue}
								keystrokesNumber={keystrokesNumber}
								setDisplay={setDisplay}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
