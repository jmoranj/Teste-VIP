import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
	align-items: center;
	display: flex;
	justify-content: center;
	flex-direction: column;
	text-align: center;
	text-decoration: none;
	min-height: 80vh;
	position: relative;
	overflow: hidden;
`;

const UserBox = styled.div`
	padding: 10px;
`;

const LoginTitle = styled.text`
	font-size: 5vh;
	padding: 5vh;
`;

const ConfirmButton = styled.button`
	border: 1px solid;
	border-color: black;
	color: black;
	cursor: pointer;
	height: 4vh;
	transition: none;
	animation: none;
	width: 10vh;
	margin-top: 20px; 

	&:hover {
		height: 4vh;
		width: 9vh;
	}
`;

const UserInfo = styled.div`
	margin-top: 20px;
`;

const UserInfoLine = styled.p`
	font-family: Arial, Helvetica, sans-serif;
	font-size: medium;
`

export default function Confirmation() {
	const [lastAccessDateTime, setLastAccessDateTime] = useState("");
	const [currentMonthAccessCount, setCurrentMonthAccessCount] = useState(0);
	const [userData, setUserData] = useState(null);
	const [entryDateTime, setEntryDateTime] = useState(null);
	const [confirmingExit, setConfirmingExit] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const cpf = localStorage.getItem("cpf");
				const response = await axios.get(`http://localhost:4000/user/${cpf}`);
				const userData = response.data;
				setUserData(userData);
				setLastAccessDateTime(userData.lastAccessDateTime);
				setCurrentMonthAccessCount(userData.currentMonthAccessCount);
			} catch (error) {
				console.error("Erro ao obter dados do usuário:", error);
			}
		};
		fetchData();
	}, []);

	const handleConfirmAccess = async () => {
		try {
			const currentDate = new Date();
			const currentDay = currentDate.getDay();
			const currentHour = currentDate.getHours();
			const currentMinute = currentDate.getMinutes();

			if (!userData || !userData.DiasAcesso || userData.DiasAcesso[currentDay] !== '1') {
				throw new Error("Acesso não permitido hoje.");
			}

			if (!userData.HriniAcesso || !userData.HrFimAcesso) {
				throw new Error("Horário de acesso não definido.");
			}

			const startTime = new Date().setHours(parseInt(userData.HriniAcesso.split(":")[0]), parseInt(userData.HriniAcesso.split(":")[1]));
			const endTime = new Date().setHours(parseInt(userData.HrFimAcesso.split(":")[0]), parseInt(userData.HrFimAcesso.split(":")[1]));
			const currentTime = new Date().setHours(currentHour, currentMinute);
			if (currentTime < startTime || currentTime > endTime) {
				throw new Error("Acesso não permitido neste horário.");
			}

			if (confirmingExit) {
				await axios.post("http://localhost:4000/confirm-access", {
					userId: userData.userId,
					accessDateTime: entryDateTime,
					confirmingExit: confirmingExit
				}).then(response => {
					console.log("Response from server:", response);
				}).catch(error => {
					console.error("Error from server:", error);
				});
				alert("Saída confirmada!");
				setConfirmingExit(false); // 
			} else {
				setEntryDateTime(currentDate);
				alert("Entrada confirmada!");
				setConfirmingExit(true); 
			}
		} catch (error) {
			console.error("Erro ao confirmar acesso:", error);
			alert("Erro ao confirmar acesso: " + error.message);
		}
	};

	return (
		<Container>
			<LoginTitle>Confirmação de Acesso</LoginTitle>
			{userData && (
				<UserBox>
					<img src={userData.photo} alt="Foto do Usuário" />
					<UserInfo>
						<UserInfoLine>Nome: {userData.fullName}</UserInfoLine>
						<UserInfoLine>Data e Horário do Acesso: {entryDateTime ? entryDateTime.toLocaleString() : ""}</UserInfoLine>
						<UserInfoLine>Data e Hora do último acesso: {lastAccessDateTime ? new Date(lastAccessDateTime).toLocaleString() : ""}</UserInfoLine>
						<UserInfoLine>Número de Acessos no mês corrente: {currentMonthAccessCount}</UserInfoLine>
					</UserInfo>
				</UserBox>
			)}

			<ConfirmButton onClick={handleConfirmAccess}>
				{confirmingExit ? "Confirmar Saída" : "Confirmar Entrada"}
			</ConfirmButton>

		</Container>
	);
};


