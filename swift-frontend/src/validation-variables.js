const Joi = require('joi');
const dotenv = require('dotenv');

// caarregando as variáveis do .env
dotenv.config();

const envSchema = Joi.object({
  REACT_APP_HOST_BACKEND: Joi.string().required(),
  REACT_APP_PORT_BACKEND: Joi.number().required(),
}).unknown(true);

const { error } = envSchema.validate(process.env, { abortEarly: false, convert: true });

if (error) {
  console.error('====================================');
  console.error('❌ Erro na validação das variáveis de ambiente!');
  console.error('====================================');

  error.details.forEach(detail => {
    console.error(`- ${detail.message}`);
  });

  console.error('\nPor favor, verifique e preencha seu arquivo .env.');
  console.error('====================================');
  process.exit(1);
} else {
  console.log('✅ Variáveis de ambiente validadas com sucesso.');
}