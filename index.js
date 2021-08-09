const express = require('express');

const bodyParser = require('body-parser');

const urlparse = require('url-parse');

const cors = require('cors');

const fs = require('fs');
const upload = require('express-fileupload');

const app = express();

// const multer = require('multer');

let port = process.env.PORT || 3334;

const nodemailer = require('nodemailer');
const { dir } = require('console');

let Transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'email@email.em',
        pass: 'emailPassword'
    }
});

app.use(cors());
app.use(urlparse)
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(upload());
app.use(express.static('public'));

//const PORT = '3334';
const HOST = '127.0.0.1';

app.get('/', (req, res) => {
    res.send('Hello World!');
});

//Subir img
app.post('/api/v2/img',(req,res) => {
    let file = req.files.img;
    let today = new Date();
    var dir = './public' + `/${req.body.data}/`;
    var image = `/${req.body.data}/` + today.valueOf().toString()+ file.name;
    
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);

    file.mv(`${dir}${today.valueOf().toString()}${file.name}`, err => {
        if(err){
            return res.status(500).send({message:err});
        }
        return res.status(200).send({path:image})
    });

});

app.post('/api/v2/email',(req,res)=>{//Confirmacion de Cuenta a traves de correo
    
    Transport.sendMail({
        from: "ESI A.C",
        to: req.body.email,
        subject: "Activa tu cuenta",
        html: `
            <h1>Hola, ${req.body.nombre} Bienvenido!</h1>
            <a href="https://croma.esimx.org/activate/${req.body.token}">Por favor active su cuenta presionando aquí!</a>
        `
    }).then((r) => {
        res.send({message: r + ' Mensaje enviado'})
    }
    )
    .catch((e) => {
        res.send({message: e + ' Mensaje no enviado'})
    }
    );
});

app.post('/api/v2/password',(req,res)=>{//Cambio de contraseña a traves de correo
    
    Transport.sendMail({
        from: "ESI A.C",
        to: req.body.email,
        subject: "Solicitud de cambio de contraseña",
        html: `
            <h1>Hola, si usted no hizo la solicitud por favor ignore este correo</h1>
            <a href="https://croma.esimx.org/fpassword/${req.body.token}">Cambio de contraseña aqui!</a>
        `
    }).then((r) => {
        res.send({message: r + ' Mensaje enviado'})
    }
    )
    .catch((e) => {
        res.send({message: e + ' Mensaje no enviado'})
    }
    );
});

app.listen(port, () => {
    console.log(`Server running on http://${HOST}:${port}`);
});
