import { useCallback, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { ValidationError } from 'yup';
import { FiAlertCircle } from 'react-icons/fi'

import './App.css';

const strong = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#()$%^&*.+=])(?=.{8,})");
const medium = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))");

interface FormData {
  [key: string]: string;
}

interface TooltipProps {
  status: {
    class: string;
    color: string;
  };
  message: string;
}

export const App = () => {
  const [ tooltipData, setTooltipData ] = useState<TooltipProps>({} as TooltipProps);
  const [ password, setPassword ] = useState('');

  useEffect(() => {
    if (password){
      if(strong.test(password)) {
        setTooltipData({ status: { class: 'strong', color: '#51EA4E' }, message: 'Forte'});

      } else if (medium.test(password)) {
        setTooltipData({ status: { class: 'medium', color: '#E1AC45' }, message: 'Boa'});

      } else {
        setTooltipData({ status: { class: 'weak', color: '#E74343' }, message: 'Fraca' });
        
      }
    }
  }, [password]);   

  const handleSubmit = useCallback(
    async (values: FormData, { setSubmitting, setErrors }: FormikHelpers<FormData>) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Campo obrigatório'),
        email: Yup.string().required('Campo obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().required('Campo obrigatório')
          .min(6, 'A senha deve ter no mínimo 6 caracteres'),
        passwordConfirmation: Yup
        .string()
        .required('Confirmação necessária')
        .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
      });

      values.password = password;

      await schema.validate(values, {
        abortEarly: false
      });

      setTimeout(() => {
        alert('Cadastro realizado com sucesso!')
      }, 1000);

      setSubmitting(false);
    } catch (err) {
      if (err instanceof ValidationError) {
        const formErrors: FormData = {
          name: '',
          email: '',
          password: '',
          passwordConfirmation: '',
        } as FormData;

        err.inner.forEach(error => {
          const path = error.path;

          if(path){
            formErrors[path] = error.message ;
          }
        });

        setErrors(formErrors);
      }
    }
  }, [password]);
  
  return (
    <div>
      <Formik
        initialValues={{name: '', email: '', password: '', passwordConfirmation: ''} as FormData}
        onSubmit={handleSubmit}
      > 
      <Form>
        <h1>Cadastre-se</h1>
          <Field type="text" name="name" placeholder="Nome" />
          <ErrorMessage name="name" component="div" className="errorBox" />

          <Field type="text" name="email" placeholder="E-mail" />
          <ErrorMessage name="email" component="div" className="errorBox" />

          <div className="password-strength-container">
            <Field 
              type="password" 
              name="password" 
              placeholder="Senha" 
              value={password} 
              id="teste"
              onChange={(e: any) => setPassword(e.target.value)} 
            />
            <div className="tooltip-container" >
              { tooltipData.status?.color && (
                <FiAlertCircle className="info-icon" size={22} color={tooltipData.status?.color} />
              )}
              <span className={`tolltip ${tooltipData.status?.class}`} >
                <span>{tooltipData.message}</span>
              </span>
            </div>
          </div>
          <ErrorMessage name="password" component="div" className="errorBox" />

          <Field type="password" name="passwordConfirmation" placeholder="Confirme sua senha" />
          <ErrorMessage name="passwordConfirmation" component="div" className="errorBox" />

          <button type="submit">
            Cadastrar
          </button>
        </Form>
      </Formik>
    </div>
  )
};