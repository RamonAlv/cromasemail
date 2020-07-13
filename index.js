const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

let port = process.env.PORT || 3334;

const nodemailer = require('nodemailer');

let Transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '171106@ids.upchiapas.edu.mx',
        pass: 'e@rMich138831.'
    }
});

app.use(cors())                                            
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

//const PORT = '3334';
const HOST = '127.0.0.1';

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/v2/email',(req,res)=>{//Confirmacion de Cuenta a traves de correo
    
    Transport.sendMail({
        from: "ESI A.C",
        to: req.body.email,
        subject: "Hola activa tu cuenta",
        html: `
            <h1>Hola ${req.body.nombre} Bienvenido!</h1>
            <a href="https://croma.esimx.org/activate/${req.body.token}">Porfavor active su cuenta desde aqui!</a>
        `
    }).then((r) => {
        res.send({message: r + ' Menseje enaviado'})
    }
    )
    .catch((e) => {
        res.send({message: e + ' Menseje no enaviado'})
    }
    );
});

app.post('/api/v2/password',(req,res)=>{//Cambio de contraseña a traves de correo
    
    Transport.sendMail({
        from: "ESI A.C",
        to: req.body.email,
        subject: "Solicitud de cambio de contraseña",
        html: `
            <h1>Hola si usted no hizo la solicitud porfavor ingnore este correo</h1>
            <a href="https://croma.esimx.org/fpassword/${req.body.token}">Cambio de contraseña aqui!</a>
        `
    }).then((r) => {
        res.send({message: r + ' Menseje enaviado'})
    }
    )
    .catch((e) => {
        res.send({message: e + ' Menseje no enaviado'})
    }
    );
});

app.listen(port, () => {
    console.log(`Server running on http://${HOST}:${port}`);
});
