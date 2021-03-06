import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './ContactForm.css';
import Button from '../../components/Buttons/Button';
import Spinner from '../../components/Spinner/Spinner';
import Input from '../../components/Input/Input';
import ErrorMessage from '../../components/ErrorLoadingMessage/ErrorMessage';
import * as actionCreators from '../../store/actions/actionCreators';
import { checkForValidity } from '../../shared/validation';

class ContactForm extends Component {
  state = {
    inputPattern: {
      name: {
        value: '',
        inputSettings: {
          inputType: 'input',
          type: 'text',
          placeholder: 'Name',
        },
        inputLabel: {
          label: '',
        },
        validation: {
          isRequired: true,
          valid: false,
          touch: false,
        },
      },

      surname: {
        value: '',
        inputSettings: {
          inputType: 'input',
          type: 'text',
          placeholder: 'Surname',
        },
        inputLabel: {
          label: '',
        },
        validation: {
          isRequired: true,
          valid: false,
          touch: false,
        },
      },

      email: {
        value: '',
        inputSettings: {
          inputType: 'input',
          type: 'text',
          placeholder: 'E-mail',
        },
        inputLabel: {
          label: '',
        },
        validation: {
          isRequired: true,
          valid: false,
          touch: false,
        },
      },

      street: {
        value: '',
        inputSettings: {
          inputType: 'input',
          type: 'text',
          placeholder: 'Street',
        },
        inputLabel: {
          label: '',
        },
        validation: {
          isRequired: true,
          valid: false,
          touch: false,
        },
      },

      city: {
        value: '',
        inputSettings: {
          inputType: 'input',
          type: 'text',
          placeholder: 'City',
        },
        inputLabel: {
          label: '',
        },
        validation: {
          isRequired: true,
          valid: false,
          touch: false,
        },
      },

      cardPayment: {
        value: false,
        inputSettings: {
          inputType: 'checkbox',
          type: 'checkbox',
        },
        inputLabel: {
          label: 'Card payment',
        },
        validation: {
          isRequired: false,
          valid: true,
          touch: false,
        },
      },
    },
    readyToSubmit: false, // state validation
  }

  submitButton = (evt) => {
    evt.preventDefault();
    this.props.changeLoadingVal();
    const stateValues = {};

    for (const key in this.state.inputPattern) {
      stateValues[key] = this.state.inputPattern[key].value;
    }

    const contact = {
      ingredients: this.props.ramen,
      totalPrice: this.props.totalPrice.toFixed(2),
      contactInfo: stateValues,
      userId: this.props.userId,
      orderDate: Date.now()
    };

    this.props.axiosPostOrderHandler(contact, this.props.token);
  }

  onChangeHandler = (evt, objName) => {
    const stateObjCopy = JSON.parse(JSON.stringify(this.state.inputPattern)); // obj deep clone
    let readyToSubmit = true;

    stateObjCopy[objName].value = evt.target.value;
    stateObjCopy[objName].validation.valid = checkForValidity(stateObjCopy[objName].value, stateObjCopy[objName].validation.isRequired, objName);
    stateObjCopy[objName].validation.touch = true;

    for (const objNames in stateObjCopy) {
      readyToSubmit = stateObjCopy[objNames].validation.valid && readyToSubmit;
    }

    if (objName === 'cardPayment') {
      stateObjCopy[objName].value = evt.target.checked;
    }

    this.setState({
      inputPattern: stateObjCopy, readyToSubmit,
    });
  }

  render() {
    let message = <h4 className={classes.FormHeader}>Please enter your details...</h4>;
    const configArray = [];

    for (const key in this.state.inputPattern) {
      configArray.push({
        id: key,
        value: this.state.inputPattern[key].value,
        config: this.state.inputPattern[key].inputSettings,
        inputLabel: this.state.inputPattern[key].inputLabel,
        validation: this.state.inputPattern[key].validation,
      });
    }

    let form = configArray.map(input => (
      <Input
        key={input.id}
        inputtype={input.config.inputType}
        placeholder={input.config.placeholder}
        type={input.config.type}
        value={input.value}
        label={input.inputLabel.label}
        valid={!input.validation.valid}
        touch={input.validation.touch}
        change={evt => this.onChangeHandler(evt, input.id)}
      />
    ));

    let subButton = (
      <Button clicked={this.submitButton} disabled={!this.state.readyToSubmit} btn="SubmitButton">
        Order now!
      </Button>
    );

    if (this.props.loading) {
      form = <Spinner />;
      message = <div style={{ display: 'none' }}> </div>;
      subButton = '';
    }
    if (this.props.errorPostFail) {
      form = <ErrorMessage />;
    }

    return (
      <div className={classes.FormContainer}>
        {message}
        <form className={classes.Form}>
          {form}
          {subButton}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ramen: state.ramenData.ramen,
  totalPrice: state.ramenData.totalPrice,
  errorPostFail: state.orderData.errorPostFail,
  loading: state.orderData.loading,
  response: state.orderData.response,
  token: state.authData.token,
  userId: state.authData.userId,
});

const mapDispatchToProps = dispatch => ({
  axiosPostOrderHandler: (contact, token) => {
    dispatch(actionCreators.axiosPostOrder(contact, token));
  },

  changeLoadingVal: () => dispatch(actionCreators.changeLoadingVal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm);
