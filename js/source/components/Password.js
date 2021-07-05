import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Crypto from '../util/Crypto';

// Google: react password show hide
//     https://codepen.io/Don-m/pen/mmgyQG?editors=0010

class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: props.mode || 'encrypt',
            showContent: 'password',
            showSecretkey: 'password',
            secretText: '',
            plainText: '',
            encryptedText: props.defaultValue,
        };

    }
    getValue() {
        return this.state.encryptedText;
    }
    update(secretText, plainText) {
        this.setState((prevState, props) => {
            let sT = (secretText == null) ? prevState.secretText : secretText;
            let pT =  (plainText == null) ? prevState.plainText : plainText;
            let eT = prevState.encryptedText;
            if (prevState.mode === 'decrypt')
                pT =  this.decrypt(sT, eT);
            else
                eT =  this.encrypt(sT, pT);
            return {
                secretText: sT,
                plainText: pT,
                encryptedText: eT,
            }
        });
    }
    encrypt(salt, text)
    {
        return Crypto.Encrypt(text, salt);
        // let myCipher = Crypto.xCipher(salt || '');
        // let scambled = myCipher(text || '');
        // return scambled;
    }
    decrypt(salt, scambled)
    {
        return Crypto.Decrypt(scambled, salt);  // U2FsdGVkX19guu+rpSVb60BNiN1K3ShZ23rSSzVy682m6w3VKExtL/fYT0iBI1AA
        // let myDecipher = Crypto.xDecipher(salt || '');  //thisiscool
        // let plain = myDecipher(scambled || '');  // 4476767877726a33757c7c6771727f7f
        // return plain;  // Weekday football   U2FsdGVkX1+g834fokw18q0Ak9eQ4gFGpx1wnF7450053dx7kdlCvQVn15HSrK5d
    }
    render() {
        return (
            <div className="Password">
                <checkbox className="PasswordModeCheckbox" onClick={() => this.setState({ mode: this.state.mode === 'decrypt' ? 'encrypt' : 'decrypt' })}>{this.state.mode} mode</checkbox>
                <div>
                    <div className="PasswordLabel">Secret Key: </div>
                    <input className="PasswordInput" type={this.state.showSecretkey} id="secretkey" onChange={e => this.update(e.target.value, null)} />
                    <input className="PasswordCheckbox" type="checkbox" onClick={() => this.setState({ showSecretkey: this.state.showSecretkey === 'password' ? 'input' : 'password' })}></input>
                </div>
                <div>
                    <div className="PasswordLabel">Plain: </div>
                    <input className="PasswordInput" disabled={this.state.mode==='decrypt'} type={this.state.showContent} id="content" value={this.state.plainText} onChange={e => this.update(null, e.target.value)} />
                    <input className="PasswordCheckbox" type="checkbox" onClick={() => this.setState({ showContent: this.state.showContent === 'password' ? 'input' : 'password' })}></input>
                </div>
                <div>
                    <div className="PasswordLabel">Encrypted: </div>
                    <input className="PasswordInput" disabled={this.state.mode!=='decrypt'} type="text" id="encryptedcontent" value={this.state.encryptedText} ></input>
                </div>
            </div>
        );
    }
}

Password.propTypes = {
    onAction: PropTypes.func,
};

Password.defaultProps = {
    onAction: () => { },
};

export default Password