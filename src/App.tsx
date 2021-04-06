import { useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { ValidationError } from 'yup';

import './App.css';

interface FormData {
  name: string;
  email: string;
  password: string;
}

export const App = () => {
  const handleSubmit = useCallback(async (values: FormData, { setSubmitting, setErrors }: FormikHelpers<FormData>) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Campo obrigatório'),
        email: Yup.string().required('Campo obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().required('Campo obrigatório')
          .min(6, 'A senha deve ter no mínimo 6 caracteres'),
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
        const formErrors: FormData = {} as FormData;

        err.inner.forEach(error => {
          const path = error.path;

          if(path === 'name' || path === 'email' || path === 'password'){
            formErrors[path] = error.message ;
          }
        })
        setErrors(formErrors); 
      }
    }
  }, []);
  
  return (
    <div>
      <Formik
        initialValues={{name: '', email: '', password: ''} as FormData}
        onSubmit={handleSubmit}
      > 
      <Form>
        <h1>Cadastro</h1>
          <Field type="text" name="name" placeholder="Nome" />
          <ErrorMessage name="name" component="div" className="errorBox" />

          <Field type="text" name="email" placeholder="E-mail" />
          <ErrorMessage name="email" component="div" className="errorBox" />

          <Field type="password" name="password" placeholder="Senha" />
          <ErrorMessage name="password" component="div" className="errorBox" />

          <button type="submit">
            Cadastrar
          </button>
        </Form>
      </Formik>
    </div>
  )
};
 