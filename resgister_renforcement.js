import Auth from 'auth.js'
import assert from 'assert'

/**
 * 
 * verifier le format de l'email et ne doit pas etre vide
 */
function bonmail(email)

{
	var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');

    a = document.bonmail.value	
	if(reg.test(mail) && a !='')
	{
		return re.test(String(email).toLowerCase());
	}
	else
	{
		return('error');
	}
}

/***
    Les tests unitaires pour register
*/

class AuthUnit {
    constructor(){
        this.component = new Auth();
    }

    emailTest = ()=>{
        describe('emailTest', () => {
            test('Doit etre en bon format', () => {
                const res = bonmail(this.component.state.password);
                assert(res, 'Invalid mail')
            });
        });
    }

    MDPtest = ()=>{
        describe('MDPtest', () => {
            test('mdp foit contenir plus de 8 caractére', () => {
                const res = this.component.state.password.length>=8;
                assert(res, 'mdp Invalid')
            });
        });
    }
	
/** Mot de passe doit pas etre vide*/

MDPtest = ()=>{
        describe('MDPtest', () => {
            test('mdp doit pas etre vide', () => {
                const res = this.component.state.password!='';
                assert(res, 'mdp Invalid')
            });
        });
    }
