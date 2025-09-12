import React from 'react';
import "./CardOneMatForm.css"
import CardOneInput from './CardOneMatInput';

const CardOne = ({heading="Getting Started",tagLine="Fill in details",imgUrl=""}) => {
	return (
		<div class="container">
			<div class="card-one">
				<div class="card-one-image">
					<h2 class="card-one-heading">
						{heading}
						<small>{tagLine}</small>
					</h2>
				</div>
				<form class="card-one-form">
					<CardOneInput label="FullName" type="text"></CardOneInput>
					<CardOneInput label="Email" type="email"></CardOneInput>
					<CardOneInput label="Password" type="password"></CardOneInput>
					
					<div class="card-one-action">
						<button class="card-one-action-button">Get started</button>
					</div>
				</form>
				<div class="card-one-card-info">
					<p>By signing up you are agreeing to our <a href="#">Terms and Conditions</a></p>
				</div>
			</div>
		</div>
	)
}

export default CardOne