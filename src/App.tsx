import { useCallback, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { ValidationError } from 'yup';
import { FiAlertCircle } from 'react-icons/fi'

import './App.css';

interface FormData {
  [key: string]: string;
}

interface TooltipProps {
  color: string;
  opacity: number;
}

export const App = () => {
  const [ tooltipDatas, setTooltipDatas ] = useState<TooltipProps>({ opacity: 0, color: ''});
  
  const handleMouseEnter = useCallback(() => {
    setTooltipDatas({ ...tooltipDatas, opacity: 1, })
  }, [tooltipDatas]);

  const handleMouseLeave = useCallback(() => {
    setTooltipDatas({ ...tooltipDatas, opacity: 0, })
  }, [tooltipDatas]);

  const handleSubmit = useCallback(async (values: FormData, { setSubmitting, setErrors }: FormikHelpers<FormData>) => {
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
  }, []);
  
  return (
    <div>
      <Formik
        initialValues={{name: '', email: '', password: '', passwordConfirmation: ''} as FormData}
        onSubmit={handleSubmit}
      > 
      <Form>
        <h1>Cadastro</h1>
          <Field type="text" name="name" placeholder="Nome" />
          <ErrorMessage name="name" component="div" className="errorBox" />

          <Field type="text" name="email" placeholder="E-mail" />
          <ErrorMessage name="email" component="div" className="errorBox" />

          <div id="password-strength-container">
            <Field type="password" name="password" placeholder="Senha"  />
            <div className="tooltip-container" >
              <span className="tolltip" style={{ opacity: tooltipDatas.opacity }} >Senha fraca</span>
              { tooltipDatas.color && (
                <FiAlertCircle size={22} color={tooltipDatas.color} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
              )}
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