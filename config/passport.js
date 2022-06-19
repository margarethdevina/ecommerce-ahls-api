const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const fs = require('fs');
const { dbQuery, dbConf } = require('./database');
const { hashPassword, createToken } = require('./encryption');
const { transporter } = require("../config/nodemailer");

const GOOGLE_CLIENT_ID = process.env.GCLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GCLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // console.log("profile from google", profile);

        // Memeriksa apakah user sudah terdaftar by login email, by response belum ditemukan dok nya
        let login = await dbQuery(`Select id, username, email, role, status FROM users where email="${profile.emails[0].value}" and password="${hashPassword(profile.id)}";`)

        if (login.length == 1) {

            //Generate token untuk dikirimkan via email ❗❗❗
            let { id, username, email, role, status } = login[0];

            let token = createToken({ id, username, email, role, status }, "1h");

            //Mengirimkan email ❗❗❗
            await transporter.sendMail({
                from: "Admin Commerce",
                to: profile.emails[0].value,
                subject: "Login by Google Account",
                html: `<div>
            <h3>Click Link Below</h3>
            <a href="${process.env.FE_URL}?otkn=${token}">Login Account Here</a>
        </div>`
            })

        } else {
            // from profile argument google
            let regis = await dbQuery(`INSERT INTO users (username, email, password, role) VALUES (${dbConf.escape(profile.displayName)},${dbConf.escape(profile.emails[0].value)},${dbConf.escape(hashPassword(profile.id))},${dbConf.escape('user')});`)

            if (regis.insertId) {
                let resultsLogin = await dbQuery(`Select id,username,email,role,status FROM users WHERE id=${regis.insertId};`);

                //Generate token untuk dikirimkan via email ❗❗❗
                let { id, username, email, role, status } = resultsLogin[0];

                let token = createToken({ id, username, email, role, status }, "1h");

                //Mengirimkan email ❗❗❗
                await transporter.sendMail({
                    from: "Admin Commerce",
                    to: profile.emails[0].value,
                    subject: "Verification Email Account from google",
                    html: `<div>
                <h3>Click Link Below</h3>
                <a href="${process.env.FE_URL}/verification/${token}">Verified Account Here</a>
            </div>`
                })

            } else {
                throw 'User not found'
            }
        }

        return done(null, profile);

    } catch (error) {
        console.log(error);
    }
}));

passport.serializeUser((user, cb) => {
    console.log("serializeUser", user)
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    console.log("deserializeUser", obj)
    cb(null, obj);
});