const express = require ('express');
const router = express.Router();
const bcrypt = require ('bcryptjs');
const passport = require ('passport');
const randomstring = require ('randomstring');

//User model
const User = require ('../models/user')

//login page
router.get('/login', (req, res) => res.render ('login'));


//Register Page

router.get('/register', (req, res) => res.render ('register'));

//Register handle

router.post('/register', (req,res) => {
console.log(req.body)
const{name, email, password, password2} =req.body;

 let errors = [];


 //Check required fields
if (!name || !email || !password || !password2){
    errors.push({msg: 'Please fill in all fields'});

}
    //Check passwords match

    if (password !== password2){

        errors.push({msg:'Passwords do not match' });


    }

    //Check password length
    if(password.length<6){

            errors.push({ msg : 'Password should be at least 6 characters' });
    }

    if (errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
       //Validation passed
       User.findOne ({ email: email })
        .then(user => {
            if(user){
                //User exists
                errors.push ({msg: 'Email is already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else {
                    const newUser = new User({
                    name,
                    email,
                    password
                    });
                   //Hash Password
                   bcrypt.genSalt(10, (err,salt) =>
                    bcrypt.hash(newUser.password, salt, (err,hash) => {
                        if (err) throw err;
                        //set password to hash (doesnt seen on db)
                        newUser.password = hash;
                        // save user
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg','You are now registered and can log in');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                   } ))
            }


        });

    }

});

//Reset-Password
router.get('/reset-password', (req, res) => res.render ('reset-password'));

//Reset password handle

router.post('/reset-password', (req,res) => {
    console.log(req.body)
    const{email, password, password2} =req.body;
    
     let errors = [];

     //if e-mail registered
     User.findOne ({ email: email }) 
     .then(user => {
         if(user){
                 const newUser = new User({
                 email,
                 password
                
                 });
                //Hash Password
                bcrypt.genSalt(10, (err,salt) =>
                 bcrypt.hash(newUser.password, salt, (err,hash) => {
                     if (err) throw err;
                     //set password to hash (doesnt seen on db)
                     newUser.password = hash;
                     // save user
                     newUser.save()
                     .then(user => {
                         req.flash('success_msg','Password has been changed can log in');
                         res.redirect('/users/login');
                     })
                     .catch(err => console.log(err));
                } ))
         }


     });
     if (password !== password2){

        errors.push({msg:'Passwords do not match' });


    }


});

//Generate Secret token

const secretToken = randomstring.generate();


//Login Handle
router.post('/login', (req, res, next)=> {
    passport.authenticate ('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req, res, next);

});

// Logout handle
router.get ('/logout',(req,res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});


router.get ('/reset-password',(req,res) => {
    res.render ('users/reset-password',{
        errors: req.session['reset-password-errors']
    })

})
module.exports = router;