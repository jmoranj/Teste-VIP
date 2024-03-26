import axios from "axios";
import React, { useState } from "react";
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

const Checkbox = styled.input`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-75%);
  cursor: pointer;
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

export default function KeyAuth() {
	const [password, setPassword] = useState("");
	const [auth, setAuth] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const fetchAuth = async () => {
		try {
			const cpf = localStorage.getItem("cpf");
			const response = await axios.post("http://localhost:4000/authenticate", {
				cpf: cpf,
				senha: password
			});
			window.location.href = "/secAuth";

			if (response.data.authenticated) {
				setAuth(true);
			} else {
				setAuth(false);
			}
		} catch (error) {
			console.log("Error during authentication:", error);
		}
	};

	const handleTogglePassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<Container>
			<LoginTitle>Coloque sua senha</LoginTitle>

			<UserBox>
				<InputContainer>
					<InputBox
						type={showPassword ? "text" : "password"}
						placeholder="Senha"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Checkbox onChange={handleTogglePassword} type="checkbox" />
				</InputContainer>
			</UserBox>

			<UserBox>
				<ConfirmButton onClick={fetchAuth}>Avançar</ConfirmButton>
			</UserBox>
		</Container>
	);
}
