import React from 'react';
import './App.css';
import 'clearblade-js-client/lib/mqttws31';
import 'clearblade-js-client';
import { ClearBlade } from 'clearblade-js-client';

// Instance of ClearBlade API
const cb = new ClearBlade();
// User Credentials
const email = 'elhaj102@mail.chapman.edu';
const password = '12345';
// ToDo System Credentials
const systemKey = 'e28595860cd89afdfc83e1828839';
const systemSecret = 'E28595860CB0B181B5C893C88AFD01';
const toDoCollectionID = 'a29395860ca0d596b4abe684b0bd01';

const App = () => {
	// function that connects to ClearBlade and then fetches/returns ToDo List data
	const connectToClearBlade = () => {
		cb.init({
			URI: 'https://platform.clearblade.com',
			systemKey,
			systemSecret,
			email,
			password
		});
		// log User into their ClearBlade account
		cb.loginUser(email, password, (err, response) => {
			if (err) {
				throw console.log(new Error('Error: User Login was not successful'));
			}
			else {
				console.log('Success: User is logged in');
				console.log(response);
				// ensure User is authenticated to be able to use ClearBlade API
				cb.isCurrentUserAuthenticated((err, res) => {
					if (err) {
						throw console.log(new Error('Error: User is not authenticated'));
					}
					else {
						console.log('Success: User is authenticated');
						console.log(res);
						// Find ToDo collection by CollectionID
						var collection = cb.Collection(toDoCollectionID);
						// Setup ToDo List Query by CollectionID
						var query = cb.Query(toDoCollectionID);
						// Fetch ToDo rows/data by CollectionID
						const data = collection.fetch(query, (err, rows) => {
							if (err) {
								throw console.log(new Error('Error: Cannot fetch rows from ToDo List'));
							}
							else {
								console.log('Success - here are the ToDo rows: ');
								console.log(rows);
								// set ToDo list data to React list array
								setList(() => rows);
								setLoading(() => false);
							}
						});
					}
				});
			}
		});
	};

	const fetchAPI = async (setData) => {
		const data = connectToClearBlade();
		console.log('DATA: ' + data);
		setData(() => data);
	};

	const [ list, setList ] = React.useState([]);
	const [ loading, setLoading ] = React.useState(true);

	// @ts-ignore
	React.useEffect(() => {
		try {
			return new Promise((resolve, reject) => {
				resolve(fetchAPI(setList));
			});
		} catch (error) {
			throw console.log(new Error('Error: Could not fetch List Data'));
		}
	}, []);

	while (loading) {
		return <h1>Loading...</h1>;
	}
	return (
		<main>
			{list.map((listItem) => (
				<div key={`Div ID#: ${listItem.data.item_id}`}>
					<input
						type="checkbox"
						id={`Input ID#: ${listItem.data.item_id}`}
						key={`Input Key#: ${listItem.data.item_id}`}
						name="Check Off"
						value=""
					/>
					<label key={listItem.data.item_id}>{listItem.data.item_id}</label>
				</div>
			))}
		</main>
	);
};

export default App;
