import axios from 'axios';
import * as types from './types';

export const checkUsernameAvailability = username => async () => {
	let res = await axios.post(`/api/auth/check-username`, { username });
	return res.data;
};

export const signup = post => async dispatch => {
	let res = await axios.post('/api/signup', post);

	//dispatch({ type: types.AUTH_SIGNUP, payload: res.data });
	return res.data;
};

export const login = post => async dispatch => {
	let response;
	await axios
		.post('/api/auth/login', post)
		.then(function(res) {
			// handle success
			dispatch(fetchUser());
			response = res.data;
			return res.data;
		})
		.catch(function(error) {
			// handle error
			console.log(error);
		})
		.then(function() {
			// Always done
		});

	return response;
};

export const fetchUser = () => async dispatch => {
	let res = await axios.get('/api/auth/current_user');

	dispatch({ type: types.AUTH_CURRENT_USER, payload: res.data });
};

export const editProfile = (values, callback) => async dispatch => {
	let res = await axios.put('/api/auth/edit', values);

	return callback(res.data);
};

export const getAnsweredQuestions = answers => async dispatch => {
	// Receives an object of objects. Keys of the parent object are question IDs
	let ids = Object.keys(answers),
		questions = [];

	if (ids.length > 0) {
		let res = await axios.get(`/api/questions/${ids.join()}`);

		questions = res.data;
	}
	dispatch({
		type: types.AUTH_GET_ANSWERED_QUESTIONS,
		answers,
		questions
	});
};

export const forgotPassword = (email, callback) => async dispatch => {
	let res = await axios.post('/api/auth/forgot', { email: email });
	return callback(res.data);
};

export const resetPassword = (token, values, callback) => async dispatch => {
	let res = await axios.post(`/api/auth/reset/${token}`, values);
	return callback(res.data);
};