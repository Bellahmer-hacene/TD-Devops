class Auth{
    constructor(props){
        super(props)
        this.state = {uid: isLoggedIn()?.uid, firstname:'', lastname:'', age:'', gender:'Male', weight:'', img:'', file:null, severity:'', msg:'', open:false}
    }

    /**
     * charger l'image de l'utiliateur sur firebase et enregistrer le lien sur son profile
     */
    uploadImg = ()=>{
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => { 
            if(e.target.files.length>0){
                var file = e.target.files[0]
                this.setState({file})
                var storageRef = firebase.storage().ref('images/'+this.state.uid);
                storageRef.put(file).then((snapshot) => {
                    snapshot.ref.getDownloadURL()
                    .then(url=>{
                        firebase.database().ref('users/'+this.state.uid+'/profile').update({
                            img:url
                        })
                        this.setState({img:url})
                        this.setState({open:true, saverity:'success', msg:'Profile picture updated successfully'})
                    })
                });
            }
        }
        input.click()
        input.remove()
    }


    /**
     * Connecter l'utilisateur avec son email et mot de passe
     */
    login = ()=>{
        if(this.state.email!='' && this.state.password!=''){
            auth.signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user
                this.setState({email:'', password:'', open:true, saverity:'success', msg:'Logged in successfully', backdrop:true}, ()=>{
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
}