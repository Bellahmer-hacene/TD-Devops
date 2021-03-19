import React from 'react';
import { Button, TextField } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { auth } from '..';
import Routes from '../Constantes/Routes';
import { Redirect } from 'react-router';
import { login } from '../Helpers/Auth';
import { Link } from 'react-router-dom';

class Register extends React.Component {
    constructor(props){
        super(props)
        this.state = {email:'', password:'', open:false, msg:'', saverity:'', redirect:false, backdrop:false}
    }
    register = ()=>{
        if(this.state.email!='' && this.state.password!=''){
            auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                login(user)
                this.setState({email:'', password:'', open:true, saverity:'success', msg:'User created successfully', backdrop:true}, ()=>{
                    setTimeout(() => {
                        this.setState({redirect:true})
                    }, 3000);
                })
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                this.setState({open:true, saverity:'error', msg:errorMessage})
            });
        }else{
            this.setState({open:true, saverity:'error', msg:'Email and password cannot be empty'})
        }
    }
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({open:false});
    };
    render (){
        return (
            <div style={{marginTop:'100px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'4% 0'}}>
                <TextField onChange={(e)=>{this.setState({email:e.target.value})}} id="email" type="email" value={this.state.email} label="Email" variant="outlined" style={{marginBottom:'1rem', width:'70%'}} />
                <TextField onChange={(e)=>{this.setState({password:e.target.value})}} id="password" type="password" value={this.state.password} label="Password" variant="outlined" style={{marginBottom:'1rem', width:'70%'}} />
                <Button onClick={()=>{this.register()}} variant="contained" color="primary" style={{marginBottom:'1rem', width:'70%'}}>
                    Register
                </Button>
                <Link to={Routes.login} style={{textDecoration:'none', color:'gray'}}>
                    <Button variant="contained" color="secondary">
                        Login
                    </Button>
                </Link>
                <Snackbar open={this.state.open} autoHideDuration={3000} onClose={this.handleClose}>
                    <MuiAlert onClose={this.handleClose} elevation={6} variant="filled" severity={this.state.saverity}>{this.state.msg}</MuiAlert>
                </Snackbar>
                <Backdrop style={{zIndex:999, color:'#fff'}} open={this.state.backdrop} onClick={()=>{this.setState({backdrop:false})}}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                {this.state.redirect && <Redirect to={Routes.home}></Redirect>}
            </div>
        );
    }
}

export default Register;