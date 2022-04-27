import React, { useEffect, useState } from "react";
import Room from "./Room/Room";
import "./Services.css";

const Services = () => {
	const [rooms, setrooms] = useState([]);

	useEffect(() => {
		fetch("http://localhost:5000/service")
			.then((res) => res.json())
			.then((data) => setrooms(data));
	}, []);

	return (
		<section
			id="services"
			className="services-area"
			data-aos="slide-right"
			data-aos-duration="500"
		>
			<div className="container">
				<div className="services">
					<h2 className="section-title">Services</h2>
					<div className="services-container">
						{rooms.map((room) => (
							<Room room={room} key={room.id}></Room>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Services;
