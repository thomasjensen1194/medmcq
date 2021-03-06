import * as Yup from 'yup';

export const validationRegex = {
  // username validation stammer fra https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
  username: /^[a-zA-ZæøåÆØÅ0-9]+([._]?[a-zA-Z0-9]+)*$/,
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/
};

const username = Yup.string()
  .min(3, 'Brugernavnet er for kort')
  .matches(
    validationRegex.username,
    'Dit brugernavn må kun indeholde _ og punktum, samt tal og bogstaver. Punktum og _ må ikke efterfølge hinanden, og der må ikke bruges 2 i træk'
  );
const password = Yup.string().matches(
  validationRegex.password,
  'Kodeordet skal være mindst 6 tegn, indeholde mindst et stort bogstav, et lille bogstav og et tal'
);
const email = Yup.string().email();
const confirmPassword = Yup.string().oneOf(
  [Yup.ref('password')],
  'Kodeord skal være ens / The passwords should match'
);

export const resetSchema = Yup.object().shape({
  password: password.required('Du skal angive et kodeord / You must provide a password'),
  confirmPassword: confirmPassword.required(
    'Du skal angive dit kodeord igen / You must provide your password again'
  )
});

export const signupSchema = Yup.object().shape({
  username: username.required('Du skal angive et brugernavn / You must provide a username'),
  email: email.notRequired(),
  password: password.required('Du skal angive et kodeord / You must provide a password'),
  confirmPassword
});

export const editProfileSchema = Yup.object().shape({
  password,
  confirmPassword,
  email
});
