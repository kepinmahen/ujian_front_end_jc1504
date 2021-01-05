import Axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Button, Input } from "reactstrap";
import { api_url } from "../helpers/api_url";
import { loginAction, fetchCartAction } from "../redux/actions";

class LoginPage extends Component {
	state = {
		loginInfo: {
			email: "",
			password: "",
		},
	};

	onchangeInput = (e) => {
		this.setState({
			loginInfo: { ...this.state.loginInfo, [e.target.id]: e.target.value },
		});
	};
	clickLogin = () => {
		// const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		var regex = /^(?=.*\d)(?=.*[a-z]).{6,}$/;
		const { email, password } = this.state.loginInfo;

		if (email.match(regex) && password.match(regex)) {
			Axios.get(`${api_url}/users?email=${email}&password=${password}`)
				.then((res) => {
					if (res.data.length === 1) {
						this.props.loginAction(res.data[0]);
						localStorage.setItem("id", res.data[0].id);
						this.props.fetchCartAction(res.data[0].id);
					} else if (res.data.length === 0) {
						Axios.post(`${api_url}/users`, { email: email, password: password })
							.then((res) => {
								this.props.loginAction(res.data);
								localStorage.setItem("id", res.data.id);
								console.log(res.data);
								this.props.fetchCartAction(res.data.id);
							})
							.catch((err) => {
								console.log(err);
							});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			alert("email dan password harus mengandung angka dan minimal 6 karakter");
		}
	};
	render() {
		const { userID } = this.props;
		
		if (userID !== 0) {
			return <Redirect to="/" />;
		}
		return (
			<div>
				Login page
				<div>
					<Input
						placeholder="email"
						type="email"
						id="email"
						onChange={this.onchangeInput}
					/>
				</div>
				<div>
					<Input
						placeholder="password"
						type="password"
						id="password"
						onChange={this.onchangeInput}
					/>
				</div>
				<div>
					<Button onClick={this.clickLogin}>Login</Button>
				</div>
			</div>
		);
	}
}
const mapStatetoPros = (state) => {
	return {
		userID: state.user.id,
		emailUser: state.user.email,
	};
};

export default connect(mapStatetoPros, { loginAction, fetchCartAction })(
	LoginPage
);
