import axios from "axios";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import auth from "../../firebase.init";
import useServices from "../../Hooks/useServices";
import "./Order.css";

const Order = () => {
	const [rooms] = useServices();
	const [user] = useAuthState(auth);
	const [bookingRoom, setBookingRoom] = useState("");
	const [orders, setOrders] = useState(0);
	const [isOrder, setIsOrder] = useState(false);

	const navigate = useNavigate();

	const { serviceId } = useParams();
	const bookingRooms = rooms.find((room) => room._id === serviceId);

	useEffect(() => {
		setBookingRoom(bookingRooms?.name);
	}, [bookingRooms]);

	useEffect(() => {
		const email = user.email;
		const getOrderList = async () => {
			const url = `https://calm-tor-81190.herokuapp.com/orderList?email=${email}`;
			try {
				const { data } = await axios.get(url, {
					headers: {
						authorization: `Bearer ${localStorage.getItem(
							"access_token"
						)}`,
					},
				});
				setOrders(data);
			} catch (error) {
				// console.log("error --", error.message);
				// console.log(error.response.status);
				if (
					error.response.status === 401 ||
					error.response.status === 403
				) {
					signOut(auth);
					navigate("/login");
				}
			}
		};
		getOrderList();
	}, [isOrder]);

	const handleOrder = (e) => {
		e.preventDefault();
		const name = e.target.name.value;
		const email = e.target.email.value;
		const room = e.target.room.value;
		const address = e.target.address.value;
		const phone = e.target.phone.value;

		const orderRoom = { name, email, room, address, phone };

		fetch("https://calm-tor-81190.herokuapp.com/order", {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(orderRoom),
		})
			.then((res) => res.json())
			.then((data) => {
				toast.success(data.message);
				setIsOrder(!isOrder);
				e.target.reset();
			});
	};

	return (
		<div className="container order-area">
			<div>
				<h2>Place Your Order</h2>
				<form onSubmit={handleOrder} className="order-form">
					<input
						type="text"
						defaultValue={user?.displayName || ""}
						name="name"
						placeholder="Your Name"
						required
					/>
					<input
						type="email"
						defaultValue={user?.email || ""}
						name="email"
						placeholder="Email Address"
						readOnly
						disabled
						required
					/>
					<input
						type="text"
						defaultValue={bookingRoom}
						onChange={(e) => setBookingRoom(e.target.value)}
						name="room"
						placeholder="Your Booking Room"
						required
					/>
					<input
						type="text"
						name="address"
						placeholder="Address"
						required
					/>
					<input
						type="text"
						name="phone"
						placeholder="Phone Numbar"
						required
					/>
					<input type="submit" value="Order Now" />
				</form>
			</div>
			{/* order show */}
			<div>
				<h2>Your Total Order: {orders.length || 0}</h2>
			</div>
		</div>
	);
};

export default Order;
