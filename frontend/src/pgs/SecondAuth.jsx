import axios from "axios";
import React, { useEffect, useState } from "react";
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

const InputContainer = styled.div`
	position: relative;
`;

const InputBox = styled.input`
	border: none;
	background-color: #dddddd;
	border-radius: 8px;
	height: 5vh;
	text-decoration: none;
	padding-left: 2vh;
	width: 50vh;
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

	&:hover {
		height: 4vh;
		width: 9vh;
	}
`;

const MethodInfo = styled.div`
	margin-top: 20px;
`;

export default function SecondAuth(){
	const [secondAuthInfo, setSecondAuthInfo] = useState("");
	const [password, setPassword] = useState("");
	const [inputValue, setInputValue] = useState("");
	const [authenticated, setAuthenticated] = useState(false);
	const [methodRequiresDate, setMethodRequiresDate] = useState(true);

	useEffect(() => {
		generateRandomMethod();
	}, []);

	const handleInputChange = (e) => {
		const value = e.target.value;

		if (methodRequiresDate) {
			if (value.length === 3) {
				if (value[value.length - 1] === '-') {
					setInputValue(value.slice(0, value.length - 1));
					return;
				}
			}

			if (value.length === 2 && value[value.length - 1] !== '-') {
				setInputValue(value + '-');
			} else {
				setInputValue(value.replace(/[^0-9-]/g, '').slice(0, 7));
			}
		} else {
			setInputValue(value);
		}
	};

	const generateRandomMethod = () => {
		const methods = ["Nome da Mãe", "Dia e Ano de Nascimento", "Mês e Ano de Nascimento", "Dia e Mês de Nascimento"];
		const randomIndex = Math.floor(Math.random() * methods.length);
		const randomMethod = methods[randomIndex];
		setSecondAuthInfo(randomMethod);
		setMethodRequiresDate(randomMethod !== "Nome da Mãe");
	};

	const fetchSecondAuth = async () => {
		try {
			const response = await axios.post("http://localhost:4000/secondAuth", {
				cpf: localStorage.getItem("cpf"),
				senha: password,
				secondAuthMethod: secondAuthInfo,
				secondAuthData: inputValue
			});

			if (response.data.authenticated) {
				setAuthenticated(true);
				window.location.href = "/confirmation";
			} else {
				setAuthenticated(false);
				console.log("Informação de segunda verificação incorreta");
			}
		} catch (error) {
			console.log(error);
		}
	}

	const handleConfirmClick = async () => {
		await fetchSecondAuth();
	};

	return (
		<Container>
			<LoginTitle>Segunda Verificação</LoginTitle>
			<UserBox>
				<InputContainer>
					{methodRequiresDate ? (
						<InputBox
							mask="99/99/9999"
							placeholder="DD/MM/AAAA"
							value={inputValue}
							onChange={handleInputChange}
						/>
					) : (
						<InputBox
							type="text"
							placeholder="Nome da Mãe"
							value={inputValue}
							onChange={handleInputChange}
						/>
					)}
				</InputContainer>
				<MethodInfo>Método de verificação: {secondAuthInfo}</MethodInfo>
			</UserBox>
			<UserBox>
				<ConfirmButton onClick={handleConfirmClick}>Avançar</ConfirmButton>
			</UserBox>
		</Container>
	);
};
