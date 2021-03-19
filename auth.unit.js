import Auth from 'auth.js'
import assert from 'assert'

/**
 * 
 * verifier le format de l'email
 */
const checkEmail = (email)=>{
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}
/**
 * verifier le type du fichier a charger (doit etre une image)
 */
const isImg = (file)=>{
    const fileType = file['type'];
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return validImageTypes.includes(fileType)
}
/**
 * verifier laa taille du fichier a charger (doit etre inferieure a 2MB)
 */
const checkSize = (file)=>{
    var size = file.files[0].size / 1024 / 1024;
    return size<=2
}

/***
    Les tests unitaires pour la methode uploadImg et login
*/
class ImgUnit {
    constructor(){
        this.component = new Auth();
    }

    testImg = ()=>{
        describe('testImg', () => {
            test('Doit refuser le fichier si ce n\'est de type image', () => {
                const res = isImg(this.component.state.img);
                assert(res, 'le fichier n\'est pas une image')
            });
            test('Doit refuser le fichier s\'il depasse 2MB', () => {
                const res = checkSize(this.component.state.img);
                assert(res, 'le fichier depasse 2MB de taille')
            });
        });
    }
}
class AuthUnit {
    constructor(){
        this.component = new Auth();
    }

    testEmail = ()=>{
        describe('testEmail', () => {
            test('Doit refuser la chaine si elle n\'est pas dans le format d\'une adresse mail', () => {
                const res = checkEmail(this.component.state.password);
                assert(res, 'la chaine n\'est pas une adresse mail')
            });
        });
    }

    testPassword = ()=>{
        describe('testPassword', () => {
            test('Doit refuser le mot de passe si il contient moins de 6 caracteres', () => {
                const res = this.component.state.password.length>=6;
                assert(res, 'le mot de passe n\'est pas securise')
            });
        });
    }

    testName = ()=>{
        describe('testName', () => {
            test('Doit refuser le nom s\'il n\'est pas une chaine', () => {
                const res = typeof this.component.state.lastname == 'string';
                assert(res, 'le nom n\'est pas une chaine')
            });
            test('Doit refuser le nom s\'il n\'est pas une chaine', () => {
                const res = this.component.state.lastname.length>=5
                assert(res, 'le nom doit contenir plus de 4 caracteres')
            });
            test('Doit refuser le prenom s\'il n\'est pas une chaine', () => {
                const res = typeof this.component.state.firstname == 'string';
                assert(res, 'le prenom n\'est pas une chaine')
            });
            test('Doit refuser le prenom s\'il n\'est pas une chaine', () => {
                const res = typeof this.component.state.firstname.length>=5
                assert(res, 'le prenom doit contenir plus de 4 caracteres')
            });
        });
    }
}