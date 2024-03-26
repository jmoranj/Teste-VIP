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
`

const UserBox = styled.div`
    flex-direction: column;
    padding: 10px;
`

const InputBox = styled.input`
    border: none;
    background-color: #DDDDDD;
    border-radius: 8px;
    font-size: medium;
    height: 5vh;
    text-decoration: none;
    padding-left: 2vh;
    width: 50vh;
`

const LoginTitle = styled.text`
    font-size: 5vh;
    padding: 5vh;
`

const ConfirmButton = styled.button`
    border: 1px solid;
    border-color: black;
    color: black;
    cursor: pointer;
    height: 4vh;
    transition: none;
    animation: none;
    width: 10vh;

    &:hover{
        height: 4vh;
        width: 9vh;
    }
`

export default function CpfAuth() {

	const [cpf, setCpf] = useState('')
	const [auth, setAuth] = useState(false)

	const fetchAuth = async () => {
		try {
			const response = await axios.get(`http://localhost:4000/users?cpf=${cpf}`);
			if (response.data.length > 0) {
				setAuth(true);
				localStorage.setItem('cpf', cpf);
				window.location.href = "/keyAuth";
			} else {
				setAuth(false);
			}
		} catch (error) {
			console.log(error);
		}
	}

	const handleOnClick = () => {
		fetchAuth();
	}

	return (
		<Container>
			<LoginTitle>
				Preencha com seu CPF
			</LoginTitle>

			<UserBox>
				<InputBox type="text" placeholder="000.000.000-00" value={cpf} onChange={(n) => setCpf(n.target.value)} />
			</UserBox>

			<UserBox>
				<ConfirmButton onClick={handleOnClick}> Avançar </ConfirmButton>
			</UserBox>

		</Container>
	)
}
