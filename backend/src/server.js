const express = require("express");
const bodyParser = require("body-parser");
const md5 = require('md5');
const moment = require('moment-timezone');
const { Op } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 4000;

const vip_clientes = require('./usersModel.js');
const vip_movcli = require('./movModel.js');

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use(bodyParser.json());

app.post("/confirm-access", async (req, res) => {
	const { userId, accessDateTime, confirmingExit } = req.body;

	try {
		if (!userId || !accessDateTime) {
			return res.status(400).json({ error: "Dados incompletos para confirmar o acesso." });
		}

		const user = await vip_clientes.findByPk(userId);
		if (!user) {
			return res.status(404).json({ error: "Usuário não encontrado." });
		}

		const brasiliaDateTime = moment.tz(new Date(), 'America/Sao_Paulo').format();

		await vip_movcli.create({
			Id_cliente: userId,
			Dthrent: accessDateTime,
			Dthrsai: confirmingExit ? brasiliaDateTime : null,
			Idstatus: confirmingExit ? 1 : -1
		});
		res.status(200).json({ message: "Acesso confirmado com sucesso." });
	} catch (error) {
		console.error("Erro ao registrar acesso:", error);
		res.status(500).json({ error: "Erro ao registrar acesso." });
	}
});


app.get("/user/:cpf", async (req, res) => {
	const { cpf } = req.params;

	try {
		const user = await vip_clientes.findOne({
			where: { Cpf: cpf },
			attributes: ['Id_cliente', 'Nome', 'Foto', 'DiasAcesso', 'HriniAcesso', 'HrFimAcesso']
		});

		if (!user) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		if (user.Foto) {
			user.Foto = `data:image/jpeg;base64,${user.Foto}`;
		}

		const lastAccessData = await vip_movcli.findOne({
			where: { Id_cliente: user.Id_cliente },
			order: [['Dthrent', 'DESC']]
		});

		const currentDate = new Date();
		const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
		const currentMonthAccessCount = await vip_movcli.count({
			where: {
				Id_cliente: user.Id_cliente,
				Dthrent: { [Op.gte]: firstDayOfMonth }
			}
		});

		return res.status(200).json({
			userId: user.Id_cliente,
			fullName: user.Nome,
			photo: user.Foto,
			accessType: lastAccessData ? (lastAccessData.Idstatus === 1 ? "ENTRADA" : "SAIDA") : "Sem registros de acesso",
			accessDateTime: lastAccessData ? lastAccessData.Dthrent : "Sem registros de acesso",
			lastAccessDateTime: lastAccessData ? lastAccessData.Dthrsai || lastAccessData.Dthrent : "Sem registros de acesso",
			currentMonthAccessCount: currentMonthAccessCount,
			DiasAcesso: user.DiasAcesso,
			HriniAcesso: user.HriniAcesso,
			HrFimAcesso: user.HrFimAcesso
		});
	} catch (error) {
		console.error("Erro ao obter dados do usuário:", error);
		return res.status(500).json({ error: "Erro ao obter dados do usuário" });
	}
});

app.post("/authenticate", async (req, res) => {
	const { cpf, senha } = req.body;

	try {
		const user = await vip_clientes.findOne({ where: { cpf: cpf } });

		if (!user) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		if (!senha || senha.trim() === '') {
			return res.status(401).json({ error: "Senha inválida" });
		}

		const senhaCriptografada = md5(senha);

		if (senhaCriptografada !== user.Senha) {
			return res.status(401).json({ error: "Senha incorreta" });
		}

		res.status(200).json({ message: "Autenticação bem-sucedida" });
	} catch (error) {
		console.error("Erro ao autenticar usuário:", error);
		res.status(500).json({ error: "Erro ao autenticar usuário" });
	}
});

app.post("/secondAuth", async (req, res) => {
	const { cpf, secondAuthMethod, secondAuthData } = req.body;

	try {
		const user = await vip_clientes.findOne({ where: { cpf: cpf } });

		if (!user) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		const userBirthDate = new Date(user.Dtnasc);

		const formattedUserBirthDates = {
			"Dia e Ano de Nascimento": `${userBirthDate.getDate() + 1}-${userBirthDate.getFullYear()}`,
			"Mês e Ano de Nascimento": `${userBirthDate.getMonth() + 1}-${userBirthDate.getFullYear()}`,
			"Dia e Mês de Nascimento": `${userBirthDate.getDate() + 1}-${userBirthDate.getMonth() + 1}`,
			"Nome da Mãe": user.Mae
		};

		const correctFormattedBirthDate = formattedUserBirthDates[secondAuthMethod];

		if (!correctFormattedBirthDate) {
			return res.status(400).json({ error: "Método de autenticação desconhecido" });
		}

		if (secondAuthData !== correctFormattedBirthDate) {
			return res.status(401).json({ error: "Informação de segunda verificação incorreta" });
		}

		const userId = user.Id_cliente;
		res.status(200).json({ authenticated: true, userId: userId });

	} catch (error) {
		console.error("Erro ao autenticar usuário:", error);
		res.status(500).json({ error: "Erro ao autenticar usuário" });
	}
});



app.get("/users", async (req, res) => {
	try {
		const users = await vip_clientes.findAll();
		res.json(users);
	} catch (error) {
		console.error("Erro ao buscar usuários:", error);
		res.status(500).json({ error: "Erro ao buscar usuários" });
	}
});

app.get("/movcli", async (req, res) => {
	try {
		const movcli = await movCli.findAll();
		res.json(movcli);
	} catch (error) {
		console.error("Erro ao buscar os movimentos:", error);
		res.status(500).json({ error: "Erro ao buscar os movimentos" });
	}
});

app.listen(PORT, () => {
	console.log(`Server working on PORT ${PORT}`);
});
